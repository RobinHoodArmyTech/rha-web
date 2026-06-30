import type { JwtPayload } from "@/lib/jwt";
import { AdminSessionProvider } from "./AdminSessionProvider";
import AdminNavbar from "./AdminNavbar";

export default function AdminAppShell({
  session,
  children,
}: {
  session: JwtPayload;
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider session={session}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a0f]">
        <AdminNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">{children}</main>
      </div>
    </AdminSessionProvider>
  );
}
