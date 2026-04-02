"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ChevronDown, TrendingUp } from "lucide-react";

const cityData = [
  { city: "MUMBAI", checkIns: 585 },
  { city: "NOIDA", checkIns: 483 },
  { city: "DELHI", checkIns: 419 },
  { city: "PUNE", checkIns: 246 },
  { city: "BANGALORE", checkIns: 235 },
  { city: "HYDERABAD", checkIns: 179 },
  { city: "CHENNAI", checkIns: 147 },
  { city: "KOLKATA", checkIns: 132 },
  { city: "AHMEDABAD", checkIns: 98 },
  { city: "JAIPUR", checkIns: 76 },
];

const allCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Noida",
  "Lucknow", "Bhopal", "Surat", "Indore", "Nagpur",
];

const maxValue = Math.max(...cityData.map((c) => c.checkIns));

const barColors = [
  "from-[#22c55e] to-[#16a34a]",
  "from-[#4ade80] to-[#22c55e]",
  "from-[#16a34a] to-[#166534]",
  "from-[#14b8a6] to-[#0d9488]",
  "from-[#22c55e] to-[#14b8a6]",
  "from-[#4ade80] to-[#16a34a]",
  "from-[#22c55e] to-[#1a6b3c]",
  "from-[#14b8a6] to-[#22c55e]",
  "from-[#16a34a] to-[#22c55e]",
  "from-[#1a6b3c] to-[#22c55e]",
];

export default function CheckInHighlights() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCity, setSelectedCity] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-[#060f09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3"
          >
            Check-In Highlights
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight max-w-2xl"
          >
            Top 10 cities with Check-Ins over the{" "}
            <span className="text-[#1a6b3c] dark:text-[#4ade80]">last 60 days</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Bar Chart - takes 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-3"
          >
            {cityData.map((item, i) => {
              const pct = (item.checkIns / maxValue) * 100;
              return (
                <motion.div
                  key={item.city}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-4 group"
                >
                  {/* City name */}
                  <div className="w-28 flex-shrink-0 text-right">
                    <span className="text-xs font-bold text-[#1a6b3c] dark:text-[#4ade80] uppercase tracking-wide group-hover:text-[#22c55e] transition-colors">
                      {item.city}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-9 bg-gray-200 dark:bg-green-950/50 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${pct}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${barColors[i]} rounded-lg flex items-center justify-end pr-3 min-w-[3rem]`}
                    >
                      <span className="text-xs font-bold text-white/90">{item.checkIns}</span>
                    </motion.div>
                  </div>

                  {/* Rank */}
                  <div className="w-7 flex-shrink-0">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-600">
                      #{i + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right: City lookup widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-[#0f2818] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  Look up any city
                </h3>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Find out how many check-ins happened in your city this month.
              </p>

              {/* Custom dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-green-950/30 border border-gray-200 dark:border-green-800/40 rounded-xl text-sm text-left flex items-center justify-between text-gray-700 dark:text-gray-200 hover:border-[#22c55e] transition-colors"
                >
                  <span>{selectedCity || "Select a city..."}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0f2818] border border-gray-200 dark:border-green-800/40 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto"
                  >
                    {allCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {selectedCity && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#155e3a] to-[#0d3d27] rounded-xl p-4 text-center"
                >
                  <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    {selectedCity}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-3xl font-black text-white">
                      {cityData.find((c) => c.city === selectedCity.toUpperCase())?.checkIns ?? 0}
                    </span>
                  </div>
                  <p className="text-green-400/70 text-xs">Check-ins in 60 days</p>
                </motion.div>
              )}

              {/* Summary stats */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-green-900/30 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-black text-[#1a6b3c] dark:text-[#4ade80]">127</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cities Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-[#1a6b3c] dark:text-[#4ade80]">3,279</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Check-Ins</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
