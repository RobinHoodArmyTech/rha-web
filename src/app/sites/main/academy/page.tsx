"use client";

import { motion } from "framer-motion";
import { BookOpen, Play, Award, Users, Clock, Star, ChevronRight, Lock, CheckCircle } from "lucide-react";
import Image from "next/image";

const courses = [
  { id: 1, title: "Robin Fundamentals", description: "Learn the core principles of RHA drives, food safety, and volunteer best practices.", duration: "45 min", lessons: 6, level: "Beginner", badge: "Cadet", imageUrl: "https://picsum.photos/seed/course1/400/250", free: true, rating: 4.9, students: 12400 },
  { id: 2, title: "Drive Leadership 101", description: "Step up as a drive leader. Master coordination, team management, and community outreach.", duration: "1.5 hrs", lessons: 10, level: "Intermediate", badge: "Ninja", imageUrl: "https://picsum.photos/seed/course2/400/250", free: false, rating: 4.8, students: 5600 },
  { id: 3, title: "City Chapter Building", description: "Start and grow a Robin Hood Army chapter in your city. Recruit, train, and inspire volunteers.", duration: "2 hrs", lessons: 12, level: "Advanced", badge: "Gladiator", imageUrl: "https://picsum.photos/seed/course3/400/250", free: false, rating: 4.9, students: 2800 },
  { id: 4, title: "Food Safety & Hygiene", description: "Essential training on safe food handling, storage, and distribution practices.", duration: "30 min", lessons: 5, level: "Beginner", badge: "Cadet", imageUrl: "https://picsum.photos/seed/course4/400/250", free: true, rating: 4.7, students: 9800 },
  { id: 5, title: "Community Impact Stories", description: "Real stories from Centurions who have transformed communities through consistent service.", duration: "1 hr", lessons: 8, level: "All Levels", badge: "Centurion", imageUrl: "https://picsum.photos/seed/course5/400/250", free: false, rating: 5.0, students: 3200 },
  { id: 6, title: "Media & Storytelling", description: "Document and share your drives effectively on social media to inspire more volunteers.", duration: "1 hr", lessons: 7, level: "Intermediate", badge: "Ninja", imageUrl: "https://picsum.photos/seed/course6/400/250", free: false, rating: 4.6, students: 4100 },
];

const levelColors: Record<string, string> = {
  "Beginner": "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  "Intermediate": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
  "Advanced": "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400",
  "All Levels": "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400",
};

export default function AcademyPage() {
  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-[#155e3a] via-[#1a6b3c] to-[#0d3d27] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-widest mb-6">
              <BookOpen className="w-3.5 h-3.5" /> RHA Academy
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Level up your{" "}
              <span className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">Robin skills</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">Free and premium courses designed to make you a better volunteer, leader, and changemaker.</p>
            <div className="flex flex-wrap justify-center gap-8">
              {[{ value: "20+", label: "Courses" }, { value: "50K+", label: "Learners" }, { value: "Free", label: "Starter Courses" }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-green-300 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-[#060f09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a]">All Courses</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">Start learning today</h2>
            </div>
            <div className="flex gap-2">
              {["All", "Free", "Beginner", "Advanced"].map((filter) => (
                <button key={filter} className="px-4 py-1.5 text-xs font-semibold rounded-full border border-gray-200 dark:border-green-800/40 text-gray-600 dark:text-gray-400 hover:border-[#22c55e] hover:text-[#1a6b3c] dark:hover:text-[#4ade80] transition-all first:bg-[#1a6b3c] first:text-white first:border-[#1a6b3c]">
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} className="bg-white dark:bg-[#0f2818] rounded-2xl border border-gray-100 dark:border-green-900/30 overflow-hidden hover:border-[#22c55e]/40 hover:shadow-xl hover:shadow-green-500/5 transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <Image src={course.imageUrl} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-[#1a6b3c] fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.free ? (
                      <span className="px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full">FREE</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-black/50 text-white text-[10px] font-bold rounded-full flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Premium</span>
                    )}
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${levelColors[course.level]}`}>{course.level}</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 bg-[#1a6b3c] text-green-200 text-[10px] font-bold rounded-full flex items-center gap-1"><Award className="w-2.5 h-2.5" /> {course.badge} Badge</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5 group-hover:text-[#1a6b3c] dark:group-hover:text-[#4ade80] transition-colors">{course.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {(course.students / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className={`w-3.5 h-3.5 ${idx < Math.floor(course.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{course.rating}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] text-white text-xs font-semibold rounded-lg transition-all">
                      {course.free ? <><CheckCircle className="w-3.5 h-3.5" /> Start Free</> : <><ChevronRight className="w-3.5 h-3.5" /> Enroll</>}
                    </motion.button>
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
