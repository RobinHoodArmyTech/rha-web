"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onNext: () => void;
}

const STATS = [
  { value: "18.3 Cr+", label: "Meals Served" },
  { value: "406", label: "Cities" },
  { value: "2,90,000+", label: "Robins Enlisted" },
];

export default function Step1Intro({ onNext }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
      <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left: Hero */}
        <div>
          <span className="mb-5 inline-block rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1a6b3c] dark:border-green-800/60 dark:bg-green-950/50 dark:text-[#4ade80]">
            Volunteer-run since 2014
          </span>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl">
            Join the Robin Hood Army
          </h1>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            <p>
              We&apos;re a volunteer-run, zero-funds organization. We take surplus food from
              restaurants, weddings, and events, and get it to those who need it most. We also
              teach underprivileged kids on weekends.
            </p>
            <p>
              Our chapters are run by people like you and anyone who wants to make a difference
              in their own backyard, in their free time.
            </p>
            <p className="font-bold text-slate-900 dark:text-white">
              No money involved. Just people helping people.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[#1a6b3c] dark:text-[#4ade80]">{stat.value}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-green-900/30 dark:bg-[#0f2818] dark:shadow-[0_18px_70px_rgba(0,0,0,0.4)]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Become a Robin</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              It takes 30 seconds. Seriously.
            </p>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a6b3c] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1a6b3c]/25 transition-colors hover:bg-[#1f7a45]"
            >
              Let&apos;s Go
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}
