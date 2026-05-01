import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Tell us your name & city", subtitle: "So we can connect you locally" },
  { title: "Agree to our values", subtitle: "Four simple principles" },
  { title: "Join your city's WhatsApp group", subtitle: "Find your first drive" },
];

interface Props {
  /** Which of the 3 progress steps is currently active (1-indexed) */
  currentStep: 1 | 2 | 3;
}

export default function ProgressSteps({ currentStep }: Props) {
  return (
    <div>
      <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        What happens next
      </p>
      <ol className="space-y-0">
        {STEPS.map((s, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isPending = stepNum > currentStep;

          return (
            <li key={s.title} className="flex items-start gap-4">
              {/* Indicator column */}
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isCompleted && "bg-[#1a6b3c] text-white dark:bg-[#22c55e] dark:text-[#052e16]",
                    isCurrent && "bg-[#1a6b3c] text-white dark:bg-[#1a6b3c] dark:text-white",
                    isPending && "border-2 border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "my-1 w-0.5 flex-1",
                      isCompleted
                        ? "h-10 bg-[#1a6b3c] dark:bg-[#22c55e]"
                        : "h-10 bg-slate-200 dark:bg-slate-700",
                    )}
                  />
                )}
              </div>

              {/* Text column */}
              <div className={cn("pb-8", i === STEPS.length - 1 && "pb-0")}>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isCompleted || isCurrent
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 dark:text-slate-500",
                  )}
                >
                  {s.title}
                  {isCompleted && (
                    <span className="ml-2 text-xs font-normal text-[#1a6b3c] dark:text-[#4ade80]">
                      Done!
                    </span>
                  )}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    isCompleted || isCurrent
                      ? "text-slate-500 dark:text-slate-400"
                      : "text-slate-300 dark:text-slate-600",
                  )}
                >
                  {s.subtitle}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
