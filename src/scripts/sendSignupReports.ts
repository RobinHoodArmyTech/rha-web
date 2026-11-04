import { db } from "@/core/db";
import { sendCsvEmail } from "@/core/services/backend/email/emailService";

const TIME_ZONE = "Asia/Kolkata";
const MAX_RAW_EMAIL_BYTES = 9 * 1024 * 1024;

interface City {
  cityId: number;
  cityName: string;
  cityEmail: string;
}

interface SignupRow {
  fullName: string;
  email: string;
  mobileNumber: string;
}

interface Delivery {
  id: number;
  status: string;
  attempts: number;
  signupCount: number | null;
}

function getIstDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

function formatDate({ year, month, day }: { year: number; month: number; day: number }): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface ReportingPeriod {
  start: string;
  end: string;
  startUtc: Date;
  endUtc: Date;
}

function getPreviousWeek(now: Date): ReportingPeriod {
  const { year, month, day } = getIstDateParts(now);
  const todayUtc = new Date(Date.UTC(year, month - 1, day));
  const daysSinceMonday = (todayUtc.getUTCDay() + 6) % 7;
  const thisMonday = new Date(todayUtc);
  thisMonday.setUTCDate(todayUtc.getUTCDate() - daysSinceMonday);

  const previousMonday = new Date(thisMonday);
  previousMonday.setUTCDate(thisMonday.getUTCDate() - 7);
  const previousSunday = new Date(thisMonday);
  previousSunday.setUTCDate(thisMonday.getUTCDate() - 1);

  const start = formatDate({
    year: previousMonday.getUTCFullYear(),
    month: previousMonday.getUTCMonth() + 1,
    day: previousMonday.getUTCDate(),
  });
  const end = formatDate({
    year: previousSunday.getUTCFullYear(),
    month: previousSunday.getUTCMonth() + 1,
    day: previousSunday.getUTCDate(),
  });

  return {
    start,
    end,
    startUtc: new Date(`${start}T00:00:00+05:30`),
    endUtc: new Date(`${formatDate({
      year: thisMonday.getUTCFullYear(),
      month: thisMonday.getUTCMonth() + 1,
      day: thisMonday.getUTCDate(),
    })}T00:00:00+05:30`),
  };
}

function formatUtcForMysql(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function csvCell(value: string | number | null): string {
  let text = value == null ? "" : String(value);
  if (/^[\t\r\n ]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(rows: SignupRow[], cityName: string): string {
  const lines = [
    ["Full Name", "Email", "Mobile Number", "City"].map(csvCell).join(","),
    ...rows.map((row) =>
      [row.fullName, row.email, row.mobileNumber, cityName].map(csvCell).join(","),
    ),
  ];
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

function getValidRecipients(emails: Array<string | null>): string[] {
  const recipients = [...new Set(emails.map((email) => email?.trim()).filter((email): email is string => !!email))];
  if (recipients.length === 0) throw new Error("No city email addresses are configured");

  const invalid = recipients.find((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  if (invalid) throw new Error("A city email address is invalid");
  return recipients;
}

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 1000);
}

function parseDateArgument(value: string, name: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${name} must be a valid date in YYYY-MM-DD format`);
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${name} must be a valid date in YYYY-MM-DD format`);
  }
  return value;
}

function getReportingPeriod(args: string[]): ReportingPeriod {
  if (args.length === 0) return getPreviousWeek(new Date());
  if (args.length !== 2) {
    throw new Error("Provide both --start=YYYY-MM-DD and --end=YYYY-MM-DD, or neither.");
  }

  const values = new Map<string, string>();
  for (const arg of args) {
    const match = /^--(start|end)=(.+)$/.exec(arg);
    if (!match || values.has(match[1])) {
      throw new Error("Expected exactly one --start=YYYY-MM-DD and one --end=YYYY-MM-DD argument.");
    }
    values.set(match[1], match[2]);
  }
  if (!values.has("start") || !values.has("end")) {
    throw new Error("Provide both --start=YYYY-MM-DD and --end=YYYY-MM-DD, or neither.");
  }

  const startValue = values.get("start");
  const endValue = values.get("end");
  if (!startValue || !endValue) {
    throw new Error("Provide both --start=YYYY-MM-DD and --end=YYYY-MM-DD, or neither.");
  }
  const start = parseDateArgument(startValue, "--start");
  const end = parseDateArgument(endValue, "--end");
  if (start > end) throw new Error("--start must be on or before --end.");

  const dayAfterEnd = new Date(`${end}T00:00:00Z`);
  dayAfterEnd.setUTCDate(dayAfterEnd.getUTCDate() + 1);
  const exclusiveEnd = formatDate({
    year: dayAfterEnd.getUTCFullYear(),
    month: dayAfterEnd.getUTCMonth() + 1,
    day: dayAfterEnd.getUTCDate(),
  });
  return {
    start,
    end,
    startUtc: new Date(`${start}T00:00:00+05:30`),
    endUtc: new Date(`${exclusiveEnd}T00:00:00+05:30`),
  };
}

async function getCitiesWithSignups(startUtc: string, endUtc: string): Promise<City[]> {
  return db.transaction(async (trx) => {
    await trx.raw("SET time_zone = '+00:00'");
    return trx("signups")
      .join("cities", "signups.cityId", "cities.id")
      .where("signups.createdAt", ">=", startUtc)
      .where("signups.createdAt", "<", endUtc)
      .distinct(
        "cities.id as cityId",
        "cities.cityName as cityName",
        "cities.cityEmail as cityEmail",
      )
      .orderBy("cities.cityName", "asc") as Promise<City[]>;
  });
}

async function getCitySignups(cityId: number, startUtc: string, endUtc: string): Promise<SignupRow[]> {
  return db.transaction(async (trx) => {
    await trx.raw("SET time_zone = '+00:00'");
    return trx("signups")
      .where("cityId", cityId)
      .where("createdAt", ">=", startUtc)
      .where("createdAt", "<", endUtc)
      .select("fullName", "email", "mobileNumber")
      .orderBy("id", "asc") as Promise<SignupRow[]>;
  });
}

async function beginDelivery(cityId: number, period: ReportingPeriod): Promise<Delivery | null> {
  const existing = (await db("signup_report_deliveries")
    .where({ cityId, periodStart: period.start, periodEnd: period.end })
    .first()) as
    | Delivery
    | undefined;
  if (existing?.status === "sent") return null;

  if (existing) {
    await db("signup_report_deliveries")
      .where({ id: existing.id })
      .update({
        status: "pending",
        attempts: existing.attempts + 1,
        signupCount: null,
        lastError: null,
        updatedAt: db.fn.now(),
      });
    return {
      ...existing,
      status: "pending",
      attempts: existing.attempts + 1,
      signupCount: null,
    };
  }

  const [id] = await db("signup_report_deliveries").insert({
    cityId,
    periodStart: period.start,
    periodEnd: period.end,
    status: "pending",
    attempts: 1,
    signupCount: null,
  });
  return { id: Number(id), status: "pending", attempts: 1, signupCount: null };
}

async function processCity(city: City, period: ReportingPeriod): Promise<boolean> {
  const delivery = await beginDelivery(city.cityId, period);
  if (!delivery) {
    console.info(`Skipped ${city.cityName}: report for ${period.start} to ${period.end} was already sent.`);
    return true;
  }

  try {
    const signups = await getCitySignups(
      city.cityId,
      formatUtcForMysql(period.startUtc),
      formatUtcForMysql(period.endUtc),
    );
    await db("signup_report_deliveries")
      .where({ id: delivery.id })
      .update({ signupCount: signups.length, updatedAt: db.fn.now() });

    if (signups.length === 0) throw new Error("No signups found in the reporting period");
    const recipients = getValidRecipients([city.cityEmail]);
    const csv = buildCsv(signups, city.cityName);
    const filename = `signups-${period.start}-to-${period.end}.csv`;
    const message = [
      `Attached is the signup report for ${city.cityName}.`,
      `Reporting period: ${period.start} to ${period.end} (Asia/Kolkata).`,
      `Total signups: ${signups.length}.`,
    ].join("\n");
    const rawEmailBytes = Buffer.byteLength(csv, "utf8") * 4 / 3 + Buffer.byteLength(message, "utf8") * 4 / 3;
    if (rawEmailBytes > MAX_RAW_EMAIL_BYTES) {
      throw new Error("CSV attachment exceeds the safe email size limit");
    }

    await sendCsvEmail({
      to: recipients,
      subject: `Signup report - ${city.cityName} - ${period.start} to ${period.end}`,
      text: message,
      filename,
      csv,
    });

    await db("signup_report_deliveries")
      .where({ id: delivery.id })
      .update({ status: "sent", sentAt: db.fn.now(), lastError: null, updatedAt: db.fn.now() });
    console.info(`Sent ${city.cityName}: ${signups.length} signups for ${period.start} to ${period.end}.`);
    return true;
  } catch (error) {
    const reason = errorMessage(error);
    await db("signup_report_deliveries")
      .where({ id: delivery.id })
      .update({ status: "failed", lastError: reason, updatedAt: db.fn.now() });
    console.error(`Failed ${city.cityName} report for ${period.start} to ${period.end}: ${reason}`);
    return false;
  }
}

async function main(): Promise<void> {
  const period = getReportingPeriod(process.argv.slice(2));
  const cities = await getCitiesWithSignups(
    formatUtcForMysql(period.startUtc),
    formatUtcForMysql(period.endUtc),
  );
  console.info(`Processing signup reports for ${period.start} to ${period.end} (Asia/Kolkata).`);

  let failed = false;
  for (const city of cities) {
    if (!(await processCity(city, period))) failed = true;
  }
  if (failed) throw new Error("One or more city signup reports failed; rerun the job to retry failed cities.");
  console.info(`Finished processing ${cities.length} city report(s).`);
}

main()
  .catch((error: unknown) => {
    console.error("Signup report job failed:", errorMessage(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.destroy();
  });
