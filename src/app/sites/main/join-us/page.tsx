import type { Metadata } from "next";
import JoinUsFlow from "@/components/main/join-us/JoinUsFlow";

export const metadata: Metadata = {
  title: "Join Us – Robin Hood Army",
  description: "Join the Robin Hood Army. Share your details and start volunteering.",
};

export default function JoinUsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#c8ebd6] via-[#e8f5ee] to-white pt-16 dark:from-[#0a1f12] dark:via-[#060f09] dark:to-[#060f09]">
      <JoinUsFlow />
    </main>
  );
}
