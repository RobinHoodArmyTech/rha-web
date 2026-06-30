"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Shield, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role, ADMIN_ROLES } from "@/core/config/constants";
import UserMenu from "./UserMenu";
import { useAdminSession } from "./AdminSessionProvider";

const navLinks: { label: string; href: string; allowedRoles?: Role[] }[] = [
  { label: "Dashboard", href: "/sites/admin" },
  { label: "Cities", href: "/sites/admin/cities", allowedRoles: ADMIN_ROLES },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const { roleName } = useAdminSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const visibleLinks = navLinks.filter(
    (link) => !link.allowedRoles || link.allowedRoles.includes(roleName),
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#155e3a] border-b border-green-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/sites/admin" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-white/15 group-hover:bg-white/25 rounded-lg flex items-center justify-center transition-colors">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">RHA Admin</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {visibleLinks.map((link) => {
              const active = link.href === "/sites/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white/20 text-white font-semibold"
                      : "text-green-100 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right — theme + account menu */}
          <div className="flex items-center gap-2">
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

            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
