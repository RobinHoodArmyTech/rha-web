"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Compass, Medal, Swords, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

const activeRobins = [
  {
    id: 1,
    name: "Aryan Kapoor",
    badge: "ninja",
    title: "Latest Ninja",
    location: "Mumbai",
    imageUrl: "https://picsum.photos/seed/robin1/200/200",
    drives: 10,
    subtitle: "10 drives completed",
  },
  {
    id: 2,
    name: "Priya Sharma",
    badge: "centurion",
    title: "Most Active",
    location: "Barabanki",
    imageUrl: "https://picsum.photos/seed/robin2/200/200",
    drives: 134,
    subtitle: "Most Active in Barabanki",
  },
  {
    id: 3,
    name: "Vikram Singh",
    badge: "centurion",
    title: "Latest Centurion",
    location: "Delhi",
    imageUrl: "https://picsum.photos/seed/robin3/200/200",
    drives: 100,
    subtitle: "100 drives completed",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    badge: "gladiator",
    title: "Top Gladiator",
    location: "Pune",
    imageUrl: "https://picsum.photos/seed/robin4/200/200",
    drives: 57,
    subtitle: "57 drives and counting",
  },
  {
    id: 5,
    name: "Rahul Dev",
    badge: "ninja",
    title: "Rising Star",
    location: "Bangalore",
    imageUrl: "https://picsum.photos/seed/robin5/200/200",
    drives: 15,
    subtitle: "15 drives completed",
  },
];

const badgeConfig = {
  cadet: { icon: Medal, color: "text-amber-400", bg: "bg-amber-400/20 border-amber-400/40" },
  ninja: { icon: Compass, color: "text-teal-400", bg: "bg-teal-400/20 border-teal-400/40" },
  gladiator: { icon: Swords, color: "text-orange-400", bg: "bg-orange-400/20 border-orange-400/40" },
  centurion: { icon: Shield, color: "text-purple-400", bg: "bg-purple-400/20 border-purple-400/40" },
};

export default function ActiveRobins() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
            Community Heroes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Some{" "}
            <span className="text-[#1a6b3c] dark:text-[#4ade80]">Active Robins</span>{" "}
            on the field
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {activeRobins.map((robin, i) => {
            const badge = badgeConfig[robin.badge as keyof typeof badgeConfig];
            const BadgeIcon = badge.icon;

            return (
              <motion.div
                key={robin.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="xl:col-span-1 bg-gray-50 dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl p-5 text-center group hover:border-[#22c55e]/40 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-gray-200 dark:ring-green-900/40 group-hover:ring-[#22c55e]/50 transition-all">
                    <Image
                      src={robin.imageUrl}
                      alt={robin.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  {/* Badge icon overlay */}
                  <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-lg border ${badge.bg} flex items-center justify-center shadow-sm`}>
                    <BadgeIcon className={`w-3.5 h-3.5 ${badge.color}`} strokeWidth={2.5} />
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 truncate">
                  {robin.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">
                  {robin.location}
                </p>

                {/* Badge pill */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${badge.bg} mb-2`}>
                  <BadgeIcon className={`w-3 h-3 ${badge.color}`} strokeWidth={2.5} />
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${badge.color}`}>
                    {robin.badge}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">
                  {robin.subtitle}
                </p>
              </motion.div>
            );
          })}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="xl:col-span-1 bg-gradient-to-br from-[#155e3a] to-[#0d3d27] rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-4 border border-green-700/30"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-[#4ade80]" fill="currentColor" />
            </div>
            <p className="text-white text-xs font-medium leading-relaxed">
              Check-in to your next drive! And you may see yourself featured here.
            </p>
            <motion.a
              href="/sites/checkin"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a1a0f] text-xs font-bold rounded-full transition-all"
            >
              Check-In Now
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
