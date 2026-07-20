"use client";

import { useCallback, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import type { CityRecentCheckin } from "@/core/services/backend/checkin/cityCheckinService";
import { relativeTimeAgo } from "@/lib/relativeTime";

interface CheckinLightboxProps {
  checkins: CityRecentCheckin[];
  cityName: string;
  /** Index of the open check-in, or `null` when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen viewer for a check-in photo. Photos arrive as (eventually S3) URLs
 * and are rendered unoptimized, so any external host works without extra config.
 * Supports prev/next (buttons + arrow keys) and closes on backdrop / Esc / X.
 */
export default function CheckinLightbox({
  checkins,
  cityName,
  index,
  onClose,
  onNavigate,
}: CheckinLightboxProps) {
  const open = index !== null;
  const count = checkins.length;

  const goPrev = useCallback(() => {
    if (index === null || count === 0) return;
    onNavigate((index - 1 + count) % count);
  }, [index, count, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null || count === 0) return;
    onNavigate((index + 1) % count);
  }, [index, count, onNavigate]);

  // Arrow-key navigation while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  const current = index !== null ? checkins[index] : null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && current && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content
              aria-describedby={undefined}
              onClick={onClose}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-8 focus:outline-none"
            >
              <Dialog.Title className="sr-only">
                Check-in by {current.robinName} in {cityName}
              </Dialog.Title>

              {/* Close */}
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>

              {/* Counter */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold">
                {index! + 1} / {count}
              </div>

              {/* Prev / Next */}
              {count > 1 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    aria-label="Next"
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image + caption — swaps per index */}
              <AnimatePresence mode="wait">
                <motion.figure
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", damping: 26, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative flex flex-col items-center gap-4 max-w-[95vw]"
                >
                  {/* Large "stage": the photo scales to fill the viewport at its own
                      aspect ratio (portrait fills the height, landscape the width). */}
                  <div className="relative w-[95vw] max-w-[1400px] h-[78vh] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={current.photoUrl}
                      alt={`Check-in by ${current.robinName} in ${cityName}`}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 1400px) 95vw, 1400px"
                    />
                  </div>

                  <figcaption className="flex flex-col items-center gap-1 text-center">
                    <span className="text-lg font-bold text-white">{current.robinName}</span>
                    <span className="flex items-center gap-3 text-sm text-white/70">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#4ade80]" />
                        {cityName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {relativeTimeAgo(current.createdAt)}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
