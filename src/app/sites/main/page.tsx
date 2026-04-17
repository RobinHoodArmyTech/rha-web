'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Target, Utensils, BookOpen, Instagram } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Counter component for animated numbers
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    // Handle special case for "2L+"
    if (suffix === 'L+') {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setDisplayValue(`2L+`)
          clearInterval(timer)
        } else {
          const thousands = Math.floor(start / 1000)
          if (thousands >= 100) {
            setDisplayValue(`${Math.floor(thousands / 100)}L+`)
          } else if (thousands > 0) {
            setDisplayValue(`${thousands}K+`)
          } else {
            setDisplayValue(`${Math.floor(start)}+`)
          }
        }
      }, 16)

      return () => clearInterval(timer)
    }
    
    // Default number handling for Cr+ and regular numbers
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, suffix])

  if (suffix === 'L+') {
    return <span>{displayValue}</span>
  }

  if (suffix === 'Cr+') {
    return <span>{count}{suffix}</span>
  }

  return <span>{count.toLocaleString()}{suffix}</span>
}

// Data
const heroSlides = [
  { image: '/main/images/hero/1-global-hunger-crisis-relief-1920x1080.jpg', text: 'Hunger is a crisis that has almost a billion people in its grip' },
  { image: '/main/images/hero/2-restaurant-food-waste-reduction-1920x1080.jpg', text: 'Every day, restaurants discard tons of food while millions go hungry' },
  { image: '/main/images/hero/3-community-food-drive-volunteers-1920x1080.jpg', text: 'Together, we can solve hunger — one drive at a time' },
]

const problems = [
  { 
    image: '/main/images/sections/problem/01-hunger-deaths-statistics-200x200.jpg', 
    text: 'Hunger kills more people each year than AIDS, malaria and terrorism combined',
    isGreenDesktop: true,
    isGreenMobile: true,
    alt: 'Global hunger statistics' 
  },
  { 
    image: '/main/images/sections/problem/02-child-hunger-death-200x200.jpg', 
    text: 'Every 10 seconds, a child dies from hunger', 
    isGreenDesktop: false,
    isGreenMobile: false,
    alt: 'Child hunger crisis' 
  },
  { 
    image: '/main/images/sections/problem/03-food-surplus-countries-200x200.jpg', 
    text: '82% of hungry people live in countries with food surpluses, not food shortages',
    isGreenDesktop: true,
    isGreenMobile: false,
    alt: 'Food surplus statistics' 
  },
  { 
    image: '/main/images/sections/problem/04-night-hunger-200x200.jpg', 
    text: 'One in every eight people sleeps hungry each night',
    isGreenDesktop: false,
    isGreenMobile: true,
    alt: 'Night hunger statistics' 
  },
  { 
    image: '/main/images/sections/problem/05-food-waste-global-200x200.jpg', 
    text: 'One-third of the food produced around the world is never consumed',
    isGreenDesktop: true,
    isGreenMobile: true,
    alt: 'Global food waste' 
  },
  { 
    image: '/main/images/sections/problem/06-global-hunger-statistics-200x200.jpg', 
    text: '850 million hungry people in the world',
    isGreenDesktop: false,
    isGreenMobile: false,
    alt: 'Global hunger statistics' 
  },
]

const countries = ['Bahrain', 'Bangladesh', 'Botswana', 'Guinea', 'India', 'Indonesia', 'Malaysia', 'Nepal', 'Nigeria', 'Pakistan', 'Sri Lanka', 'Uganda', 'Zambia']

const countryInstagram = [
  { name: "India", flag: "/main/images/flags/india.svg", instagram: "https://www.instagram.com/rha_india" },
  { name: "Bangladesh", flag: "/main/images/flags/bangladesh.svg", instagram: "https://www.instagram.com/rha_bangladesh" },
  { name: "Botswana", flag: "/main/images/flags/botswana.svg", instagram: "https://www.instagram.com/rha__botswana" },
  { name: "Uganda", flag: "/main/images/flags/uganda.svg", instagram: "https://www.instagram.com/rha_uganda" },
  { name: "Bahrain", flag: "/main/images/flags/bahrain.svg", instagram: "https://www.instagram.com/rha_bahrain" },
  { name: "Nigeria", flag: "/main/images/flags/nigeria.svg", instagram: "https://www.instagram.com/rha__nigeria" },
  { name: "Sri Lanka", flag: "/main/images/flags/srilanka.svg", instagram: "https://www.instagram.com/rha_srilanka" },
  { name: "Nepal", flag: "/main/images/flags/nepal.svg", instagram: "https://www.instagram.com/rha_nepal" },
  { name: "Malaysia", flag: "/main/images/flags/malaysia.svg", instagram: "https://www.instagram.com/rha_malaysia" },
  { name: "Pakistan", flag: "/main/images/flags/pakistan.svg", instagram: "https://www.instagram.com/reliefandhopeforall/p/DBJp1_0voXU/" },
  { name: "Indonesia", flag: "/main/images/flags/indonesia.svg", instagram: "https://www.instagram.com/rha_indonesia" },
  { name: "Zambia", flag: "/main/images/flags/zambia.svg", instagram: "https://www.instagram.com/rha_zambia" },
  { name: "Guinea", flag: "/main/images/flags/guinea.svg", instagram: "https://www.instagram.com/rha_guinea" },
]

const journeyPhases = [
  { era: 'Early years:', years: '2014–16', image: '/main/images/sections/journey/early-years-robin-hood-army-200x200.jpg', stats: ['6,375 Robins', '32 Cities Launched', '2M Meals Served'], body: "Modeled on Portugal's Re-Food Program, the Robin Hood Army started in Delhi in Aug '14 under a flyover in Hauz Khas. Through social media, passionate new recruits joined every week.", alt: 'Robin Hood Army early years' },
  { era: 'Finding firm ground:', years: '2017–19', image: '/main/images/sections/journey/mission-million-food-drive-200x200.jpg', stats: ['24,677 Robins', '159 Cities Launched', '28M Meals Served'], body: 'Undertook our most ambitious project — #Mission1Million, mobilizing media houses, corporates and artists to serve 1.32 million meals to the underserved on 15th August.', alt: 'Mission 1 Million' },
  { era: 'Scaling and sustaining:', years: '2020–24', image: '/main/images/sections/journey/covid-mission-volunteers-200x200.jpg', stats: ['266,900 Robins', '406 Cities Launched', '158M Meals Served'], body: 'Helped communities battle COVID thru #Mission30, serving 23.2 million meals over 6 weeks across 8 countries. Launched #MissionSwades to amplify our impact.', alt: 'COVID relief mission' },
]

const helpOptions = [
  { Icon: Heart, title: 'Volunteer Time', body: 'All we need is 3 hours/week at least twice a month to make a real impact. If we have a team in your city looking to grow, a Robin will reach out to you.' },
  { Icon: Utensils, title: 'Contribute Food', body: "If you manage a restaurant or generally want to contribute regular meals from your family or workplace, let's connect." },
  { Icon: BookOpen, title: 'Teach', body: 'Creating access to education is the purest form of nation building – do you want to teach our kids in the Robin Hood Academy?' },
]

const cultureGrid = [
  { text: '1% done', bg: 'bg-[#0d3d27]' },
  { text: 'zero funds', bg: 'bg-[#2d6a4f]' },
  { text: 'think less,\ndo more', bg: 'bg-[#74b89a]' },
  { text: 'decentralize', bg: 'bg-[#1a4d2e]' },
  { text: 'ownership', bg: 'bg-[#0d3d27]' },
  { text: '#oneteam', bg: 'bg-[#74b89a]' },
  { text: 'apolitical', bg: 'bg-[#0d3d27]' },
  { text: 'all religions', bg: 'bg-[#2d6a4f]' },
  { text: 'lead on\nthe field', bg: 'bg-[#0d3d27]' },
  { text: 'empathy', bg: 'bg-[#74b89a]' },
]

const press = [
  { name: 'Harvard\nBusiness School', cls: 'font-serif font-bold text-gray-800 dark:text-gray-200 text-xs text-center leading-snug' },
  { name: 'live mint', cls: 'font-bold text-orange-500 text-2xl italic' },
  { name: 'NDTV', cls: 'font-black text-gray-900 dark:text-white text-3xl tracking-tight' },
  { name: 'THE HISTORY\nCHANNEL', cls: 'font-black text-[#9b111e] text-[10px] tracking-widest text-center leading-snug' },
  { name: 'THE HUFFINGTON\nPOST', cls: 'font-serif text-gray-700 dark:text-gray-300 text-xs tracking-widest text-center leading-snug' },
  { name: 'The Telegraph', cls: 'font-serif italic text-gray-800 dark:text-gray-200 text-xl' },
  { name: 'Al Jazeera', cls: 'font-bold text-[#c9a227] text-xl' },
  { name: 'BBC', cls: 'font-black text-white bg-[#bb1919] px-3 py-1 text-2xl rounded' },
  { name: 'DAWN', cls: 'font-black text-gray-900 dark:text-white text-2xl tracking-widest' },
  { name: 'BuzzFeed', cls: 'font-black text-[#ee3322] text-2xl' },
  { name: 'The Tribune', cls: 'font-serif text-gray-700 dark:text-gray-300 text-lg' },
  { name: 'the guardian', cls: 'font-bold text-[#005689] dark:text-[#4cb3d4] text-lg' },
]

export default function MainHomePage() {
  const [slide, setSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [presenceVisible, setPresenceVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [])

  if (!mounted) return null

  const ideaStats = [
    { value: '6Cr+', label: 'Meals Served', target: 6, suffix: 'Cr+' },
    { value: '230+', label: 'Cities', target: 230, suffix: '+' },
    { value: '2L+', label: 'Robins Enlisted', target: 200000, suffix: 'L+' },
    { value: '1%', label: 'Done', target: 1, suffix: '%' },
  ]

  const presenceStats = [
    { value: '13', label: 'Countries', target: 13, suffix: '' },
    { value: '230+', label: 'Cities Active', target: 230, suffix: '+' },
    { value: '2L+', label: 'Volunteers', target: 200000, suffix: 'L+' },
    { value: '6Cr+', label: 'Meals Served', target: 6, suffix: 'Cr+' },
  ]

  return (
    <main>
      {/* Hero - Brighter Carousel */}
      <section className="relative h-screen w-full overflow-hidden" suppressHydrationWarning>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0">
            <Image src={heroSlides[slide].image} alt={heroSlides[slide].text} fill priority className="object-cover object-top brightness-110" sizes="100vw" suppressHydrationWarning />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.h1 key={slide} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.7 }} className="text-2xl sm:text-4xl lg:text-5xl font-light text-white max-w-3xl leading-relaxed">
              {heroSlides[slide].text}
            </motion.h1>
          </AnimatePresence>
          <div className="absolute bottom-10 flex gap-3">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === slide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white dark:bg-[#0a1a0f]" suppressHydrationWarning>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-4">The Problem</h2>
            <p className="text-[#1a6b3c] dark:text-[#4ade80] text-base max-w-2xl mx-auto leading-relaxed">The challenge is not a lack of food — it is making food consistently available to everyone who needs it.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12">
            {problems.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-5">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-green-900/30 flex-shrink-0">
                  <Image src={p.image} alt={p.alt} width={144} height={144} className="object-cover w-full h-full" loading="lazy" suppressHydrationWarning />
                </div>
                <p className="text-sm leading-relaxed">
                  {/* Desktop & Tablet View (md and above) */}
                  <span className="hidden md:inline">
                    {p.isGreenDesktop ? (
                      <span className="text-[#1a6b3c] dark:text-[#4ade80] font-medium">{p.text}</span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{p.text}</span>
                    )}
                  </span>
                  {/* Mobile View (below md) */}
                  <span className="inline md:hidden">
                    {p.isGreenMobile ? (
                      <span className="text-[#1a6b3c] dark:text-[#4ade80] font-medium">{p.text}</span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{p.text}</span>
                    )}
                  </span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Idea */}
      <section className="relative py-16 md:py-24" suppressHydrationWarning>
        <Image src="/main/images/sections/idea/volunteers-distributing-food-1920x900.jpg" alt="Robin Hood Army volunteers distributing food" fill className="object-cover" sizes="100vw" suppressHydrationWarning />
        <div className="absolute inset-0 bg-[#1a6b3c]/88" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            onViewportEnter={() => setStatsVisible(true)}
            className="text-3xl sm:text-4xl font-light text-white mb-14 text-center"
          >
            The Idea
          </motion.h2>
          
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {[
              { Icon: Target, heading: 'Who we are?', paras: ['The Robin Hood Army is a volunteer based, zero-funds organization that works to get surplus food from restaurants and the community to serve less fortunate people.', 'Our local chapters are run by friends and colleagues. Our "Robins" are largely students and young working professionals — everyone does this in their free time. The lesser fortunate sections we serve include homeless families, orphanages, patients from public hospitals, and old age homes.'] },
              { Icon: Heart, heading: 'Our vision', paras: ['Really simple — beat global hunger and bring out the best in people around the world. A world where no one sleeps hungry.', 'The idea is to create self-sustained chapters across the world who will look after their local community. And in the process, inspire people around us to give back to those who need it most.'] },
            ].map(({ Icon, heading, paras }) => (
              <div key={heading} className="flex gap-5">
                <div className="w-11 h-11 rounded-full border border-white/50 flex items-center justify-center flex-shrink-0 mt-0.5"><Icon className="w-5 h-5 text-white" /></div>
                <div><h3 className="text-[#4ade80] font-semibold text-base mb-3">{heading}</h3>{paras.map((para, j) => <p key={j} className="text-white/85 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>)}</div>
              </div>
            ))}
          </motion.div>

          {/* Stats with animated counters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }} 
            className="border-t border-white/20 pt-12"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {ideaStats.map(({ label, target, suffix }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center px-2 sm:px-4 py-4">
                  <span className="text-[10px] sm:text-[10px] font-bold text-[#4ade80] uppercase tracking-[0.2em] mb-2 sm:mb-3 whitespace-nowrap">{label}</span>
                  <span className="text-3xl sm:text-5xl md:text-6xl font-extralight text-white leading-none tracking-tight">
                    {statsVisible ? <AnimatedCounter target={target} suffix={suffix} /> : `0${suffix === 'L+' ? 'L+' : suffix}`}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We've Been Up To */}
      <section className="py-20 bg-white dark:bg-[#0a1a0f]" suppressHydrationWarning>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            onViewportEnter={() => setPresenceVisible(true)}
            className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white text-center mb-12"
          >
            What We&apos;ve Been Up To
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#1a4d2e] to-[#0d3d27] rounded-2xl overflow-hidden shadow-xl border border-green-700/30">
            <div className="text-center py-6 px-4 border-b border-green-700/30">
              <p className="text-[10px] font-bold text-[#4ade80] uppercase tracking-[0.3em] mb-2">Global Presence</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-white"><span className="text-[#4ade80]">{countries.length} Countries</span> • One Mission</h3>
              <p className="text-green-300/70 text-sm mt-1 max-w-md mx-auto">Citizens First → Mission Next → Robins Last</p>
            </div>
            <div className="px-4 sm:px-6 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {countryInstagram.map((country) => (
                  <a key={country.name} href={country.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group border border-green-700/30 hover:border-green-500/50">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0"><Image src={country.flag} alt={`${country.name} flag`} fill className="object-cover" /></div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{country.name}</span>
                    <Instagram className="w-3 h-3 text-gray-500 group-hover:text-[#E4405F] ml-auto transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 bg-black/30">
              {presenceStats.map(({ label, target, suffix }, i) => (
                <div key={label} className={`text-center py-4 px-2 ${i < presenceStats.length - 1 ? 'border-r border-green-700/30' : ''}`}>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#4ade80] whitespace-nowrap">
                    {presenceVisible ? <AnimatedCounter target={target} suffix={suffix} /> : `0${suffix === 'L+' ? 'L+' : suffix}`}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-medium text-green-300/60 uppercase tracking-wider mt-1 whitespace-nowrap">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-gray-50 dark:bg-[#060f09]" suppressHydrationWarning>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-6">Our Journey</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-3xl mx-auto mb-3 leading-relaxed">On the army&apos;s first night of distribution, we realized that helping the less fortunate may feel good personally, but feeding 50 odd people at night, once a week would not create any real difference in a country where millions are starving.</p>
            <p className="text-[#1a6b3c] dark:text-[#4ade80] text-sm font-medium max-w-3xl mx-auto">Hunger is an acute problem. We needed to reach out to more people, more restaurants, and more cities — our deadline being yesterday.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {journeyPhases.map((phase, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white dark:bg-[#0f2818] rounded-2xl border border-gray-100 dark:border-green-900/30 p-6 flex flex-col items-center text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{phase.era}</p>
                <p className="text-gray-900 dark:text-white font-black text-xl mb-6">{phase.years}</p>
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#1a6b3c]/20 mb-6"><Image src={phase.image} alt={phase.alt} width={128} height={128} className="object-cover w-full h-full" loading="lazy" suppressHydrationWarning /></div>
                <div className="space-y-1 mb-5">{phase.stats.map(s => <p key={s} className="text-sm font-bold text-gray-800 dark:text-gray-200">{s}</p>)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{phase.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How You Can Help */}
      <section className="py-20 bg-[#eef2ee] dark:bg-[#0a1a0f]" suppressHydrationWarning>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 px-8 sm:px-14 py-12">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white text-center mb-10">How You Can Help</h2>
            <div className="divide-y divide-gray-100 dark:divide-green-900/20">
              {helpOptions.map(({ Icon, title, body }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="py-7 flex flex-col items-center text-center gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" /><span className="text-gray-900 dark:text-white font-bold text-base">{title}</span></div>
                  <p className="text-sm text-[#1a6b3c] dark:text-[#4ade80] leading-relaxed max-w-sm">{body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/sites/main/join-us" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a4d2e] hover:bg-[#1a6b3c] text-white font-semibold rounded-full transition-all text-sm shadow-md"><Heart className="w-4 h-4 fill-current" /> Join our Robin family</Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-20 bg-white dark:bg-[#0a1a0f]" suppressHydrationWarning>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-3">Our Culture</h2>
            <p className="text-sm text-[#1a6b3c] dark:text-[#4ade80] font-medium tracking-wide">Citizens First → Mission Next → Robins Last</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="grid grid-cols-5 rounded-2xl overflow-hidden shadow-xl">
            {cultureGrid.map(({ text, bg }, i) => (
              <div key={i} className={`${bg} flex items-center justify-center p-4 sm:p-6 min-h-[80px] sm:min-h-[120px]`}>
                <span className="text-white text-[10px] sm:text-sm font-bold text-center leading-snug whitespace-pre-line">{text}</span>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-6 bg-[#e8573a] rounded-2xl px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white text-lg font-light">Any concerns about this?</p>
            <a
              href="https://api.whatsapp.com/send/?phone=918971966164&lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border-2 border-white text-white text-sm font-semibold rounded-full hover:bg-white hover:text-[#e8573a] transition-all"
            >Talk to Us</a>          
          </motion.div>
        </div>
      </section>

      {/* In Other News */}
      <section className="py-20 bg-gray-50 dark:bg-[#060f09]" suppressHydrationWarning>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white text-center mb-14">In Other News</motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            {press.map(({ name, cls }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center justify-center min-h-[60px]">
                <span className={`${cls} whitespace-pre-line`}>{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky WhatsApp */}
      <a href="https://api.whatsapp.com/send/?phone=918971966164&lang=en" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white dark:bg-[#0f2818] border border-gray-200 dark:border-green-900/40 text-gray-800 dark:text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-[#1a4d2e] transition-all">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25d366]" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        Join us
      </a>
    </main>
  )
}