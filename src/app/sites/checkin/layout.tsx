import CheckinAppShell from "@/components/checkin/CheckinAppShell";
import { getRobinSession } from "@/lib/robinAuth";

export default async function CheckinLayout({ children }: { children: React.ReactNode }) {
  const robin = await getRobinSession();
  return <CheckinAppShell robin={robin}>{children}</CheckinAppShell>;
}
