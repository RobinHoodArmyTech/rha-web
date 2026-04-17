"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Target, Heart, Users, Globe, Quote } from "lucide-react";
import Image from "next/image";

const faqs: { q: string; a: string; image?: string }[] = [
  { q: "What is Robin Hood Army?", a: 'The Robin Hood Army is a zero-funds volunteer organization that works to get surplus food from restaurants and communities to serve the less fortunate. Our \u201cRobins\u201d are largely students and young working professionals \u2013 everyone does this in their free time. The lesser fortunate sections of society we serve include homeless families, orphanages, patients from public hospitals and old age homes.' },
  { q: "How did it start?", a: "Modeled on the Re-Food program in Portugal, the Robin Hood Army started on the streets of Delhi, India in August 2014." },
  { q: "So, where are you now?", a: "At last count, we have served 183 M people across 406 cities in 12 countries. Still 1% Done." },
  { q: "What about the funds?", a: "We have just one rule – we are a zero funds organization. The Robin Hood Army has no revenue, employees, nor office space – if you want to help, all we need is your time. By the way, our balance sheet from last year:", image: "/main/images/_drafts/Balance Sheet.jpg" },
  { q: "Wait, I don’t get it. How do you grow without money?", a: "Simple – we are in the business of spreading smiles. We share our experiences on social media. Facebook, Instagram and WhatsApp are our tools to grow. Along the way, our extremely passionate Robins and kind members of the press community have helped drive our mission to the world." },
  { q: "I like this. How can I help?", a: "Easy – we need just 3 hours of your week on a regular basis. You can join our team of Robins or contribute food in your city – you’ll find everything you need to know." },
  { q: "Do you provide certificate to volunteers??", a: "Naa – we want our team to serve less fortunate people, not build their own polished resumes 🙂. Citizens First → Mission Next → Robins Last." },
  { q: "How can I donate?", a: "Thanks for wanting to support us – the Robin Hood Army DOES NOT accept money. We have grown through contributions in kind and partnerships." },
  { q: "Wait, so do you have any rules?", a: "Three specifically – we do not collect money, we are a-political, and we serve all religions. If anyone claims to being those using the name of RHA, please drop us a note here. Also irritating legal disclaimer: RHA is a zero funds platform with no employees, office space, and insurance hence cannot assume liability. Any personal risk is borne by our Robins individually." },
  { q: "I’m with the press and want to know more! How do I get in touch?", a: "Thanks for the interest – hopefully this will help us spread our reach to more Robins, more cities, and more people. Do write to us at info@robinhoodarmy.com." },
  { q: "I don’t see my question here - help!", a: "Drop us an email at info@robinhoodarmy.com and let’s talk." },
];

function renderAnswer(text: string) {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const parts = text.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
  return parts.map((part, i) =>
    emailPattern.test(part) ? (
      <a key={i} href={`mailto:${part}`} className="text-[#16a34a] hover:underline font-medium">{part}</a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

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
    <main className="pt-16">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: Any Questions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-24"
            >
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">FAQ&apos;s</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl  font-black text-gray-900 dark:text-white mb-6 leading-tight">Any Questions?</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We&apos;ve compiled answers to the most common questions about who we are, how we work, and how you can get involved.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Can&apos;t find what you&apos;re looking for? Drop us a line at{" "}
                <a href="mailto:info@robinhoodarmy.com" className="text-[#16a34a] hover:underline font-medium">
                  info@robinhoodarmy.com
                </a>
              </p>
            </motion.div>

            {/* Right: FAQ Accordion */}
            <div>
              <AccordionPrimitive.Root type="single" collapsible value={openItem} onValueChange={setOpenItem} className="space-y-3">
                {faqs.map((faq, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <AccordionPrimitive.Item value={`item-${i}`} className="bg-white dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl overflow-hidden hover:border-[#22c55e]/40 transition-colors">
                      <AccordionPrimitive.Trigger className="w-full px-6 py-4 flex items-center justify-between text-left group">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm pr-4">{faq.q}</span>
                        <ChevronDown className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80] flex-shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                      </AccordionPrimitive.Trigger>
                      <AccordionPrimitive.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                        <div className="px-6 pb-4 border-t border-gray-100 dark:border-green-900/20 pt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {renderAnswer(faq.a)}
                          </p>
                          {faq.image && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 dark:border-green-900/20">
                              <Image src={faq.image} alt="RHA Non-Financial Statement" width={800} height={500} className="w-full h-auto" />
                            </div>
                          )}
                        </div>
                      </AccordionPrimitive.Content>
                    </AccordionPrimitive.Item>
                  </motion.div>
                ))}
              </AccordionPrimitive.Root>
            </div>

          </div>
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
