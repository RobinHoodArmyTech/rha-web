"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Award } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09]">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-4">
              <User className="w-3.5 h-3.5" /> My Profile
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Your Robin Profile</h1>
            <p className="text-gray-300">Manage your account and track your volunteer journey.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 p-8"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-[#1a6b3c] dark:text-[#4ade80]" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Guest Robin</h2>
              <p className="text-sm text-[#16a34a] font-semibold mt-1">Sign in to view your profile</p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "—" },
                { icon: MapPin, label: "City", value: "—" },
                { icon: Award, label: "Badge", value: "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-green-900/20 last:border-0">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
