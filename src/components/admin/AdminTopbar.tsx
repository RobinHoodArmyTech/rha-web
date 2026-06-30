"use client";

import React from "react";

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm z-10 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="font-display text-headline-sm font-bold text-on-surface hidden md:block">
          RHA Admin
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <img
            alt="Administrator Profile"
            className="w-8 h-8 rounded-full ml-2 border border-outline-variant cursor-pointer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNZGj2zqJJPL33RgZmb8DudyI5M7OdXxW_NJkf4Itoo48oRNbyVioul4jzaoVuLt4L6D36hDYWu1r3k2Om4pDd2KmhZMYGJ6-Z-ulrCe3bR1clProOIEES71p0gb1uuZK9ybBlIHEnjumh53nXdZ_4mglKxkwGMOQx7REmGxNoPD1Jlcf4XXxLGts5lswEUAkjEa7gLj_n4owobuzfr-hANxyP6yGdVN6xkJ0Cd9iFai88NVh7fx2wCOC5sMKNu3UvhU_YVOQc_ck"
          />
        </div>
      </div>
    </header>
  );
}
