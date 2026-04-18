"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, School, Heart, Mail, Download, MapPin, Shield, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const slides = [
  {
    src: "/main/images/_drafts/academyslide1.jpg",
    alt: "Academy children with energy and focus",
    caption: "Our very own Robin Hood Academy",
  },
  {
    src: "/main/images/_drafts/academyslide2.jpg",
    alt: "Children going to school",
    caption: "While meals provide energy and focus",
  },
  {
    src: "/main/images/_drafts/academyslide3.jpg",
    alt: "RHA Academy teaching session",
    caption: "Going to school will make our champs truly independent",
  },
  {
    src: "/main/images/_drafts/academyslide4.jpg",
    alt: "Robin Hood Academy",
    caption: "Introducing the RHA's engine to drive education",
  },
];

const pillars = [
  {
    icon: BookOpen,
    title: "Standardised Curriculum",
    description:
      "A three-level curriculum delivered consistently across all academy cities, supported by internally developed teacher guides to ensure quality learning.",
  },
  {
    icon: School,
    title: "#MissionAdmission",
    description:
      "Our flagship initiative focused on enrolling academy graduates into government schools — documenting best practices for successful student placement.",
  },
  {
    icon: Users,
    title: "Weekend Classes & Excursions",
    description:
      "Regular weekend sessions combined with educational excursions that make learning engaging, accessible, and joyful for every child.",
  },
  {
    icon: Heart,
    title: "Patience & Compassion",
    description:
      "Every Robin who teaches brings not just knowledge, but the values of patience and compassion that create lasting impact in a child's life.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Equal Care",
    description:
      "We respect each student's well-being and shall never resort to physical punishment.",
  },
  {
    icon: School,
    title: "Equal Opportunity",
    description:
      "Each student has the opportunity to learn, without discrimination.",
  },
  {
    icon: Heart,
    title: "Compassion First",
    description:
      "We lead with empathy — understanding each child's unique background and journey.",
  },
  {
    icon: MapPin,
    title: "Community Rooted",
    description:
      "Academy sessions are built around and within the communities we serve.",
  },
];

const gallery = [
  { src: "/main/images/_drafts/academyslide1.jpg", alt: "Academy session with children" },
  { src: "/main/images/_drafts/academyslide2.jpg", alt: "Robin volunteering with kids" },
  { src: "/main/images/_drafts/academyslide3.jpg", alt: "Outdoor teaching session" },
  { src: "/main/images/_drafts/academyslide4.jpg", alt: "Children at an excursion" },
];

export default function AcademyPage() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <main>

      {/* ── Hero Carousel ────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-black"
        style={{ paddingTop: "4rem" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Main slide — fills the remaining viewport below the fixed 4rem navbar */}
        <div
          className="relative overflow-hidden"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.45, 0, 0.55, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={slides[current].src}
                alt={slides[current].alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={current === 0}
              />
              {/* Caption bar at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-10 pt-20 text-center"
              >
                <p className="text-white font-black text-2xl sm:text-3xl lg:text-4xl max-w-3xl mx-auto leading-snug drop-shadow-lg">
                  {slides[current].caption}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow buttons */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 border border-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 border border-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Progress dots */}
          <div className="absolute bottom-4 right-5 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-[#22c55e]" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── The Idea ─────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        {/* Background photo */}
        <Image
          src="/main/images/_drafts/academy-img.jpeg"
          alt="Academy background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark green overlay */}
        <div className="absolute inset-0 bg-[#0d3d27]/88" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-16 tracking-tight"
          >
            The Idea
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

            {/* ── Left: Why we are ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300 mb-8">
                Who we are?
              </p>

              <div className="space-y-7">
                {/* Point 1 */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 flex-shrink-0 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-green-300" />
                  </div>
                  <p className="text-white/90 leading-relaxed text-[15px]">
                    The Robin Hood Academy empowers <span className="text-green-300 font-semibold">7,328+ street children</span> with
                    basic primary education. Our Robins conduct regular weekend classes and excursions with a standardized curriculum to introduce and drive the spirit of learning.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 flex-shrink-0 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center">
                    <School className="w-4 h-4 text-green-300" />
                  </div>
                  <p className="text-white/90 leading-relaxed text-[15px]">
                    The purpose of the Academy is to be a <span className="text-green-300 font-semibold">bridge between the street and schools</span> —
                    to give our children the tools and knowledge to go to school.
                  </p>
                </div>
              </div>

              {/* Our Vision */}
              <div className="mt-10">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300 mb-4">
                  Our Vision
                </p>
                <div className="pl-5 border-l-2 border-green-400/50">
                  <p className="text-green-200 italic text-lg leading-snug font-medium">
                    &ldquo;Creating access to education is the purest form of nation building. Every child on the streets of our cities should have the opportunity to access a better life.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Stats ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Stat 1 — full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="sm:col-span-2 bg-white/8 border border-white/15 rounded-2xl px-8 py-7 backdrop-blur-sm"
              >
                <p className="text-5xl font-black text-white mb-1">
                  +<span>7,099</span>
                </p>
                <p className="text-green-300 text-sm font-semibold uppercase tracking-wide">Academy Students</p>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/8 border border-white/15 rounded-2xl px-8 py-7 backdrop-blur-sm"
              >
                <p className="text-5xl font-black text-white mb-1">
                  +<span>203</span>
                </p>
                <p className="text-green-300 text-sm font-semibold uppercase tracking-wide">Cities</p>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/8 border border-white/15 rounded-2xl px-8 py-7 backdrop-blur-sm"
              >
                <p className="text-5xl font-black text-white mb-1">
                  +<span>12,499</span>
                </p>
                <p className="text-green-300 text-sm font-semibold uppercase tracking-wide">
                  Academy Graduates now enrolled in school
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#dcfce7] via-[#f0fdf4] to-[#d1fae5] dark:from-[#0a2614] dark:via-[#0d3320] dark:to-[#0a2614] py-14 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-snug">
            Like the idea?{" "} <br/>
            <span className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] bg-clip-text text-transparent">
              Join the Robin Hood Academy.
            </span>
          </h2>
          <Link
            href="/sites/main/join-us"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] active:bg-[#166534] text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-green-700/25"
          >
            Join Us
          </Link>
        </motion.div>
      </section>

      {/* ── Programme Pillars ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-[#060f09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              The Academy Programme
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl p-6 hover:border-[#22c55e]/40 hover:shadow-xl hover:shadow-green-900/5 transition-all"
              >
                <div className="w-11 h-11 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mb-4">
                  <pillar.icon className="w-5 h-5 text-[#1a6b3c] dark:text-[#4ade80]" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* ── What We've Been Up To ────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#0a1a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
              Our Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              What We&apos;ve Been Up To
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden shadow-xl shadow-green-900/10 border border-gray-100 dark:border-green-900/20"
          >
            <Image
              src="/main/images/_drafts/RHA Map -Academy.jpg"
              alt="RHA Academy city map"
              width={1200}
              height={800}
              className="w-full h-auto"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Our Values ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#0a1a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              What we stand for
            </h2>
          </motion.div>

          {/* Values banner image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden mb-12 shadow-lg"
          >
            <Image
              src="/main/images/_drafts/RHA Academy - Our Values.png"
              alt="RHA Academy Values"
              width={1200}
              height={400}
              className="w-full h-auto"
              sizes="100vw"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 items-start p-5 bg-gray-50 dark:bg-[#0f2818] border border-gray-100 dark:border-green-900/30 rounded-2xl hover:border-[#22c55e]/30 transition-colors"
              >
                <div className="w-9 h-9 flex-shrink-0 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mt-0.5">
                  <v.icon className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    

      {/* ── Get Involved ──────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-[#060f09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
              Get Involved
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Building Robin Hood Academy 101
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1 — Academy Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="relative rounded-2xl overflow-hidden h-64 sm:h-72 group"
            >
              <Image
                src="/main/images/_drafts/academy1.png"
                alt="Academy Checklist"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 gap-1.5">
                <h3 className="text-white font-black text-lg leading-snug">Academy Checklist</h3>
                <p className="text-white/75 text-xs leading-relaxed">
                  Once you complete this checklist, email{" "}
                  <a href="mailto:academy@robinhoodarmy.com" className="underline underline-offset-2 hover:text-green-300 transition-colors">
                    academy@robinhoodarmy.com
                  </a>{" "}
                  to launch your city!
                </p>
                <a
                  href="/documents/academy/Academy City Checklist.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start mt-1 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </a>
              </div>
            </motion.div>

            {/* Card 2 — Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden h-64 sm:h-72 group"
            >
              <Image
                src="/main/images/_drafts/academy2.png"
                alt="Curriculum"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 gap-1.5">
                <h3 className="text-white font-black text-lg leading-snug">Curriculum</h3>
                <p className="text-white/75 text-xs leading-relaxed">
                  Our very own Academy Teacher Guide split across 3 levels — to be taught with endless patience and so much love &#x1F60A;
                </p>
                <a
                  href="https://drive.google.com/drive/folders/10E9hKWx9Ua-LNLKGlffnR_1CYJytdZAv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start mt-1 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </a>
              </div>
            </motion.div>

            {/* Card 3 — #MissionAdmission */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden h-64 sm:h-72 group"
            >
              <Image
                src="/main/images/_drafts/academy3.png"
                alt="#MissionAdmission"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 gap-1.5">
                <h3 className="text-white font-black text-lg leading-snug">#MissionAdmission</h3>
                <p className="text-white/75 text-xs leading-relaxed">
                  Best practices on how to enrol our children in government schools.
                </p>
                <a
                  href="/documents/academy/MissionAdmission.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start mt-1 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Instagram CTA ─────────────────────────────────────────────── */}
      <section className="py-12 bg-white dark:bg-[#0a1a0f] border-t border-gray-100 dark:border-green-900/20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center px-4"
        >
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Follow our story on Instagram
          </p>
          <a
            href="https://www.instagram.com/academy_rha/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @academy_rha
          </a>
        </motion.div>
      </section>

    </main>
  );
}
