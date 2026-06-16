import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { CITY_ADMIN_ROLES } from "@/core/config/constants";

export const metadata = { title: "Cities" };

export default async function CitiesPage() {
  const session = await getSession();
  if (!session || !CITY_ADMIN_ROLES.includes(session.roleName)) {
    redirect("/sites/admin");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cities</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        City management is coming soon.
      </p>

      <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-green-800/30 dark:bg-[#0f2818]">
        <Building2 className="h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-500">This page is a placeholder.</p>
      </div>
    </div>
  );
}
