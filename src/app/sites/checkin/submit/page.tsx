"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, FileText, Upload, CheckCircle, X } from "lucide-react";
import Image from "next/image";

const CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore",
  "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra",
];

export default function CheckInSubmitPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photo || !city) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#0f2818] rounded-3xl border border-green-200 dark:border-green-900/40 p-10 max-w-md w-full text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#1a6b3c] dark:text-[#4ade80]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Check-In Recorded!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your drive in <span className="font-semibold text-[#1a6b3c] dark:text-[#4ade80]">{city}</span> has been saved. Keep spreading the love!
          </p>
          <button
            onClick={() => { setSubmitted(false); setPhoto(null); setCity(""); setNotes(""); }}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1a6b3c] to-[#166534] text-white font-semibold rounded-xl hover:from-[#22c55e] hover:to-[#16a34a] transition-all"
          >
            Submit Another
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09]">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-4">
              <CheckCircle className="w-3.5 h-3.5" /> Check-In Now!
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Submit Your Drive</h1>
            <p className="text-gray-300">Upload a selfie, select your city, and log your drive.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 p-8 shadow-xl space-y-6"
        >
          {/* Photo upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> Drive Selfie *
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {photo ? (
              <div className="relative rounded-2xl overflow-hidden h-52">
                <Image src={photo} alt="Preview" fill className="object-cover" sizes="(max-width: 640px) 100vw, 512px" />
                <button
                  type="button"
                  onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-52 rounded-2xl border-2 border-dashed border-gray-200 dark:border-green-900/40 hover:border-[#22c55e] hover:bg-green-50 dark:hover:bg-green-900/10 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500"
              >
                <Upload className="w-8 h-8" />
                <span className="text-sm font-medium">Click to upload photo</span>
                <span className="text-xs">JPG, PNG, WEBP up to 10MB</span>
              </button>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> City *
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#0a1a0f] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all"
            >
              <option value="">Select your city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="How was your drive today? Any special moments?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#0a1a0f] text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all resize-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={!photo || !city || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Submit Check-In</>
            )}
          </motion.button>
        </motion.form>
      </section>
    </main>
  );
}
