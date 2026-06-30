"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/core/config/constants";
import { ADMIN_ROLES } from "@/core/config/constants";
import { useAdminSession } from "./AdminSessionProvider";

/** `roles` omitted → visible to every logged-in user. Otherwise only those roles see the item. */
type NavItem = { label: string; href: string; icon: string; roles?: Role[] };

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { roleName } = useAdminSession();

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/sites/admin", icon: "dashboard" },
    { label: "City Management", href: "/sites/admin/cities", icon: "location_city", roles: ADMIN_ROLES },
  ];

  const visibleNavItems = navItems.filter((item) => !item.roles || item.roles.includes(roleName));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`flex flex-col h-full py-6 w-64 border-r border-outline-variant bg-surface shrink-0 z-50 fixed md:relative transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="px-6 mb-8 flex items-center gap-3">
          <img
            alt="Robin Hood Army Emblem"
            className="w-10 h-10 rounded-full"
            src="/shared/images/icons/robin-hood-army-logo.png"
          />
          <div>
            <h1 className="font-display text-headline-md font-bold text-primary whitespace-nowrap">Robin Hood Army</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Global Operations</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 font-semibold rounded-lg mx-2 px-4 py-2 transition-all duration-200 ${isActive
                      ? "bg-secondary-container text-on-secondary-container scale-[0.98]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                      }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-6 mt-auto space-y-4">
          <ul className="border-t border-outline-variant pt-4">
            <li>
              <Link
                href="/sites/admin/login"
                className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface mx-2 px-4 py-2 hover:bg-surface-container-high transition-all duration-200"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
