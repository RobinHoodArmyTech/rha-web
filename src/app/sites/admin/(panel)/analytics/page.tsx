export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-headline-lg font-bold text-on-surface">Analytics</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">View detailed reports and insights on global operations.</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-soft p-12 text-center">
        <span className="material-symbols-outlined text-[48px] text-primary mb-4">monitoring</span>
        <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">Analytics Dashboard is coming soon</h3>
        <p className="text-on-surface-variant">Detailed reporting features will be available in a future update.</p>
      </div>
    </div>
  );
}
