import CheckinAppShell from "@/components/checkin/CheckinAppShell";

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <CheckinAppShell>{children}</CheckinAppShell>;
}
