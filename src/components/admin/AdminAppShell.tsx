"use client";

import type { JwtPayload } from "@/lib/jwt";
import { AdminSessionProvider } from "./AdminSessionProvider";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useState } from "react";

export default function AdminAppShell({
  session,
  children,
}: {
  session: JwtPayload;
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AdminSessionProvider session={session}>
      <div className="bg-background text-on-background font-body-md text-body-md flex h-screen overflow-hidden">
        <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
          <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-container-max mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
