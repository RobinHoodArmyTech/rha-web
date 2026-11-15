import { sendCsvEmail } from "@/core/services/backend/email/emailService";

const MAX_EMAIL_BYTES = 9 * 1024 * 1024;
const MAX_CSV_CHUNK_BYTES = 6 * 1024 * 1024;
export const MAX_SUMMARY_RECORDS_PER_EMAIL = 500;

export type CsvValue = string | number | null;

export function getSummaryRecipient(): string {
  const recipient = process.env.SUMMARY_EMAIL?.trim();
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error("SUMMARY_EMAIL must be configured with a valid email address");
  }
  return recipient;
}

export function csvCell(value: CsvValue): string {
  let text = value == null ? "" : String(value);
  if (/^[\t\r\n ]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function csvRow(values: CsvValue[]): string {
  return `${values.map(csvCell).join(",")}\r\n`;
}

export function buildCsv(headers: string[], rows: CsvValue[][]): string {
  return `\uFEFF${csvRow(headers)}${rows.map(csvRow).join("")}`;
}

export function buildCsvChunks(headers: string[], rows: CsvValue[][]): string[] {
  const header = `\uFEFF${csvRow(headers)}`;
  const headerBytes = Buffer.byteLength(header, "utf8");
  if (headerBytes > MAX_CSV_CHUNK_BYTES) {
    throw new Error("CSV headers exceed the safe email attachment size");
  }
  const chunks: string[] = [];
  let current = header;
  let currentBytes = headerBytes;
  let currentRowCount = 0;
  let totalRowCount = 0;

  for (const row of rows) {
    const line = csvRow(row);
    const lineBytes = Buffer.byteLength(line, "utf8");
    if (headerBytes + lineBytes > MAX_CSV_CHUNK_BYTES) {
      throw new Error("A signup record exceeds the safe email attachment size");
    }
    if (
      currentRowCount >= MAX_SUMMARY_RECORDS_PER_EMAIL ||
      currentBytes + lineBytes > MAX_CSV_CHUNK_BYTES
    ) {
      chunks.push(current);
      current = header;
      currentBytes = headerBytes;
      currentRowCount = 0;
    }
    current += line;
    currentBytes += lineBytes;
    currentRowCount += 1;
    totalRowCount += 1;
  }

  if (totalRowCount > 0 || chunks.length === 0) chunks.push(current);
  return chunks;
}

export function assertSummaryEmailSize(csv: string, text: string): void {
  const encodedBytes =
    (Buffer.byteLength(csv, "utf8") + Buffer.byteLength(text, "utf8")) * 4 / 3;
  if (encodedBytes > MAX_EMAIL_BYTES) {
    throw new Error("CSV attachment exceeds the safe email size limit");
  }
}

export async function sendSummaryCsvChunks(options: {
  recipient: string;
  subject: string;
  text: string;
  filename: string;
  headers: string[];
  rows: CsvValue[][];
}): Promise<void> {
  const chunks = buildCsvChunks(options.headers, options.rows);
  const fileExtension = /\.csv$/i.test(options.filename) ? ".csv" : "";
  const baseFilename = fileExtension
    ? options.filename.slice(0, -fileExtension.length)
    : options.filename;

  for (let index = 0; index < chunks.length; index += 1) {
    const part = index + 1;
    const isChunked = chunks.length > 1;
    const partLabel = `part ${part} of ${chunks.length}`;
    const text = isChunked ? `${options.text}\nAttachment ${partLabel}.` : options.text;
    const csv = chunks[index];
    assertSummaryEmailSize(csv, text);
    await sendCsvEmail({
      to: [options.recipient],
      subject: isChunked ? `${options.subject} (${partLabel})` : options.subject,
      text,
      filename: isChunked
        ? `${baseFilename}-part-${part}-of-${chunks.length}.csv`
        : options.filename,
      csv,
    });
  }
}

