"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";
import UserMenu from "./UserMenu";

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Defer to avoid a hydration mismatch on the theme icon (and the setState-in-effect lint rule).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-green-800/30 dark:bg-[#0f2818]">
      {/* Hamburger — opens the sidebar drawer on mobile */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden dark:text-slate-300 dark:hover:bg-green-900/30"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-2">
        {mounted && (
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-green-900/30"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        )}
        <UserMenu />
      </div>
    </header>
  );
}
