"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, KeyRound } from "lucide-react";
import { api } from "@/lib/http";
import { cn } from "@/lib/utils";
import { useAdminSession } from "./AdminSessionProvider";
import ChangePasswordModal from "./ChangePasswordModal";

export default function UserMenu() {
  const router = useRouter();
  const { email, cityName } = useAdminSession();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);
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

  const initial = email.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout", {});
    } catch {
      // ignore — cookie is cleared server-side either way
    }
    router.push("/sites/admin/login");
    router.refresh();
  };

  const handleChangePassword = () => {
    setOpen(false);
    setChangePwOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-lg p-1 pr-2 text-on-surface-variant transition-all hover:bg-surface-container"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary text-sm font-semibold">
          {initial}
        </span>
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
            <div className="border-b border-slate-100 px-4 py-3 dark:border-green-800/30">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{email}</p>
              {cityName && (
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{cityName}</p>
              )}
            </div>

            {/* Actions */}
            <div className="p-1">
              <button
                onClick={handleChangePassword}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-green-900/30"
              >
                <KeyRound className="h-4 w-4" />
                Change password
              </button>
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

      <ChangePasswordModal open={changePwOpen} onClose={() => setChangePwOpen(false)} />
    </div>
  );
}
