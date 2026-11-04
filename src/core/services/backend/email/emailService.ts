import { getEmailFromAddress, getSMTPTransport } from "./smtp";
import { signupEmail } from "./templates/signupEmail";
import { getCityById } from "@/core/services/backend/city/cityService";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  return getSMTPTransport().sendMail({
    from: getEmailFromAddress(),
    to,
    subject,
    html,
  });
}

export async function sendSignupEmail(email: string, cityId: number) {
  const city = await getCityById(cityId);
  const { subject, html } = signupEmail({
    whatsappUrl: city?.foodCadetsLink,
  });
  return sendEmail({ to: email, subject, html });
}

interface SendCsvEmailOptions {
  to: string[];
  subject: string;
  text: string;
  filename: string;
  csv: string;
}

export async function sendCsvEmail({ to, subject, text, filename, csv }: SendCsvEmailOptions) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return getSMTPTransport().sendMail({
    from: getEmailFromAddress(),
    to: "undisclosed-recipients:;",
    bcc: to,
    subject,
    text,
    attachments: [{ filename: safeFilename, content: csv, contentType: "text/csv; charset=utf-8" }],
  });
}
