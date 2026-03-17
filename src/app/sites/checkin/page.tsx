import HeroSection from "@/domains/checkin/components/sections/HeroSection";
import RecentCheckIns from "@/domains/checkin/components/sections/RecentCheckIns";
import CheckInHighlights from "@/domains/checkin/components/sections/CheckInHighlights";
import ActiveRobins from "@/domains/checkin/components/sections/ActiveRobins";

export default function CheckinHomePage() {
  return (
    <main>
      <HeroSection />
      <RecentCheckIns />
      <CheckInHighlights />
      <ActiveRobins />
    </main>
  );
}
