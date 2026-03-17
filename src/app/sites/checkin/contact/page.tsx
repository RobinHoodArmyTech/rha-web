"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09]">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-4">
              <Mail className="w-3.5 h-3.5" /> Contact Us
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Get in Touch</h1>
            <p className="text-gray-300">Have a question or need help? We&apos;re here for you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#0f2818] rounded-3xl border border-green-200 dark:border-green-900/40 p-10 text-center shadow-xl"
            >
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-7 h-7 text-[#1a6b3c] dark:text-[#4ade80]" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Message Sent!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 p-8 shadow-xl space-y-5"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#0a1a0f] text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#1a6b3c] dark:text-[#4ade80]" /> Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#0a1a0f] text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#1a6b3c] dark:text-[#4ade80]" /> Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#0a1a0f] text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] transition-all resize-none"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </motion.button>
            </motion.form>
          )}
        </div>
      </section>
    </main>
  );
}
