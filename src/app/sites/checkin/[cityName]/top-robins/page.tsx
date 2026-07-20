import type { Metadata } from "next";
import { getCityTopRobins, resolveCityName } from "@/core/services/backend/checkin/cityCheckinService";
import { citySlug } from "@/lib/citySlug";
import CityTopRobins from "@/components/checkin/city/CityTopRobins";

interface TopRobinsPageProps {
  params: Promise<{ cityName: string }>;
}

export async function generateMetadata({ params }: TopRobinsPageProps): Promise<Metadata> {
  const { cityName } = await params;
  const name = resolveCityName(cityName);
  return {
    title: `Top Active Robins in ${name} · RHA Check-In`,
    description: `The most active Robins in ${name}, ranked by drives over the last 60 days.`,
  };
}

export default async function TopRobinsPage({ params }: TopRobinsPageProps) {
  const { cityName } = await params;
  // Bounded leaderboard (top 100) — rendered on the server, no client fetch needed.
  const { cityName: name, windowDays, total, robins } = getCityTopRobins(cityName);

  return (
    <CityTopRobins
      cityName={name}
      citySlug={citySlug(name)}
      windowDays={windowDays}
      total={total}
      robins={robins}
    />
  );
}
