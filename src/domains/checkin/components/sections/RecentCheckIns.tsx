"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Utensils, MapPin, Clock } from "lucide-react";
import Image from "next/image";

const checkInPhotos = [
  { id: 1, imageUrl: "https://picsum.photos/seed/rha1/300/300", city: "Mumbai", timeAgo: "2h ago", volunteer: "Priya S." },
  { id: 2, imageUrl: "https://picsum.photos/seed/rha2/300/300", city: "Delhi", timeAgo: "3h ago", volunteer: "Rahul M." },
  { id: 3, imageUrl: "https://picsum.photos/seed/rha3/300/300", city: "Bangalore", timeAgo: "4h ago", volunteer: "Sneha K." },
  { id: 4, imageUrl: "https://picsum.photos/seed/rha4/300/300", city: "Pune", timeAgo: "5h ago", volunteer: "Amit P." },
  { id: 5, imageUrl: "https://picsum.photos/seed/rha5/300/300", city: "Hyderabad", timeAgo: "6h ago", volunteer: "Kavya R." },
  { id: 6, imageUrl: "https://picsum.photos/seed/rha6/300/300", city: "Chennai", timeAgo: "7h ago", volunteer: "Vikram N." },
  { id: 7, imageUrl: "https://picsum.photos/seed/rha7/300/300", city: "Kolkata", timeAgo: "8h ago", volunteer: "Ananya D." },
  { id: 8, imageUrl: "https://picsum.photos/seed/rha8/300/300", city: "Noida", timeAgo: "9h ago", volunteer: "Rohan S." },
  { id: 9, imageUrl: "https://picsum.photos/seed/rha9/300/300", city: "Jaipur", timeAgo: "10h ago", volunteer: "Meera T." },
  { id: 10, imageUrl: "https://picsum.photos/seed/rha10/300/300", city: "Ahmedabad", timeAgo: "11h ago", volunteer: "Suresh B." },
  { id: 11, imageUrl: "https://picsum.photos/seed/rha11/300/300", city: "Surat", timeAgo: "12h ago", volunteer: "Neha V." },
  { id: 12, imageUrl: "https://picsum.photos/seed/rha12/300/300", city: "Indore", timeAgo: "13h ago", volunteer: "Arjun L." },
];

const stats = [
  {
    icon: Users,
    value: "1,054",
    label: "Robins",
    sub: "Checked-In last week",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: Utensils,
    value: "1,32,233",
    label: "Meals",
    sub: "Served last week",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
  },
];

export default function RecentCheckIns() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3"
            >
              Recent Check-Ins
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight"
            >
              Your fellow Robins are{" "}
              <span className="text-[#1a6b3c] dark:text-[#4ade80]">
                Checking-In
              </span>{" "}
              across the world
            </motion.h2>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-4">
            {stats.map(({ icon: Icon, value, label, sub, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className={`flex-1 ${bg} rounded-2xl p-5 border border-gray-100 dark:border-green-900/30`}
              >
                <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-3xl font-black ${color} mb-0.5`}>{value}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {checkInPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-md"
            >
              <Image
                src={photo.imageUrl}
                alt={`Check-in from ${photo.city}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-1 text-white text-[10px] font-semibold mb-0.5">
                  <MapPin className="w-2.5 h-2.5 text-green-400" />
                  {photo.city}
                </div>
                <div className="flex items-center gap-1 text-gray-300 text-[9px]">
                  <Clock className="w-2 h-2" />
                  {photo.timeAgo}
                </div>
              </div>
              {/* Always visible city tag */}
              <div className="absolute top-2 left-2">
                <span className="bg-black/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                  {photo.city}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          <a
            href="/sites/checkin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a6b3c] dark:text-[#4ade80] hover:underline"
          >
            View all check-ins
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
