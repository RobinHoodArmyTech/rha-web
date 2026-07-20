"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, RotateCw } from "lucide-react";
import { api } from "@/lib/http";
import type { CityRecentCheckin, CityCheckinFeedPage } from "@/core/services/backend/checkin/cityCheckinService";
import CheckinPhotoGrid from "./CheckinPhotoGrid";

interface CityCheckinsFeedProps {
  cityName: string;
  citySlug: string;
  /** First page, rendered on the server for a fast first paint. */
  initialItems: CityRecentCheckin[];
  initialCursor: string | null;
  total: number;
}

type LoadState = "idle" | "loading" | "error";

const PAGE_SIZE = 24;

export default function CityCheckinsFeed({
  cityName,
  citySlug,
  initialItems,
  initialCursor,
  total,
}: CityCheckinsFeedProps) {
  const [items, setItems] = useState<CityRecentCheckin[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [state, setState] = useState<LoadState>("idle");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Guards against overlapping fetches (observer can fire repeatedly).
  const loadingRef = useRef(false);
  const hasMore = cursor !== null;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || cursor === null) return;
    loadingRef.current = true;
    setState("loading");
    try {
      const res = await api.get<{ data: CityCheckinFeedPage }>(
        `/checkin/city/${encodeURIComponent(citySlug)}/checkins?cursor=${encodeURIComponent(cursor)}&limit=${PAGE_SIZE}`,
      );
      // De-dupe defensively in case a page overlaps (ids are unique per check-in).
      setItems((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...res.data.items.filter((c) => !seen.has(c.id))];
      });
      setCursor(res.data.nextCursor);
      setState("idle");
    } catch (err) {
      console.error(err);
      setState("error");
    } finally {
      loadingRef.current = false;
    }
  }, [cursor, citySlug]);

  // Latest loadMore, so the observer stays stable across renders.
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // Auto-load the next page shortly before the sentinel scrolls into view.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreRef.current();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060f09]">
      {/* Header */}
      <section className="border-b border-gray-100 dark:border-green-900/30 bg-white dark:bg-[#0a1a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 lg:pt-28">
          <Link
            href={`/sites/checkin/${citySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#16a34a] transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <span className="block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-2">
            Recent Check-Ins
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Robins are Checking-In across{" "}
            <span className="text-[#1a6b3c] dark:text-[#4ade80]">{cityName}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Showing {items.length} of {total.toLocaleString("en-IN")} check-ins
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length > 0 ? (
          <CheckinPhotoGrid checkins={items} cityName={cityName} />
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-green-900/40 py-16 text-center text-gray-500 dark:text-gray-400">
            No check-ins in {cityName} yet.
          </div>
        )}

        {/* Loader / sentinel / end / error */}
        <div className="mt-12 flex flex-col items-center justify-center min-h-[3rem]">
          {state === "loading" && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin text-[#16a34a]" />
              <span className="text-sm font-medium">Loading more check-ins…</span>
            </div>
          )}

          {state === "error" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Couldn&apos;t load more check-ins.
              </p>
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a6b3c] hover:bg-[#155e3a] text-white text-sm font-semibold transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          )}

          {!hasMore && items.length > 0 && state === "idle" && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              You&apos;ve reached the end · {items.length} check-ins
            </p>
          )}

          {/* Invisible target that triggers the next fetch as it nears the viewport. */}
          {hasMore && <div ref={sentinelRef} aria-hidden className="h-px w-full" />}
        </div>
      </section>

      {/* Subtle brand accent so the empty tail never feels abrupt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-1 bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent"
      />
    </main>
  );
}
