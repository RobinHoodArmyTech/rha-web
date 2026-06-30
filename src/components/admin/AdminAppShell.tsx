"use client";

import { useEffect, useState } from "react";
import type { JwtPayload } from "@/lib/jwt";
import { AdminSessionProvider } from "./AdminSessionProvider";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const COLLAPSE_KEY = "rha-admin-sidebar-collapsed";

export default function AdminAppShell({
  session,
  children,
}: {
  session: JwtPayload;
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop rail

  // Restore the persisted collapse preference (deferred to avoid a hydration
  // mismatch and the setState-in-effect lint rule).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <AdminSessionProvider session={session}>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a1a0f]">
        <AdminSidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapsed}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onMenuClick={() => setIsMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
