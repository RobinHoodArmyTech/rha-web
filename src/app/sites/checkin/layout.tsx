import CheckinAppShell from "@/domains/checkin/components/CheckinAppShell";

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <CheckinAppShell>{children}</CheckinAppShell>;
}
