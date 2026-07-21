import { LogIn } from "lucide-react";
import { getRobinSession } from "@/lib/robinAuth";

/**
 * Robin-only gate for the check-in form. Logged-out visitors see a "Continue
 * with Google" prompt instead of the form (the form + its APIs require a Robin
 * session). Signed-in Robins fall through to the form (submit/page.tsx).
 */
export default async function SubmitLayout({ children }: { children: React.ReactNode }) {
  const robin = await getRobinSession();
  if (robin) return <>{children}</>;

  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 p-10 max-w-md w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-8 h-8 text-[#1a6b3c] dark:text-[#4ade80]" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Sign in to check in</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Log your drive as a Robin. Sign in with Google to record how many you served.
        </p>
        <a
          href="/api/v1/auth/google"
          className="inline-flex items-center justify-center gap-3 w-full py-3.5 bg-white dark:bg-[#0a1a0f] border border-gray-200 dark:border-green-900/40 hover:border-[#22c55e] rounded-xl font-semibold text-gray-700 dark:text-white transition-all"
        >
          <GoogleGlyph />
          Continue with Google
        </a>
      </div>
    </main>
  );
}

function GoogleGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.86 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.68-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.68 2.84C6.72 7.29 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
