"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ChevronDown, TrendingUp } from "lucide-react";
import type { CityCheckinCount } from "@/core/services/backend/checkin/checkinService";
import { api } from "@/lib/http";

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
  const [cities, setCities] = useState<CityCheckinCount[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Cities ranked by check-ins over the last 60 days (public).
  useEffect(() => {
    api
      .get<{ data: CityCheckinCount[] }>("/checkin/highlights")
      .then((res) => setCities(res.data ?? []))
      .catch((err) => console.error(err))
      .finally(() => setLoaded(true));
  }, []);

  // `cities` includes every city (0-count ones too). The chart shows only the
  // top cities that actually have check-ins; the dropdown/lookup covers all.
  const activeCities = cities.filter((c) => c.checkins > 0);
  const topCities = activeCities.slice(0, 10);
  const maxValue = topCities[0]?.checkins || 1; // `|| 1` guards against a 0 max
  const totalCheckins = activeCities.reduce((sum, c) => sum + c.checkins, 0);
  const dropdownCities = [...cities].sort((a, b) => a.cityName.localeCompare(b.cityName));
  const selected = cities.find((c) => c.cityName === selectedCity);

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
            {topCities.map((item, i) => {
              const pct = (item.checkins / maxValue) * 100;
              return (
                <motion.div
                  key={item.cityId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-4 group"
                >
                  {/* City name */}
                  <div className="w-28 flex-shrink-0 text-right">
                    <span className="text-xs font-bold text-[#1a6b3c] dark:text-[#4ade80] uppercase tracking-wide group-hover:text-[#22c55e] transition-colors">
                      {item.cityName}
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
                      <span className="text-xs font-bold text-white/90">{item.checkins}</span>
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

            {loaded && topCities.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-green-900/40 py-16 text-center text-gray-500 dark:text-gray-400">
                No check-ins in the last 60 days yet.
              </div>
            )}
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
                Find out how many check-ins happened in your city over the last 60 days.
              </p>

              {/* Custom dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  disabled={cities.length === 0}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-green-950/30 border border-gray-200 dark:border-green-800/40 rounded-xl text-sm text-left flex items-center justify-between text-gray-700 dark:text-gray-200 hover:border-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {dropdownCities.map((c) => (
                      <button
                        key={c.cityId}
                        onClick={() => { setSelectedCity(c.cityName); setDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#1a6b3c] dark:hover:text-[#4ade80] transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {c.cityName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#155e3a] to-[#0d3d27] rounded-xl p-4 text-center"
                >
                  <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    {selected.cityName}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-3xl font-black text-white">{selected.checkins}</span>
                  </div>
                  <p className="text-green-400/70 text-xs">Check-ins in 60 days</p>
                </motion.div>
              )}

              {/* Summary stats */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-green-900/30 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-black text-[#1a6b3c] dark:text-[#4ade80]">
                    {loaded ? activeCities.length : "—"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cities Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-[#1a6b3c] dark:text-[#4ade80]">
                    {loaded ? totalCheckins.toLocaleString("en-IN") : "—"}
                  </div>
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
