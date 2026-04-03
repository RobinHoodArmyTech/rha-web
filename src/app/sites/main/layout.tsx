import type { Metadata } from "next";
import AppShell from "@/components/main/AppShell";

export const metadata: Metadata = {
  title: "Robin Hood Army – Zero Hunger, One Drive at a Time",
  description:
    "Robin Hood Army connects surplus food from restaurants and hotels to people in need. Join thousands of volunteers making a difference every day.",
  keywords: ["food donation", "volunteers", "hunger", "Robin Hood Army", "food waste"],
  openGraph: {
    title: "Robin Hood Army",
    description: "Zero Hunger, One Drive at a Time.",
    type: "website",
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
