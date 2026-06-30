"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <main className="w-full h-screen flex flex-col md:flex-row bg-background font-body-md text-on-surface">
      {/* Left Side: Branding & Illustration */}
      <section className="hidden md:flex md:w-1/2 md:shrink-0 bg-surface-container-lowest relative overflow-hidden flex-col justify-between p-12 border-r border-outline-variant">
        {/* Branding Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/shared/images/icons/robin-hood-army-logo.png"
              alt="Robin Hood Army Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="font-display text-display text-primary whitespace-nowrap">Robin Hood Army</h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Global Operations</p>
        </div>

        {/* Illustration Area */}
        <div className="relative z-10 w-full h-full my-6 rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.02),_0px_4px_8px_rgba(0,0,0,0.04)] border border-outline-variant">
          <img
            alt="Volunteers organizing food drives"
            className="w-full h-full object-cover"
            src="/main/images/_drafts/join-now_team.png"
          />
        </div>

        {/* Quote / Footer */}
        <div className="relative z-10">
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            &quot;Serving surplus food to less fortunate people across the globe.&quot;
          </p>
        </div>

        {/* Background Decorative Element (Subtle) */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-container opacity-20 rounded-full blur-3xl"></div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full md:w-1/2 md:shrink-0 flex items-center justify-center p-6 md:p-12 bg-background relative">
        {/* Form Container (Card) */}
        <div className="w-[90vw] sm:w-[440px] max-w-full bg-surface-container-lowest rounded-[1.5rem] p-6 md:p-[32px] shadow-[0px_1px_3px_rgba(0,0,0,0.02),_0px_4px_8px_rgba(0,0,0,0.04)] border border-outline-variant">
          {/* Mobile Branding */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            <img
              src="/shared/images/icons/robin-hood-army-logo.png"
              alt="Robin Hood Army Logo"
              className="h-8 w-8 object-contain"
            />
            <h1 className="font-headline-md text-headline-md text-primary whitespace-nowrap">Robin Hood Army</h1>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="font-display text-headline-lg text-on-surface mb-1">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Secure Admin Access for Global Operations</p>
          </div>
          <div className="h-px w-full bg-outline-variant mb-6"></div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-md">
            {error && (
              <div className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-sm font-medium text-on-error-container mb-4">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@robinhoodarmy.com"
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder:text-outline"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <a href="#" className="font-label-sm text-label-sm text-primary hover:text-surface-tint transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface-container-lowest"
              />
              <label htmlFor="remember-me" className="ml-2 block font-body-md text-body-md text-on-surface-variant">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-on-primary bg-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-label-md text-label-md transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>


      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense>
        <LoginCard />
      </Suspense>
    </div>
  );
}
