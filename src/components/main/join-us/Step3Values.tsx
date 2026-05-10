"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ProgressSteps from "./ProgressSteps";

const VALUES = [
  {
    icon: "💰",
    title: "Zero Funds",
    description: "We never collect or ask for money.",
  },
  {
    icon: "🗞️",
    title: "Apolitical",
    description: "RHA is never used for political purposes.",
  },
  {
    icon: "🙏",
    title: "All Faiths Welcome",
    description: "We respect all religions in our work.",
  },
  {
    icon: "⚡",
    title: "Personal Responsibility",
    description:
      "All Robins volunteer of their own accord and are responsible for their own safety. RHA is not liable.",
  },
];

interface Props {
  onBack: () => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  error: string;
}

export default function Step3Values({ onBack, onSubmit, submitting, error }: Props) {
  const [agreed, setAgreed] = useState(false);

  const canSubmit = agreed && !submitting;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
      <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left: Progress (desktop only) */}
        <div className="hidden lg:block">
          <ProgressSteps currentStep={2} />
        </div>

        {/* Right: Values card */}
        <div className="w-full lg:ml-auto lg:max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-green-900/30 dark:bg-[#0f2818] dark:shadow-[0_18px_70px_rgba(0,0,0,0.4)] sm:p-8">

            <button
              onClick={onBack}
              className="mb-5 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">One last thing</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Every Robin lives by a few simple values:
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-900/40">
              {VALUES.map((v) => (
                <div key={v.title} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-lg">{v.icon}</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">{v.title}</span>
                    {" — "}
                    {v.description}
                  </p>
                </div>
              ))}
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded accent-[#1a6b3c]"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                I&apos;m in — I agree to these principles
              </span>
            </label>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400">
                {error}
              </div>
            )}

            <motion.button
              onClick={canSubmit ? onSubmit : undefined}
              whileHover={{ scale: canSubmit ? 1.01 : 1 }}
              whileTap={{ scale: canSubmit ? 0.98 : 1 }}
              disabled={!canSubmit}
              className={cn(
                "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
                canSubmit
                  ? "bg-[#1a6b3c] text-white shadow-lg shadow-[#1a6b3c]/25 hover:bg-[#1f7a45]"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500",
              )}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Joining…
                </>
              ) : (
                <>
                  Join RHA
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>

          </div>
        </div>

      </div>
    </div>
  );
}
