"use client";

import { motion } from "framer-motion";
import { Target, Twitter, Instagram, Facebook, Youtube, Heart } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/sites/main" },
    { label: "About Us", href: "/sites/main/about" },
    { label: "Check-In", href: "/sites/checkin" },
    { label: "Academy", href: "/sites/main/academy" },
  ],
  "Get Involved": [
    { label: "Volunteer", href: "#" },
    { label: "Donate Food", href: "#" },
    { label: "Partner With Us", href: "#" },
    { label: "Corporate CSR", href: "#" },
  ],
  "Resources": [
    { label: "Blog", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Impact Report", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1a0f] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-green-900/40">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1a6b3c] to-[#22c55e] rounded-lg flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg text-[#4ade80]">Robin Hood</span>
                <span className="text-xs font-semibold text-gray-400 -mt-0.5">ARMY</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting surplus food from restaurants and hotels with people who need it most.
              Every meal counts. Every Robin matters.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-green-900/40 hover:bg-[#1a6b3c] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-[#4ade80] uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Robin Hood Army. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for zero hunger
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
