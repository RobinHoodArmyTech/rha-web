import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role, ADMIN_ROLES } from "@/core/config/constants";
import { getSession } from "@/lib/session";

export const metadata = { title: "Admin Dashboard" };

const cards = [
  {
    href: "/sites/admin/cities",
    title: "Cities",
    description: "Create, edit and manage cities and their details.",
    icon: Building2,
    ready: true,
    allowedRoles: ADMIN_ROLES,
  },
  {
    href: "#",
    title: "Signups",
    description: "View and export volunteer signup data.",
    icon: Users,
    ready: false,
    allowedRoles: undefined as Role[] | undefined,
  },
];

export default async function AdminDashboardPage() {
  const session = await getSession();
  const visibleCards = cards.filter(
    (card) => !card.allowedRoles || (session && card.allowedRoles.includes(session.roleName)),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage the Robin Hood Army platform.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div
              className={cn(
                "h-full rounded-2xl border bg-white p-6 transition-all dark:bg-[#0f2818]",
                card.ready
                  ? "border-slate-200 hover:border-[#1a6b3c] hover:shadow-md dark:border-green-800/30 dark:hover:border-[#4ade80]"
                  : "border-slate-200 opacity-60 dark:border-green-800/30",
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#155e3a]/10 text-[#155e3a] dark:bg-[#4ade80]/10 dark:text-[#4ade80]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                {card.title}
                {!card.ready && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Soon
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{card.description}</p>
            </div>
          );

          return card.ready ? (
            <Link key={card.title} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.title}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
