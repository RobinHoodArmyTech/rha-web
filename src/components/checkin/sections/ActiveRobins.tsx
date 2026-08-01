"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import type { TopActiveRobin } from "@/core/services/backend/checkin/checkinService";
import { api } from "@/lib/http";
import { badgeForDrives } from "@/lib/checkinBadges";
import { ROBIN_BADGE_CONFIG, RobinBadgeMark } from "@/components/checkin/robinBadges";
import RobinAvatar from "@/components/checkin/city/RobinAvatar";

export default function ActiveRobins() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [robins, setRobins] = useState<TopActiveRobin[]>([]);

  useEffect(() => {
    api
      .get<{ data: TopActiveRobin[] }>("/checkin/top-robins")
      .then((res) => setRobins(res.data ?? []))
      .catch((err) => console.error(err));
  }, []);

  if (robins.length === 0) return null;

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
            Community Heroes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Some{" "}
            <span className="text-[#1a6b3c] dark:text-[#4ade80]">Active Robins</span>{" "}
            on the field
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {robins.map((robin, i) => {
            const badge = badgeForDrives(robin.drives);
            const badgeCfg = ROBIN_BADGE_CONFIG[badge];
            return (
              <motion.div
                key={robin.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="xl:col-span-1 bg-gray-50 dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl p-5 text-center group hover:border-[#22c55e]/40 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
              >
                {/* Avatar + badge */}
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-gray-200 dark:ring-green-900/40 group-hover:ring-[#22c55e]/50 transition-all">
                    <RobinAvatar name={robin.name} src={robin.imageUrl} size={80} className="rounded-2xl" />
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <RobinBadgeMark badge={badge} size="sm" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 truncate">
                  {robin.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">
                  {robin.cityName}
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-green-900/30 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${badgeCfg.accent}`}>
                    {badgeCfg.label}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">
                  {robin.drives} drives completed
                </p>
              </motion.div>
            );
          })}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="xl:col-span-1 bg-gradient-to-br from-[#155e3a] to-[#0d3d27] rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-4 border border-green-700/30"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-[#4ade80]" fill="currentColor" />
            </div>
            <p className="text-white text-xs font-medium leading-relaxed">
              Check-in to your next drive! And you may see yourself featured here.
            </p>
            <motion.a
              href="/sites/checkin"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a1a0f] text-xs font-bold rounded-full transition-all"
            >
              Check-In Now
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
