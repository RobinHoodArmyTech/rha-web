import Image from "next/image";
import { cn } from "@/lib/utils";

// Deterministic fallback tints (used when a Robin has no photo).
const FALLBACK_COLORS = [
  "bg-emerald-500", "bg-teal-500", "bg-green-600", "bg-sky-500", "bg-indigo-500",
  "bg-violet-500", "bg-fuchsia-500", "bg-rose-500", "bg-amber-500", "bg-orange-500",
];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
}

interface RobinAvatarProps {
  name: string;
  src?: string | null;
  /** Rendered pixel size (square). */
  size?: number;
  className?: string;
}

/**
 * Robin avatar: the photo when present, otherwise an initial on a deterministic
 * colored disc — so a missing S3 image never leaves an empty circle.
 */
export default function RobinAvatar({ name, src, size = 40, className }: RobinAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0",
        !src && colorFor(name),
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" sizes={`${size}px`} />
      ) : (
        <span className="font-bold text-white leading-none" style={{ fontSize: Math.round(size * 0.42) }}>
          {initial}
        </span>
      )}
    </span>
  );
}
