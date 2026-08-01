"use client";

import { useRef, useEffect, useState, type ElementType } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Utensils, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CheckinWithCity, CheckinTotals } from "@/core/services/backend/checkin/checkinService";
import { api } from "@/lib/http";
import { citySlug } from "@/lib/citySlug";
import { formatNumber } from "@/lib/format";

// At most 12 — fills exactly 2 rows on desktop (lg:grid-cols-6).
const MAX_RECENT = 12;

/** Compact relative time, e.g. "just now", "3h ago", "2d ago". */
function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// Card presentation; `value` derives the display string from the stats.
type StatCard = {
  icon: ElementType;
  label: string;
  sub: string;
  color: string;
  bg: string;
  value: (s: CheckinTotals | null) => string;
};

const STAT_META: StatCard[] = [
  {
    icon: Users,
    label: "Robins",
    sub: "Checked-In last week",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    value: (s) => (s ? formatNumber(s.robins) : "—"),
  },
  {
    icon: Utensils,
    label: "Meals",
    sub: "Served last week",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    // TODO: source from the upcoming food tracking module — not derived from check-ins.
    value: () => "—",
  },
];

export default function RecentCheckIns() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [checkins, setCheckins] = useState<CheckinWithCity[]>([]);
  const [stats, setStats] = useState<CheckinTotals | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Read the latest check-ins + aggregate counters from the DB (public).
  useEffect(() => {
    api
      .get<{ data: CheckinWithCity[] }>("/checkin")
      .then((res) => setCheckins(res.data ?? []))
      .catch((err) => console.error(err))
      .finally(() => setLoaded(true));
    api
      .get<{ data: CheckinTotals }>("/checkin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-12">
          <div>
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
              Your fellow Robins are{" "}
              <span className="text-[#1a6b3c] dark:text-[#4ade80]">
                Checking-In
              </span>{" "}
              across the world
            </motion.h2>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-4">
            {STAT_META.map(({ icon: Icon, label, sub, color, bg, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className={`flex-1 ${bg} rounded-2xl p-5 border border-gray-100 dark:border-green-900/30`}
              >
                <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-3xl font-black ${color} mb-0.5`}>{value(stats)}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        {checkins.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          >
            {checkins.slice(0, MAX_RECENT).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={c.photoUrl}
                    alt={`Check-in from ${c.cityName}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                {/* Caption — city + friendly time, always visible below the photo */}
                <div className="mt-2 px-0.5">
                  <Link
                    href={`/sites/checkin/${citySlug(c.cityName)}`}
                    aria-label={`View check-ins in ${c.cityName}`}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-900 dark:text-white hover:text-[#16a34a] dark:hover:text-[#4ade80] transition-colors"
                  >
                    <MapPin className="w-3 h-3 shrink-0 text-[#16a34a]" />
                    <span className="truncate">{c.cityName}</span>
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    {timeAgo(c.createdAt)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : loaded ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-green-900/40 py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No check-ins yet —{" "}
              <a href="/sites/checkin/submit" className="font-semibold text-[#1a6b3c] dark:text-[#4ade80] hover:underline">
                be the first to check in
              </a>
              !
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
