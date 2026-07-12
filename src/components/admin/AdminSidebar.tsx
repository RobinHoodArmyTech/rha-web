"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LayoutDashboard, Building2, UserPlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role, ADMIN_ROLES } from "@/core/config/constants";
import { useAdminSession } from "./AdminSessionProvider";

/** `roles` omitted → visible to every logged-in user. Otherwise only those roles see the item. */
type NavItem = { label: string; href: string; icon: React.ElementType; roles?: Role[] };

// Vertical nav scales to many sections — add new entries here.
const navItems: NavItem[] = [
  { label: "Dashboard", href: "/sites/admin", icon: LayoutDashboard },
  { label: "Cities", href: "/sites/admin/cities", icon: Building2, roles: ADMIN_ROLES },
  { label: "Representatives", href: "/sites/admin/representatives", icon: UserPlus, roles: ADMIN_ROLES },
  // Visible to every role — the API scopes non-admins to their own city.
  { label: "Signups", href: "/sites/admin/signups", icon: UserPlus },
];

interface AdminSidebarProps {
  /** Mobile drawer open/closed. */
  isOpen: boolean;
  onClose: () => void;
  /** Desktop icon-only rail. */
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const { roleName } = useAdminSession();

  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(roleName));

  // Collapse is a desktop-only affordance — the mobile drawer always shows full labels.
  const labelHidden = isCollapsed ? "md:hidden" : "";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-lg transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none dark:border-green-800/30 dark:bg-[#0f2818]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-16" : "md:w-64",
        )}
      >
        {/* Collapse toggle — floats on the sidebar's right edge (desktop only) */}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-[#1a6b3c] md:flex dark:border-green-800/40 dark:bg-[#0f2818] dark:text-slate-300 dark:hover:bg-green-950/30 dark:hover:text-[#4ade80]"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-green-800/30">
          <Link href="/sites/admin" className="group flex items-center gap-2 overflow-hidden" onClick={onClose}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#155e3a]/10 text-[#155e3a] dark:bg-[#4ade80]/10 dark:text-[#4ade80]">
              <Shield className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className={cn("whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white", labelHidden)}>
              RHA Admin
            </span>
          </Link>
          {/* Close (mobile only) */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden dark:hover:bg-green-900/30 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/sites/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isCollapsed && "md:justify-center md:px-0",
                  active
                    ? "bg-[#155e3a]/10 font-semibold text-[#1a6b3c] dark:bg-[#4ade80]/10 dark:text-[#4ade80]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-green-900/30 dark:hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn("whitespace-nowrap", labelHidden)}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
