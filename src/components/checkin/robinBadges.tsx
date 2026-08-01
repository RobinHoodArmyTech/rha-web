"use client";

import { Medal, Compass, Swords, Shield, Trophy, type LucideIcon } from "lucide-react";
import type { RobinBadge } from "@/lib/checkinBadges";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for Robin achievement badges. Milestone badges
 * (cadet → ninja → gladiator → centurion) keep the same identity/colors as the
 * hero badges on /sites/checkin; `most_active` is the leaderboard title, styled
 * distinctly as a circular emblem.
 */
export interface RobinBadgeMeta {
  label: string;
  Icon: LucideIcon;
  /** Emblem fill gradient. */
  gradient: string;
  /** Accent used for the text pill/label. */
  accent: string;
  shape: "hex" | "circle";
}

export const ROBIN_BADGE_CONFIG: Record<RobinBadge, RobinBadgeMeta> = {
  cadet: {
    label: "Cadet",
    Icon: Medal,
    gradient: "from-amber-400 to-yellow-500",
    accent: "text-amber-500 dark:text-amber-400",
    shape: "hex",
  },
  ninja: {
    label: "Ninja",
    Icon: Compass,
    gradient: "from-teal-400 to-cyan-500",
    accent: "text-teal-500 dark:text-teal-400",
    shape: "hex",
  },
  gladiator: {
    label: "Gladiator",
    Icon: Swords,
    gradient: "from-orange-400 to-red-500",
    accent: "text-orange-500 dark:text-orange-400",
    shape: "hex",
  },
  centurion: {
    label: "Centurion",
    Icon: Shield,
    gradient: "from-purple-400 to-indigo-500",
    accent: "text-purple-500 dark:text-purple-400",
    shape: "hex",
  },
  most_active: {
    label: "Most Active",
    Icon: Trophy,
    gradient: "from-sky-400 to-blue-600",
    accent: "text-sky-500 dark:text-sky-400",
    shape: "circle",
  },
};

const SIZE = {
  sm: { box: "w-8 h-8", icon: "w-3.5 h-3.5" },
  md: { box: "w-10 h-10", icon: "w-5 h-5" },
} as const;

interface RobinBadgeMarkProps {
  badge: RobinBadge;
  size?: keyof typeof SIZE;
  className?: string;
}

/**
 * The emblem mark shown over a Robin's avatar. Hexagon for milestone badges,
 * circle for the "Most Active" leaderboard badge — matching the checkin theme.
 */
export function RobinBadgeMark({ badge, size = "md", className }: RobinBadgeMarkProps) {
  const meta = ROBIN_BADGE_CONFIG[badge];
  const s = SIZE[size];
  const Icon = meta.Icon;

  return (
    <div
      className={cn(
        s.box,
        "flex items-center justify-center bg-gradient-to-br shadow-lg ring-2 ring-white dark:ring-[#0a1a0f]",
        meta.gradient,
        meta.shape === "hex" ? "hexagon" : "rounded-full",
        className,
      )}
      title={meta.label}
      aria-label={meta.label}
    >
      <Icon className={cn(s.icon, "text-white")} strokeWidth={2.4} />
    </div>
  );
}
