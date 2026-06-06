import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  cityName?: string;
  cityCadetLink?: string;
}

export default function Step4Welcome({ name, cityName, cityCadetLink }: Props) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 pb-16 pt-8 sm:px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-5xl">🎉</div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome to the family, {firstName}!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          You&apos;re officially a Robin. Join your city&apos;s WhatsApp group — that&apos;s where drives are coordinated, and you&apos;ll find your first one.
        </p>
        <motion.button 
          onClick={() => window.location.href = cityCadetLink ?? "https://api.whatsapp.com/send/?phone=918069251697&lang=en&text=Hi"}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
            "bg-[#1a6b3c] text-white shadow-lg shadow-[#1a6b3c]/25 hover:bg-[#1f7a45]"
          )}
        >
          Join {cityName ?? ""} WhatsApp Group
        </motion.button>
        <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
          Your local Robins will welcome you. Drives usually happen on weekends — jump into your first one!
        </p>
      </div>
    </div>
  );
}
