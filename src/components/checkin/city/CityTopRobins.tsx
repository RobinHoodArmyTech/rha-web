"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, X, Crown, Users, Activity } from "lucide-react";
import type { CityTopRobin } from "@/core/services/backend/checkin/cityCheckinService";
import { ROBIN_BADGE_CONFIG, RobinBadgeMark } from "@/components/checkin/robinBadges";
import RobinAvatar from "./RobinAvatar";
import { cn } from "@/lib/utils";

interface CityTopRobinsProps {
  cityName: string;
  citySlug: string;
  windowDays: number;
  total: number;
  robins: CityTopRobin[];
}

const nf = new Intl.NumberFormat("en-IN");

// Medal treatment for the top three.
const MEDALS: Record<number, { ring: string; disc: string; accent: string }> = {
  1: { ring: "ring-amber-400/70 shadow-amber-500/20", disc: "from-amber-400 to-yellow-500", accent: "text-amber-500 dark:text-amber-400" },
  2: { ring: "ring-slate-300/70 shadow-slate-400/20", disc: "from-slate-300 to-slate-400", accent: "text-slate-500 dark:text-slate-300" },
  3: { ring: "ring-orange-400/60 shadow-orange-500/20", disc: "from-orange-400 to-amber-600", accent: "text-orange-500 dark:text-orange-400" },
};

function splitTwo<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

export default function CityTopRobins({
  cityName,
  citySlug,
  windowDays,
  total,
  robins,
}: CityTopRobinsProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(
    () => (q ? robins.filter((r) => r.name.toLowerCase().includes(q)) : null),
    [q, robins],
  );

  const totalDrives = useMemo(() => robins.reduce((s, r) => s + r.drives, 0), [robins]);

  const podium = robins.slice(0, 3);
  const [restLeft, restRight] = splitTwo(robins.slice(3));
  const [resLeft, resRight] = splitTwo(results ?? []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060f09]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-green-900/30 bg-white dark:bg-[#0a1a0f]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_120%_at_80%_-10%,rgba(34,197,94,0.10),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 lg:pt-28">
          <Link
            href={`/sites/checkin/${citySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#16a34a] transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: title + search (search sits where the summary stats used to be) */}
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-2">
                {cityName} · Leaderboard
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-none">
                Top Active Robins
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Our top {nf.format(total)} Robins with the highest number of drives checked-in over the
                last {windowDays} days.
              </p>

              {/* Search */}
              <div className="mt-6 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Robins by name…"
                    aria-label="Search Robins by name"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0f2818] border border-gray-200 dark:border-green-900/40 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/30 transition-colors"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {results && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {results.length} {results.length === 1 ? "Robin" : "Robins"} matching “{query.trim()}”
                  </p>
                )}
              </div>
            </div>

            {/* Right: glossy stats card */}
            <div className="w-full lg:w-auto shrink-0">
              <GlossyStats total={total} totalDrives={totalDrives} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {results ? (
          /* Search results — flat two-column list (keeps true ranks) */
          results.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
              <RankedColumn rows={resLeft} />
              <RankedColumn rows={resRight} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-green-900/40 py-16 text-center text-gray-500 dark:text-gray-400">
              No Robins match “{query.trim()}”.
            </div>
          )
        ) : (
          <>
            {/* Podium — top 3 */}
            {podium.length > 0 && (
              <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-center gap-5">
                {podium.map((r) => (
                  <PodiumCard key={r.id} robin={r} />
                ))}
              </div>
            )}

            {/* Ranked list — 4 onward, two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
              <RankedColumn rows={restLeft} />
              <RankedColumn rows={restRight} />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function GlossyStats({ total, totalDrives }: { total: number; totalDrives: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-green-800/40 bg-gradient-to-br from-white/90 to-white/40 dark:from-[#123420]/90 dark:to-[#0d2416]/60 backdrop-blur-md shadow-xl shadow-green-900/10">
      {/* Gloss sheen — a top highlight line, a soft top-left bloom, and a green corner glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/25 to-transparent" />
        <div className="absolute -top-10 left-6 h-24 w-32 rounded-full bg-white/50 dark:bg-white/5 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_130%_at_100%_0%,rgba(34,197,94,0.16),transparent)]" />
      </div>
      <div className="relative grid grid-cols-2 divide-x divide-gray-200/70 dark:divide-green-900/50">
        <GlossCell icon={Users} label="Robins ranked" value={nf.format(total)} />
        <GlossCell icon={Activity} label="Total drives" value={nf.format(totalDrives)} />
      </div>
    </div>
  );
}

function GlossCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="px-6 py-5 min-w-[8.5rem]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#4ade80]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{value}</div>
    </div>
  );
}

function PodiumCard({ robin }: { robin: CityTopRobin }) {
  const medal = MEDALS[robin.rank] ?? MEDALS[3];
  const badge = ROBIN_BADGE_CONFIG[robin.badge];
  const isFirst = robin.rank === 1;
  const avatarSize = isFirst ? 104 : 84;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: robin.rank * 0.06 }}
      className={cn(
        "relative flex-1 sm:max-w-[15rem] flex flex-col items-center text-center rounded-3xl border bg-white dark:bg-[#0f2818] px-6 pt-9 pb-7 shadow-lg ring-1",
        medal.ring,
        "border-gray-100 dark:border-green-900/30",
        // Podium stagger: #1 centered & raised, #2 left, #3 right (desktop only).
        isFirst ? "sm:order-2 sm:-translate-y-4" : robin.rank === 2 ? "sm:order-1" : "sm:order-3",
      )}
    >
      {/* Rank disc */}
      <div
        className={cn(
          "absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md bg-gradient-to-br",
          medal.disc,
        )}
      >
        {isFirst ? <Crown className="w-4 h-4" fill="currentColor" /> : robin.rank}
      </div>

      {/* Avatar + badge */}
      <div className="relative mb-4" style={{ width: avatarSize, height: avatarSize }}>
        <RobinAvatar name={robin.name} src={robin.imageUrl} size={avatarSize} className="ring-4 ring-white dark:ring-[#0f2818] shadow-md" />
        <div className="absolute -bottom-1 -right-1">
          <RobinBadgeMark badge={robin.badge} size="md" />
        </div>
      </div>

      <h3 className={cn("font-black text-gray-900 dark:text-white truncate max-w-full", isFirst ? "text-xl" : "text-lg")}>
        {robin.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{robin.cityName}</p>

      <div className={cn("mt-3 font-black tabular-nums", medal.accent, isFirst ? "text-4xl" : "text-3xl")}>
        {robin.drives}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">drives</p>

      <span className={cn("mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider", badge.accent)}>
        {badge.label}
      </span>
    </motion.div>
  );
}

function RankedColumn({ rows }: { rows: CityTopRobin[] }) {
  if (rows.length === 0) return <div className="hidden lg:block" />;
  return (
    <div>
      {/* Column header */}
      <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-200 dark:border-green-900/40">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">Robin</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16a34a]"># Drives</span>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-green-900/25">
        {rows.map((r) => (
          <RobinRow key={r.id} robin={r} />
        ))}
      </ul>
    </div>
  );
}

function RobinRow({ robin }: { robin: CityTopRobin }) {
  const badge = ROBIN_BADGE_CONFIG[robin.badge];
  return (
    <li className="group flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-white dark:hover:bg-[#0f2818] transition-colors">
      <span className="w-7 shrink-0 text-right text-sm font-bold text-gray-400 dark:text-gray-600 tabular-nums">
        {robin.rank}
      </span>
      <RobinAvatar name={robin.name} src={robin.imageUrl} size={40} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{robin.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          <span className={cn("font-semibold", badge.accent)}>{badge.label}</span>
        </p>
      </div>
      <span className="text-lg font-black text-gray-900 dark:text-white tabular-nums">
        {robin.drives}
      </span>
    </li>
  );
}
