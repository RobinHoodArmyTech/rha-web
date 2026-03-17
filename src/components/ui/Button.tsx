"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "pill";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] text-white shadow-md hover:shadow-green-400/30",
      secondary:
        "bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-md",
      outline:
        "border-2 border-[#1a6b3c] text-[#1a6b3c] dark:text-[#4ade80] dark:border-[#4ade80] hover:bg-[#1a6b3c] hover:text-white dark:hover:bg-[#4ade80] dark:hover:text-black",
      ghost:
        "text-[#1a6b3c] dark:text-[#4ade80] hover:bg-green-50 dark:hover:bg-green-900/20",
      pill:
        "bg-[#4ade80] hover:bg-[#22c55e] text-[#0a1a0f] font-bold shadow-lg hover:shadow-green-400/40 rounded-full",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-lg",
      md: "text-sm px-5 py-2.5 rounded-xl",
      lg: "text-base px-8 py-3.5 rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={cn(base, variants[variant], sizes[size], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
