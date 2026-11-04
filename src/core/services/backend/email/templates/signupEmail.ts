interface SignupEmailLinks {
  whatsappUrl?: string | null;
}

function safeLink(value?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  } catch {
    return null;
  }
}

export function signupEmail({ whatsappUrl }: SignupEmailLinks = {}) {
  const whatsappLink = safeLink(whatsappUrl);

  return {
    subject: "Welcome to the Robin Hood Army family!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <p><strong>Hey!</strong></p>

        <p><strong>Thanks for signing up :) A very warm welcome to the Robin Hood Army family. You can get started right away actually.</strong></p>

        <p>
          ${whatsappLink
            ? `<a href="${whatsappLink}">Click here</a> to join your city WhatsApp group (where all the coordination happens)`
            : "Your city WhatsApp group link is not available yet"}
        </p>

        <p>Oh and just before you do this, do take some time out to go through the following pillars of <strong>RHA</strong> :)</p>

        <ul>
          <li>We are a zero-funds organisation.</li>
          <li>We don't take money, we don't give money</li>
          <li>We are an apolitical organisation. We welcome all religions</li>
          <li>The WhatsApp group you'll be soon joining is a group used for coordinating drives. Please refrain from sending any unrelated forwarded messages on that group. Helps with efficiency and focus!</li>
        </ul>

        <p>Thanks for understanding.</p>

        <br/>

        <p>When you're on an <strong>RHA</strong> drive, don't forget to share it on <a href="https://checkin.robinhoodarmy.com">checkin.robinhoodarmy.com</a> - it takes just a few seconds! See your city and global rank and get a Robin Ninja/Gladiator/Centurion badge</p>

        <br/>

        <p>And that's all! Yup that's all. Looking forward to seeing you for the next drive.</p>
      </div>
    `,
  };
}
