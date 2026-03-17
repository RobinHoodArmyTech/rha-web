"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./auth/AuthModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onJoinUsClick={() => setAuthOpen(true)} />
      {children}
      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
