import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import SignupForm from "@/domains/main/components/signup/SignupForm";

export const metadata: Metadata = {
  title: "Join the Robin Hood Army",
  description:
    "Signup page for Robin Hood Army volunteers. Share your details and join the army.",
};

const principles = [
  {
    title: "The RHA is a zero funds organization",
    body: "I shall never collect or solicit funds in the name of the Robin Hood Army.",
  },
  {
    title: "The RHA is apolitical",
    body: "I shall never use the Robin Hood Army for political purposes.",
  },
  {
    title: "The RHA includes all religions",
    body: "I shall always respect all religions in my work with the Robin Hood Army.",
  },
];

export default function SignupPage() {
  return (
    <main className="fixed inset-0 top-16 bg-[#f4f8f2] dark:bg-[#060f09] lg:top-20">
      <div className="grid h-full lg:grid-cols-[0.95fr_1.05fr]">
        {/* ── Left panel — fixed, never scrolls ── */}
        <section className="relative hidden overflow-hidden bg-[#0d3d27] dark:bg-[#071a0e] lg:flex lg:flex-col">
          <Image
            src="https://picsum.photos/seed/rha-signup/1600/2200"
            alt="Robin Hood Army volunteers"
            fill
            priority
            sizes="48vw"
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(13,61,39,0.50)_0%,rgba(13,61,39,0.80)_50%,rgba(13,61,39,0.97)_100%)]" />

          {/* Content — flush to top with pt, spaced with gap */}
          <div className="relative flex h-full flex-col justify-center gap-0 px-10 py-10">
            {/* Badge */}
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d7f5de] backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Join the family
            </div>

            {/* Heading */}
            <h2 className="text-[2.1rem] font-light leading-[1.2] tracking-tight text-white">
              Help the Robin Hood Army{" "}
              <span className="font-normal text-[#8ee3ad]">
                in a way that fits you.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              Fill in the details to get your volunteering journey with us,
              started!
            </p>

            {/* Divider */}
            <div className="my-6 h-px w-full bg-white/12" />

            {/* Core Principles label */}
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8ee3ad]">
              Our Core Principles
            </p>

            {/* Principle cards */}
            <div className="grid gap-2.5">
              {principles.map(({ title, body }) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur"
                >
                  <p className="text-[0.8125rem] font-semibold text-white">
                    {title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/60">{body}</p>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <p className="mt-5 text-[11px] leading-5 text-white/40">
              A decentralised, zero-funds platform — no employees, no office
              space.
            </p>
          </div>
        </section>

        {/* ── Right panel — only this scrolls ── */}
        <section className="h-full overflow-y-auto bg-[#f7f7f2] dark:bg-[#0a1a0f] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <div className="mx-auto flex max-w-4xl flex-col">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#d9e3db] dark:bg-green-900/30" />
              <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[#2f6b48] dark:text-[#4ade80]">
                Volunteer signup
              </p>
              <div className="h-px flex-1 bg-[#d9e3db] dark:bg-green-900/30" />
            </div>

            <div className="rounded-[2rem] border border-[#dbe5dd] dark:border-green-900/30 bg-white dark:bg-[#0f2818] px-4 py-6 shadow-[0_18px_70px_rgba(13,61,39,0.08)] dark:shadow-[0_18px_70px_rgba(0,0,0,0.4)] sm:px-6 sm:py-8 lg:px-8">
              <SignupForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
