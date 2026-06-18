import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminAppShell from "@/components/admin/AdminAppShell";

/**
 * Gate for the authenticated admin panel.
 *
 * Any logged-in user (any role) may enter — this is a shared panel, and the UI
 * shows/hides features based on the role from the JWT. Logged-out users are sent
 * to the login page. The decoded session is passed into the shell so client
 * components can read it via useAdminSession().
 *
 * Per-endpoint role rules are still enforced independently at the API layer.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/sites/admin/login");

  return <AdminAppShell session={session}>{children}</AdminAppShell>;
}
