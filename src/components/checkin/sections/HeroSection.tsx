"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import BadgeCard from "@/components/checkin/BadgeCard";

const badges = [
  { name: "CADET", drives: 1, icon: "medal" as const, description: "First drive" },
  { name: "NINJA", drives: 10, icon: "compass" as const, description: "10 drives" },
  { name: "GLADIATOR", drives: 50, icon: "helmet" as const, description: "50 drives" },
  { name: "CENTURION", drives: 100, icon: "shield" as const, description: "100 drives" },
];

const features = [
  "Upload a selfie of your drive",
  "Unlock exclusive badges",
  "Share achievements with friends",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] overflow-hidden flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                RHA Drive Check-In
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
            >
              Check-In to your{" "}
              <span className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
                RHA Drive
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Check-In by uploading a selfie of your drive and unlock badges
              that you can share with your friends. Every meal you deliver
              brings you closer to becoming a legend.
            </motion.p>

            <motion.ul variants={itemVariants} className="space-y-3 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-green-200">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.a
                href="/sites/checkin"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(74,222,128,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a1a0f] font-bold text-sm rounded-full shadow-xl transition-all duration-300"
              >
                Check-In Now
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="/about"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-semibold text-sm rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right: Badge Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Background glow card */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-3xl blur-xl scale-110" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
                <p className="text-center text-green-300 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
                  Earn Your Badges
                </p>
                <div className="grid grid-cols-2 gap-8">
                  {badges.map((badge, i) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 200 }}
                    >
                      <BadgeCard
                        name={badge.name}
                        drives={badge.drives}
                        icon={badge.icon}
                        description={badge.description}
                        size="md"
                        earned={i < 2}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                  <p className="text-gray-400 text-xs">
                    <span className="text-green-400 font-bold">2</span> badges earned ·{" "}
                    <span className="text-gray-300 font-medium">2 more to unlock</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 74.7C120 69.3 240 58.7 360 58.7C480 58.7 600 69.3 720 72C840 74.7 960 69.3 1080 61.3C1200 53.3 1320 42.7 1380 37.3L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" className="dark:fill-[#0a1a0f]"/>
        </svg>
      </div>
    </section>
  );
}
