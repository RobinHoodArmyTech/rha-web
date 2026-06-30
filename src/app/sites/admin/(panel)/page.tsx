export const metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-headline-lg font-bold text-on-surface">Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Here&apos;s what&apos;s happening across global operations today.</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_1px_3px_rgba(0,0,0,0.02),_0px_4px_8px_rgba(0,0,0,0.04)] p-12 text-center">
        <span className="material-symbols-outlined text-[48px] text-primary mb-4">dashboard</span>
        <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">Admin Dashboard is coming soon</h3>
        <p className="text-on-surface-variant">The overview and insights dashboard will be available in a future update.</p>
      </div>
    </div>
  );
}
