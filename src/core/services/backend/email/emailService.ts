import { SendEmailCommand } from "@aws-sdk/client-ses";
import { getSESClient } from "./ses";
import { signupEmail } from "./templates/signupEmail";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const FROM_EMAIL = process.env.SES_FROM_EMAIL ?? "info@robinhoodarmy.com";

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const client = getSESClient();

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
      },
    },
  });

  return client.send(command);
}

export async function sendSignupEmail(email: string) {
  const { subject, html } = signupEmail();
  return sendEmail({ to: email, subject, html });
}
