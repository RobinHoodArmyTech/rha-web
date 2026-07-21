"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RobinJwtPayload } from "@/lib/robinAuth";

/**
 * Avatar button + dropdown for a signed-in Robin on the check-in site. Shows the
 * Google profile picture (falling back to an initial), with the name/email and a
 * Logout action. Mirrors the admin UserMenu pattern.
 */
export default function RobinUserMenu({ robin }: { robin: RobinJwtPayload }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = (robin.fullName || robin.email).charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/v1/auth/robin/logout", { method: "POST" });
    } catch {
      // ignore — cookie is cleared server-side either way
    }
    router.refresh();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 text-white transition-all hover:bg-white/15"
      >
        <Avatar avatarUrl={robin.avatarUrl} initial={initial} />
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 dark:border-green-800/30 dark:bg-[#0f2818] dark:shadow-black/40"
          >
            {/* Identity header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-green-800/30">
              <Avatar avatarUrl={robin.avatarUrl} initial={initial} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {robin.fullName}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {robin.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-1">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Avatar({ avatarUrl, initial }: { avatarUrl: string | null; initial: string }) {
  if (avatarUrl) {
    return (
      // Plain img (not next/image) to avoid configuring Google's avatar host.
      // referrerPolicy no-referrer — Google blocks avatar requests that send one.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a6b3c] text-sm font-semibold text-white">
      {initial}
    </span>
  );
}
