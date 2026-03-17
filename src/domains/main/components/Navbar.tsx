"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Target,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onJoinUsClick: () => void;
}

const navItems = [
  { label: "Home", href: "/sites/main" },
  {
    label: "About Us",
    href: "/sites/main/about",
    dropdown: [
      { label: "FAQ's", href: "/sites/main/about#faqs" },
      { label: "Robin Speak", href: "/sites/main/about#robin-speak" },
    ],
  },
  { label: "Checkin", href: "/sites/checkin" },
  { label: "Academy", href: "/sites/main/academy" },
];

export default function Navbar({ onJoinUsClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-[#0a1a0f]/90 backdrop-blur-md shadow-lg border-b border-green-100 dark:border-green-900/30"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="/sites/main"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#1a6b3c] to-[#22c55e] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-green-400/30 transition-shadow">
              <Target className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-[#1a6b3c] dark:text-[#4ade80]">
                Robin Hood
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 -mt-0.5">
                ARMY
              </span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu.Root key={item.label}>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 outline-none">
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="z-[100] min-w-[160px] bg-white dark:bg-[#0f2818] border border-green-100 dark:border-green-800/40 rounded-xl shadow-xl p-1.5 mt-1"
                      sideOffset={5}
                    >
                      {item.dropdown.map((sub) => (
                        <DropdownMenu.Item key={sub.label} asChild>
                          <Link
                            href={sub.href}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg cursor-pointer outline-none transition-colors"
                          >
                            {sub.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-[18px] h-[18px]" />
                ) : (
                  <Moon className="w-[18px] h-[18px]" />
                )}
              </button>
            )}

            {/* Join Us button */}
            <motion.button
              onClick={onJoinUsClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:flex items-center px-5 py-2 bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-green-400/30 transition-all duration-300"
            >
              Join Us
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white dark:bg-[#0a1a0f] border-t border-green-100 dark:border-green-900/30 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onJoinUsClick();
                }}
                className="w-full mt-2 px-5 py-3 bg-gradient-to-r from-[#1a6b3c] to-[#166534] text-white text-sm font-semibold rounded-full transition-all"
              >
                Join Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
