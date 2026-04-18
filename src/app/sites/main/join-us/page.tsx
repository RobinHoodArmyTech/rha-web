import type { Metadata } from "next";
import JoinUsForm from "@/components/main/join-us/JoinUsForm";

export const metadata: Metadata = {
  title: "Join Us – Robin Hood Army",
  description: "Join the Robin Hood Army. Share your details and start volunteering.",
};

export default function JoinUsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#c8ebd6] via-[#e8f5ee] to-white dark:from-[#0a1f12] dark:via-[#060f09] dark:to-[#060f09] pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="rounded-[2rem] border border-[#dbe5dd] dark:border-green-900/30 bg-white dark:bg-[#0f2818] px-4 py-6 shadow-[0_18px_70px_rgba(13,61,39,0.08)] dark:shadow-[0_18px_70px_rgba(0,0,0,0.4)] sm:px-6 sm:py-8 lg:px-8">
          <JoinUsForm />
        </div>
      </div>
    </main>
  );
}
