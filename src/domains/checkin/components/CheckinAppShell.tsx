"use client";

import { useState } from "react";
import CheckinNavbar from "./CheckinNavbar";
import AuthModal from "@/domains/main/components/auth/AuthModal";

export default function CheckinAppShell({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <CheckinNavbar onLoginClick={() => setAuthOpen(true)} />
      {children}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
