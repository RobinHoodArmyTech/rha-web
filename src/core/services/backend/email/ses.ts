import { SESClient } from "@aws-sdk/client-ses";

let client: SESClient | null = null;

export function getSESClient(): SESClient {
  if (!client) {
    client = new SESClient({
      region: process.env.AWS_SES_REGION ?? "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}
