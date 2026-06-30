"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { api } from "@/lib/http";

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      const redirect = searchParams.get("redirect") ?? "/sites/admin";
      router.push(redirect.startsWith("/sites/admin") ? redirect : "/sites/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-green-900/20 dark:border-green-800/30 dark:bg-[#0f2818]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#155e3a] to-[#0d3d27] px-6 pt-8 pb-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-white">Robin Hood Army</p>
            <p className="text-xs text-green-100">Admin Console</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a6b3c] to-[#166534] py-3 font-semibold text-white shadow-md transition-all hover:from-[#22c55e] hover:to-[#16a34a] disabled:opacity-60"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign In
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#0a1a0f]">
      <Suspense>
        <LoginCard />
      </Suspense>
    </div>
  );
}
