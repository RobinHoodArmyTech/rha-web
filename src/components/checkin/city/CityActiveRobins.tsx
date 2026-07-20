"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CityActiveRobin } from "@/core/services/backend/checkin/cityCheckinService";
import { RobinBadgeMark } from "@/components/checkin/robinBadges";

interface CityActiveRobinsProps {
  robins: CityActiveRobin[];
  /** Slug used to link to the full leaderboard. */
  citySlug: string;
}

export default function CityActiveRobins({ robins, citySlug }: CityActiveRobinsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (robins.length === 0) return null;

  return (
    <section ref={ref} className="py-16 bg-white dark:bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-10"
        >
          Some <span className="text-[#1a6b3c] dark:text-[#4ade80]">Active Robins</span> on the field
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {robins.map((robin, i) => (
            <motion.div
              key={robin.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-gray-100 dark:border-green-900/30 bg-white dark:bg-[#0f2818] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-500/10 hover:border-[#22c55e]/40 transition-all duration-300"
            >
              {/* Photo with badge mark */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={robin.imageUrl}
                  alt={robin.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute -bottom-5 right-5 z-10">
                  <RobinBadgeMark badge={robin.badge} size="md" />
                </div>
              </div>

              {/* Details */}
              <div className="px-5 pt-6 pb-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {robin.name}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-[#16a34a] dark:text-[#4ade80]">
                  {robin.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <Link
            href={`/sites/checkin/${citySlug}/top-robins`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1a6b3c]/40 dark:border-[#4ade80]/40 text-sm font-semibold text-[#1a6b3c] dark:text-[#4ade80] hover:bg-[#1a6b3c] hover:text-white dark:hover:bg-[#4ade80] dark:hover:text-[#0a1a0f] transition-all duration-200"
          >
            View All Top Active Robins
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
