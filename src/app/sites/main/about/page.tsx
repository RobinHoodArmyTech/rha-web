"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Target, Heart, Users, Globe, Quote } from "lucide-react";
import Image from "next/image";

const faqs = [
  { q: "What is Robin Hood Army?", a: "Robin Hood Army (RHA) is a zero-cost, volunteer-based organization that works to get surplus food from restaurants and other sources to the less fortunate populations in cities across South Asia and Africa. It was started in New Delhi, India, in August 2014." },
  { q: "How do I become a Robin?", a: "Simply sign up on our website or app, attend a drive in your city, and you are a Robin! We organize drives every weekend in cities across the world. All you need is enthusiasm and a desire to help." },
  { q: "What happens during a drive?", a: "During a drive, Robins collect leftover food from restaurants, hotels, and catering services, then distribute it to people in need — such as those living on the street, in slums, or in orphanages and old age homes." },
  { q: "Is there any cost to volunteer?", a: "No! Robin Hood Army is a zero-cost organization. We don't charge volunteers or food donors anything. Everything runs on goodwill and the spirit of giving." },
  { q: "How do badges work?", a: "When you participate in drives, you earn badges based on the number of drives completed: Cadet (1 drive), Ninja (10 drives), Gladiator (50 drives), and Centurion (100 drives). Check-In after each drive to track your progress." },
  { q: "Can restaurants/hotels partner with RHA?", a: "Absolutely! We welcome food partners of all sizes. Simply register as a food partner and our local Robin teams will coordinate regular pickups." },
  { q: "How many cities is RHA active in?", a: "Robin Hood Army is currently active in 230+ cities across 16 countries. We continue to expand with the help of passionate volunteers." },
  { q: "What is the Academy?", a: "The RHA Academy is our learning platform where Robins can access training materials, leadership guides, and courses to become a better volunteer and chapter leader." },
];

const testimonials = [
  { id: 1, name: "Aditi Mehta", role: "Centurion · Mumbai", quote: "Being part of Robin Hood Army has changed my perspective on food waste entirely. Seeing the smiles on people's faces when we deliver food is worth more than anything.", imageUrl: "https://picsum.photos/seed/t1/200/200" },
  { id: 2, name: "Sanjay Reddy", role: "Gladiator · Hyderabad", quote: "I started as a Cadet and didn't know what to expect. Now 57 drives later, every Sunday morning is the highlight of my week.", imageUrl: "https://picsum.photos/seed/t2/200/200" },
  { id: 3, name: "Kavya Nair", role: "Ninja · Bangalore", quote: "The Check-In system is brilliant! It keeps me motivated and accountable. Getting that Ninja badge was one of the proudest moments of my volunteer journey.", imageUrl: "https://picsum.photos/seed/t3/200/200" },
  { id: 4, name: "Mohit Agarwal", role: "Centurion · Delhi", quote: "100 drives. That's 100 weekends spent making a difference. RHA gave me purpose and a second family.", imageUrl: "https://picsum.photos/seed/t4/200/200" },
];

const stats = [
  { icon: Users, value: "2L+", label: "Volunteers Worldwide" },
  { icon: Globe, value: "230+", label: "Cities Active" },
  { icon: Heart, value: "6Cr+", label: "Meals Served" },
  { icon: Target, value: "16", label: "Countries" },
];

export default function AboutPage() {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-green-300 mb-4">About Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              We are the{" "}
              <span className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">Robin Hood Army</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              A zero-cost, volunteer-based organization on a mission to eliminate food waste and hunger — one drive at a time.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#0a1a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">Fighting hunger with food that would otherwise go to waste</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">Every day, restaurants, hotels, and catering companies produce enormous amounts of surplus food. At the same time, millions of people go to bed hungry. Robin Hood Army bridges this gap.</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Our volunteers — called Robins — collect this leftover food and distribute it to people living on streets, in slums, orphanages, and old age homes.</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-[#1a6b3c] dark:text-[#4ade80]" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 italic">&quot;A world where no one sleeps hungry&quot; — Our Vision</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }, i) => (
                <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.04 }} className="bg-gray-50 dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl p-6 text-center hover:border-[#22c55e]/40 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-[#1a6b3c] dark:text-[#4ade80]" />
                  </div>
                  <div className="text-3xl font-black text-[#1a6b3c] dark:text-[#4ade80] mb-1">{value}</div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="faqs" className="py-20 bg-gray-50 dark:bg-[#060f09]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">FAQ&apos;s</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </motion.div>
          <AccordionPrimitive.Root type="single" collapsible value={openItem} onValueChange={setOpenItem} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <AccordionPrimitive.Item value={`item-${i}`} className="bg-white dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl overflow-hidden hover:border-[#22c55e]/40 transition-colors">
                  <AccordionPrimitive.Trigger className="w-full px-6 py-4 flex items-center justify-between text-left group">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm pr-4">{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80] flex-shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </AccordionPrimitive.Trigger>
                  <AccordionPrimitive.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                    <div className="px-6 pb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-green-900/20 pt-3">{faq.a}</p>
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </motion.div>
            ))}
          </AccordionPrimitive.Root>
        </div>
      </section>

      <section id="robin-speak" className="py-20 bg-white dark:bg-[#0a1a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">Robin Speak</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Stories from the field</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-gray-50 dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl p-6 hover:border-[#22c55e]/40 hover:shadow-xl transition-all">
                <Quote className="w-8 h-8 text-[#22c55e]/30 mb-4" fill="currentColor" />
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={t.imageUrl} alt={t.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-[#16a34a] font-semibold">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
