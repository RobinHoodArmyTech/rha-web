import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09]">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-300">How we collect, use, and protect your data.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 p-8 sm:p-12 prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: March 2026</p>

          {[
            {
              title: "1. Information We Collect",
              body: "We collect information you provide when you register, such as your name, email address, and city. When you submit a check-in, we also collect photos you upload and the notes you provide.",
            },
            {
              title: "2. How We Use Your Information",
              body: "Your information is used to record your volunteer drives, award badges based on participation, and display anonymized community statistics. We do not sell your personal data.",
            },
            {
              title: "3. Photo Storage",
              body: "Photos you upload for check-ins are stored securely and may be displayed on our platform to celebrate volunteer activity. You can request deletion of your photos at any time.",
            },
            {
              title: "4. Cookies",
              body: "We use a minimal session cookie to keep you logged in. We do not use tracking or advertising cookies.",
            },
            {
              title: "5. Data Sharing",
              body: "We do not share your personal information with third parties except as necessary to operate the service (e.g., cloud storage providers) or as required by law.",
            },
            {
              title: "6. Your Rights",
              body: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@robinhoodarmy.com.",
            },
            {
              title: "7. Contact",
              body: "If you have any questions about this Privacy Policy, please reach out to us at privacy@robinhoodarmy.com.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="mb-8">
              <h2 className="text-base font-black text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
