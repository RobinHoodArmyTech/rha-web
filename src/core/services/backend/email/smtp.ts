import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function getSMTPTransport(): Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const portValue = process.env.SMTP_PORT;
    const user = process.env.SMTP_USERNAME;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !portValue || !user || !pass) {
      throw new Error("SMTP_HOST, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD must be configured");
    }

    const port = Number(portValue);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("SMTP_PORT must be a valid port number");
    }

    const secure = port === 465 || port === 2465;
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass },
    });
  }
  return transporter;
}

export function getEmailFromAddress(): string {
  return process.env.SMTP_FROM_EMAIL ?? "info@robinhoodarmy.com";
}
