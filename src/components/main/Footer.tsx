"use client";

import { motion } from "framer-motion";
import { Twitter, Instagram, Facebook, Youtube, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/sites/main" },
    { label: "About Us", href: "/sites/main/about" },
    { label: "Check-In", href: "/sites/main" },
    { label: "Academy", href: "/sites/main/academy" },
    { label: "Volunteer", href: "/sites/main/join-us" },
    { label: "Contact Us", href: "https://api.whatsapp.com/send/?phone=918971966164&l=en"},
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/rha_india/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/robinhoodarmy", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@robinhoodarmy.", label: "YouTube" },
  { icon: Twitter, href: "https://x.com/rha_india", label: "Twitter" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1a0f] text-white pt-12 sm:pt-16 pb-6 sm:pb-8" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-8 md:pb-12 border-b border-green-900/40">
          
          {/* Brand Section with Schema Markup */}
          <div className="col-span-1 md:col-span-2 lg:col-span-7 text-center md:text-left" itemScope itemType="https://schema.org/Organization">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src="/main/images/icons/RHA_Icon.png"
                  alt="Robin Hood Army Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#4ade80]" itemProp="name">Robin Hood Army</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0" itemProp="description">
              Connecting surplus food from restaurants and hotels with people who need it most.
              Every meal counts. Every Robin matters.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`Follow us on ${label}`}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-green-900/40 hover:bg-[#1a6b3c] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5">
            <h4 className="text-sm font-semibold text-[#4ade80] uppercase tracking-wider mb-4 text-center md:text-left">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 sm:gap-4">
              {footerLinks["Quick Links"].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 text-center md:text-left"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Centered SEO-friendly */}
        <div className="pt-6 md:pt-8 flex flex-col items-center justify-center gap-3">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" aria-hidden="true" /> for zero hunger
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <p className="text-xs text-gray-500">
              © {currentYear} Robin Hood Army. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}