"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const checkinHref = process.env.NODE_ENV === "production" 
  ? `https://${process.env.NEXT_PUBLIC_CHECKIN_DOMAIN ?? "checkin.robinhoodarmy.com"}` 
  : "/sites/checkin";

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
  { label: "Checkin", href: checkinHref },
  { label: "Academy", href: "/sites/main/academy" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setScrolled(window.scrollY > heroHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[1px] pointer-events-none z-40" id="navbar-trigger" />
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#006430]/95 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-[#006430]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - fixed width */}
            <div className="w-[180px] flex-shrink-0">
              <motion.a
                href="/sites/main"
                className="flex items-center gap-2 group w-fit"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-8 h-8 rounded-md overflow-hidden">
                  <Image
                    src="/main/images/icons/robin-hood-army-logo.png"
                    alt="Robin Hood Army"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-sm text-white group-hover:text-[#4ade80] transition-colors">
                    Robin Hood Army
                  </span>
                </div>
              </motion.a>
            </div>

            {/* Desktop Nav - Centered */}
            <div className="hidden lg:flex items-center justify-center gap-0.5">
              {navItems.map((item) =>
                item.dropdown ? (
                  <DropdownMenu.Root key={item.label}>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 outline-none">
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="z-[100] min-w-[160px] bg-[#006430] border border-white/20 rounded-xl shadow-xl p-1.5 mt-1"
                        sideOffset={5}
                      >
                        {item.dropdown.map((sub) => (
                          <DropdownMenu.Item key={sub.label} asChild>
                            <Link
                              href={sub.href}
                              className="flex items-center px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer outline-none transition-colors"
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
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Right side - fixed width to match logo side */}
            <div className="w-[180px] flex-shrink-0 flex justify-end">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden lg:block">
                <Link
                  href="/sites/main/join-us"
                  className="inline-flex items-center px-4 py-1.5 bg-white text-[#006430] hover:bg-[#4ade80] hover:text-[#006430] text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm"
                >
                  Join Us
                </Link>
              </motion.div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                {mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
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
              className="lg:hidden bg-[#006430] border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
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
                            className="block px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/sites/main/join-us"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full mt-2 px-5 py-2.5 bg-white text-[#006430] hover:bg-[#4ade80] text-sm font-semibold rounded-lg transition-all text-center"
                >
                  Join Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}