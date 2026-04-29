"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Target, Heart, Users, Globe, Play, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import videos from "@/data/robin-speaks-videos.json";

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
  { q: "How do I start a RHA City?", a: "Drop us an email at info@robinhoodarmy.com and let’s talk." },
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


const stats = [
  { icon: Users, value: "2L+", label: "Volunteers Worldwide" },
  { icon: Globe, value: "230+", label: "Cities Active" },
  { icon: Heart, value: "6Cr+", label: "Meals Served" },
  { icon: Target, value: "16", label: "Countries" },
];

type Video = typeof videos[0];

export default function AboutPage() {
  const [openItem, setOpenItem] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveVideo(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

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

      <section id="robin-speak" className="pb-20 bg-white dark:bg-[#0a1a0f]">
        {/* Compact hero banner */}
        <div className="relative h-64 sm:h-110 overflow-hidden">
          <Image
            src="/main/images/_drafts/robinspeakfinal.jpg"
            alt="Robin Speak hero"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-full flex items-center px-8 sm:px-12 lg:px-20 max-w-xl"
          >
            <h2 className="text-white font-black text-xl sm:text-2xl leading-snug drop-shadow-md">
              Hear Robins talk about the most special part of our lives
            </h2>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">Robin Speak</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Stories from the field</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">Talks, news features, and field stories from Robins around the world.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, i) => (
              <motion.div
                key={video.order}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="group bg-gray-50 dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl overflow-hidden hover:border-[#22c55e]/50 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300"
              >
                {/* Thumbnail — click to play */}
                <button
                  onClick={() => setActiveVideo(video)}
                  className="relative w-full aspect-video overflow-hidden bg-gray-200 dark:bg-[#0a1a0f] block cursor-pointer"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </button>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-1.5 group-hover:text-[#16a34a] transition-colors duration-200 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">{video.source}</span>
                    <span className="mx-1.5 text-gray-300 dark:text-gray-600">&middot;</span>
                    {video.speaker}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl bg-[#0f2818] rounded-2xl overflow-hidden shadow-2xl border border-green-900/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-white/10">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#4ade80] uppercase tracking-widest mb-0.5">
                  {activeVideo.source} &middot; {activeVideo.speaker}
                </p>
                <h3 className="text-white font-bold text-base leading-snug line-clamp-1">
                  {activeVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Watch on YouTube
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Embed */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
