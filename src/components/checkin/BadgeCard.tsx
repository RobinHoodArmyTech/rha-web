"use client";

import { motion } from "framer-motion";
import { Shield, Compass, Medal, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  name: string;
  drives: number | string;
  icon: "medal" | "compass" | "helmet" | "shield";
  description?: string;
  size?: "sm" | "md" | "lg";
  earned?: boolean;
}

const iconMap = {
  medal: Medal,
  compass: Compass,
  helmet: Swords,
  shield: Shield,
};

const colorMap = {
  medal: "from-amber-400 to-yellow-500",
  compass: "from-teal-400 to-cyan-500",
  helmet: "from-orange-400 to-red-500",
  shield: "from-purple-400 to-indigo-500",
};

export default function BadgeCard({
  name,
  drives,
  icon,
  description,
  size = "md",
  earned = false,
}: BadgeCardProps) {
  const Icon = iconMap[icon];
  const gradient = colorMap[icon];

  const sizeClasses = {
    sm: { outer: "w-20 h-20", inner: "w-16 h-16", icon: "w-6 h-6", text: "text-xs" },
    md: { outer: "w-28 h-28", inner: "w-24 h-24", icon: "w-9 h-9", text: "text-sm" },
    lg: { outer: "w-36 h-36", inner: "w-32 h-32", icon: "w-11 h-11", text: "text-base" },
  };

  const s = sizeClasses[size];

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.07, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        {/* Hexagon outer border */}
        <div
          className={cn(
            s.outer,
            "hexagon flex items-center justify-center",
            earned
              ? "bg-gradient-to-br from-teal-400/40 to-green-400/40 border-2 border-teal-400/60"
              : "bg-gradient-to-br from-gray-700/40 to-gray-600/40"
          )}
        >
          <div
            className={cn(
              s.inner,
              "hexagon flex flex-col items-center justify-center gap-1",
              earned
                ? `bg-gradient-to-br ${gradient} shadow-lg`
                : "bg-gray-700/80"
            )}
          >
            <Icon
              className={cn(s.icon, earned ? "text-white" : "text-gray-500")}
              strokeWidth={2}
            />
            <span
              className={cn(
                "font-bold leading-none",
                size === "sm" ? "text-[9px]" : "text-[10px]",
                earned ? "text-white/90" : "text-gray-500"
              )}
            >
              {typeof drives === "number" ? `${drives} Drive${drives > 1 ? "s" : ""}` : drives}
            </span>
          </div>
        </div>
        {earned && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-[#0a1a0f]" />
        )}
      </div>
      <div className="text-center">
        <p className={cn("font-bold uppercase tracking-widest", s.text, earned ? "text-teal-300" : "text-gray-500")}>
          {name}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
