"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Maximize2 } from "lucide-react";
import type { CityRecentCheckin } from "@/core/services/backend/checkin/cityCheckinService";
import { relativeTimeAgo } from "@/lib/relativeTime";
import CheckinLightbox from "./CheckinLightbox";

interface CheckinPhotoGridProps {
  checkins: CityRecentCheckin[];
  cityName: string;
}

/**
 * Responsive grid of clickable check-in photos with a shared full-screen
 * lightbox. Works for a fixed list (landing section) or a growing one
 * (infinite-scroll feed) — the lightbox always navigates the current list.
 */
export default function CheckinPhotoGrid({ checkins, cityName }: CheckinPhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
        {checkins.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View check-in by ${c.robinName}`}
              className="group relative block w-full aspect-square rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
            >
              <Image
                src={c.photoUrl}
                alt={`Check-in by ${c.robinName} in ${cityName}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="w-4 h-4 text-white" />
                </span>
              </div>
            </button>
            <div className="mt-2.5 px-0.5">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {c.robinName}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 shrink-0" />
                {/* Relative to now, so the server/client value can differ by a tick. */}
                <span suppressHydrationWarning>{relativeTimeAgo(c.createdAt)}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <CheckinLightbox
        checkins={checkins}
        cityName={cityName}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
