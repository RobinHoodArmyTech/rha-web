import { db } from "@/core/db";

const RETENTION_DAYS = 90;
const BATCH_SIZE = 500;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function formatUtcForMysql(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function deleteOldSignups(): Promise<void> {
  const cutoff = formatUtcForMysql(new Date(Date.now() - RETENTION_DAYS * DAY_IN_MILLISECONDS));
  let totalDeleted = 0;

  while (true) {
    const deleted = await db.transaction(async (trx) => {
      await trx.raw("SET time_zone = '+00:00'");
      const oldSignups = (await trx("signups")
        .select("id")
        .where("createdAt", "<", cutoff)
        .orderBy("createdAt", "asc")
        .limit(BATCH_SIZE)) as Array<{ id: number }>;

      if (oldSignups.length === 0) return 0;
      return trx("signups").whereIn("id", oldSignups.map(({ id }) => id)).delete();
    });

    totalDeleted += Number(deleted);
    if (Number(deleted) < BATCH_SIZE) break;
  }

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
