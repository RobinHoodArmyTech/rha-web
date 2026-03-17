"use client";

import { motion } from "framer-motion";
import { BarChart3, CheckCircle, Award, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09]">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-4">
              <BarChart3 className="w-3.5 h-3.5" /> Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Your Impact Dashboard</h1>
            <p className="text-gray-300">Track your drives, badges, and community impact.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { icon: CheckCircle, label: "Total Drives", value: "—" },
              { icon: Award, label: "Current Badge", value: "—" },
              { icon: TrendingUp, label: "This Month", value: "—" },
            ].map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0f2818] rounded-2xl border border-gray-100 dark:border-green-900/30 p-6 text-center"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#1a6b3c] dark:text-[#4ade80]" />
                </div>
                <div className="text-2xl font-black text-[#1a6b3c] dark:text-[#4ade80] mb-1">{value}</div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</div>
              </motion.div>
            ))}
          </div>
          <div className="bg-white dark:bg-[#0f2818] rounded-2xl border border-gray-100 dark:border-green-900/30 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Full dashboard coming soon. Sign in to see your personal stats.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
