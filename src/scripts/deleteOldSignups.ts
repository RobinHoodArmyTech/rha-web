import { db } from "@/core/db";
import {
  getSummaryRecipient,
  MAX_SUMMARY_RECORDS_PER_EMAIL,
  sendSummaryCsvChunks,
  type CsvValue,
} from "./signupJobSummary";

const RETENTION_DAYS = 90;
const BATCH_SIZE = MAX_SUMMARY_RECORDS_PER_EMAIL;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const CLEANUP_HEADERS = [
  "ID",
  "Full Name",
  "Email",
  "Mobile Number",
  "Age",
  "City ID",
  "City",
  "Created At",
  "Updated At",
];

interface CleanupSignup {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  age: number | null;
  cityId: number;
  cityName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatUtcForMysql(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function formatTimestamp(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

async function getOldSignups(cutoff: string): Promise<CleanupSignup[]> {
  const signups: CleanupSignup[] = [];
  let lastId = 0;

  while (true) {
    const batch = await db.transaction(async (trx) => {
      await trx.raw("SET time_zone = '+00:00'");
      return trx("signups")
        .join("cities", "signups.cityId", "cities.id")
        .where("signups.createdAt", "<", cutoff)
        .where("signups.id", ">", lastId)
        .select(
          "signups.id as id",
          "signups.fullName as fullName",
          "signups.email as email",
          "signups.mobileNumber as mobileNumber",
          "signups.age as age",
          "signups.cityId as cityId",
          "cities.cityName as cityName",
          "signups.createdAt as createdAt",
          "signups.updatedAt as updatedAt",
        )
        .orderBy("signups.id", "asc")
        .limit(BATCH_SIZE) as Promise<CleanupSignup[]>;
    });

    if (batch.length === 0) break;
    signups.push(...batch);
    lastId = batch[batch.length - 1].id;
  }

  return signups;
}

function getCsvRows(signups: CleanupSignup[]): CsvValue[][] {
  return signups.map((signup) => [
    signup.id,
    signup.fullName,
    signup.email,
    signup.mobileNumber,
    signup.age,
    signup.cityId,
    signup.cityName,
    formatTimestamp(signup.createdAt),
    formatTimestamp(signup.updatedAt),
  ]);
}

async function deleteOldSignups(): Promise<void> {
  const cutoff = formatUtcForMysql(new Date(Date.now() - RETENTION_DAYS * DAY_IN_MILLISECONDS));
  const recipient = getSummaryRecipient();
  const oldSignups = await getOldSignups(cutoff);
  if (oldSignups.length === 0) {
    console.info(`No signup records older than ${RETENTION_DAYS} days to clean up.`);
    return;
  }

  await sendSummaryCsvChunks({
    recipient,
    subject: "Signup cleanup summary",
    text: [
      `These records are older than ${RETENTION_DAYS} days and will be deleted after all summary emails are sent.`,
    ].join("\n"),
    filename: "signup-cleanup-summary.csv",
    headers: CLEANUP_HEADERS,
    rows: getCsvRows(oldSignups),
  });

  let totalDeleted = 0;

  for (let offset = 0; offset < oldSignups.length; offset += BATCH_SIZE) {
    const ids = oldSignups.slice(offset, offset + BATCH_SIZE).map(({ id }) => id);
    const deleted = await db.transaction(async (trx) => {
      return trx("signups").whereIn("id", ids).delete();
    });
    totalDeleted += Number(deleted);
  }

  if (totalDeleted !== oldSignups.length) {
    throw new Error(`Expected to delete ${oldSignups.length} signup record(s), but deleted ${totalDeleted}.`);
  }
  console.info(`Sent cleanup summary covering ${oldSignups.length} signup record(s).`);
  console.info(`Deleted ${totalDeleted} signup record(s) older than ${RETENTION_DAYS} days.`);
}

deleteOldSignups()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Signup cleanup job failed:", message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.destroy();
  });
