"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Target, LogIn, User, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckinNavbarProps {
  onLoginClick: () => void;
}

const navLinks = [
  { label: "Home", href: "/sites/checkin" },
  { label: "CheckIn Now!", href: "/sites/checkin/submit", highlight: true },
  { label: "Contact Us", href: "/sites/checkin/contact" },
  { label: "Privacy Policy", href: "/sites/checkin/privacy" },
  { label: "My Profile", href: "/sites/checkin/profile" },
];

export default function CheckinNavbar({ onLoginClick }: CheckinNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#155e3a] border-b border-green-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/sites/checkin" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg flex items-center justify-center transition-colors">
              <Target className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">RHA Check-In</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                /* CTA pill — visually distinct from active tabs */
                <Link
                  key={link.label}
                  href={link.href}
                  className="ml-2 flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#4ade80] hover:bg-[#22c55e] text-[#0a1a0f] text-sm font-bold shadow-md transition-all duration-200"
                >
                  {link.label}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-white/20 text-white font-semibold"
                      : "text-green-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right — Theme toggle + Login + mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>
            )}

            <motion.button
              onClick={onLoginClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              Login
            </motion.button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0f3d22] border-t border-green-800/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.highlight ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-full bg-[#4ade80] text-[#0a1a0f] text-sm font-bold transition-all"
                  >
                    {link.label}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      pathname === link.href
                        ? "bg-white/20 text-white font-semibold"
                        : "text-green-100 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => { setMobileOpen(false); onLoginClick(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-lg transition-all"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-12 flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-lg transition-all"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
