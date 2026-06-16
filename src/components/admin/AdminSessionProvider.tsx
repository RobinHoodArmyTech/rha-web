"use client";

import { createContext, useContext } from "react";
import type { JwtPayload } from "@/lib/jwt";

/**
 * The full decoded JWT payload (userId, roleId, roleName), made available to
 * any client component under the panel. Decoded server-side and passed in by
 * the panel layout. `roleName` drives role-based UI show/hide.
 */
const AdminSessionContext = createContext<JwtPayload | null>(null);

export function AdminSessionProvider({
  session,
  children,
}: {
  session: JwtPayload;
  children: React.ReactNode;
}) {
  return (
    <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>
  );
}

/** Access the current user's full session payload inside any client component under the panel. */
export function useAdminSession(): JwtPayload {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) {
    throw new Error("useAdminSession must be used within an AdminSessionProvider");
  }
  return ctx;
}
