export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-headline-lg font-bold text-on-surface">Settings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage system preferences and administrative configurations.</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-soft p-12 text-center">
        <span className="material-symbols-outlined text-[48px] text-primary mb-4">settings</span>
        <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">System Settings</h3>
        <p className="text-on-surface-variant">Settings configuration options will appear here.</p>
      </div>
    </div>
  );
}
