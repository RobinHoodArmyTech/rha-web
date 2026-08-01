"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { formatNumber } from "@/lib/format";

interface CityHeroProps {
  cityName: string;
  countryName: string;
  uniqueRobins: number;
  totalCheckins: number;
  windowDays: number;
}


export default function CityHero({
  cityName,
  countryName,
  uniqueRobins,
  totalCheckins,
  windowDays,
}: CityHeroProps) {
  return (
    <section className="border-b border-gray-100 dark:border-green-900/30 bg-white dark:bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 lg:pt-28 lg:pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/sites/checkin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#16a34a] transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All cities
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <span className="block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-2">
              {countryName ? `${countryName} · ` : ""}
              {cityName}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-none">
              {cityName}
            </h1>
          </motion.div>

          {/* Stat card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 rounded-2xl border border-gray-200 dark:border-green-900/40 bg-gray-50/60 dark:bg-[#0f2818] overflow-hidden shadow-sm"
          >
            <div className="px-6 py-5 border-r border-gray-200 dark:border-green-900/40">
              <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                {formatNumber(uniqueRobins)}{" "}
                <span className="text-base font-bold text-[#16a34a]">Robins</span>
              </div>
              <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Unique Robins in {windowDays} days
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                {formatNumber(totalCheckins)}
              </div>
              <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Total Check-Ins in {windowDays} days
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
