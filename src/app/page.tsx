import { redirect } from "next/navigation";

// Dev fallback: redirect root to the main site.
// In production, middleware handles domain-based routing before this runs.
export default function RootPage() {
  redirect("/sites/main");
}
