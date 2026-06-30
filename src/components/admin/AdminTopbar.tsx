"use client";

import React from "react";
import UserMenu from "./UserMenu";

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
      <UserMenu />
    </header>
  );
}
