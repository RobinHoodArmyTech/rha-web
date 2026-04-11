"use client";

import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
