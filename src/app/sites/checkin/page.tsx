import HeroSection from "@/components/checkin/sections/HeroSection";
import RecentCheckIns from "@/components/checkin/sections/RecentCheckIns";
import CheckInHighlights from "@/components/checkin/sections/CheckInHighlights";
import ActiveRobins from "@/components/checkin/sections/ActiveRobins";

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
