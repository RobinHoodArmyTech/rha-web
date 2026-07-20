"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CityRecentCheckin } from "@/core/services/backend/checkin/cityCheckinService";
import CheckinPhotoGrid from "./CheckinPhotoGrid";

interface CityRecentCheckInsProps {
  cityName: string;
  /** Slug used to link to the full feed page. */
  citySlug: string;
  checkins: CityRecentCheckin[];
}

export default function CityRecentCheckIns({ cityName, citySlug, checkins }: CityRecentCheckInsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 bg-gray-50 dark:bg-[#060f09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3"
          >
            Recent Check-Ins
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight"
          >
            Robins are Checking-In across{" "}
            <span className="text-[#1a6b3c] dark:text-[#4ade80]">{cityName}</span>
          </motion.h2>
        </div>

        {checkins.length > 0 ? (
          <CheckinPhotoGrid checkins={checkins} cityName={cityName} />
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-green-900/40 py-16 text-center text-gray-500 dark:text-gray-400">
            No check-ins in {cityName} yet.
          </div>
        )}

        {checkins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              href={`/sites/checkin/${citySlug}/checkins`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1a6b3c]/40 dark:border-[#4ade80]/40 text-sm font-semibold text-[#1a6b3c] dark:text-[#4ade80] hover:bg-[#1a6b3c] hover:text-white dark:hover:bg-[#4ade80] dark:hover:text-[#0a1a0f] transition-all duration-200"
            >
              View All Recent Check-Ins
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
