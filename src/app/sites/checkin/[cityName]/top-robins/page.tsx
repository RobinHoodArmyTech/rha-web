import type { Metadata } from "next";
import {
  getCityTopRobins,
  resolveCityName,
  CHECKIN_WINDOW_DAYS,
} from "@/core/services/backend/checkin/cityCheckinService";
import { citySlug } from "@/lib/citySlug";
import CityTopRobins from "@/components/checkin/city/CityTopRobins";

interface TopRobinsPageProps {
  params: Promise<{ cityName: string }>;
}

export async function generateMetadata({ params }: TopRobinsPageProps): Promise<Metadata> {
  const { cityName } = await params;
  const name = await resolveCityName(cityName);
  return {
    title: `Top Active Robins in ${name} · RHA Check-In`,
    description: `The most active Robins in ${name}, ranked by drives over the last ${CHECKIN_WINDOW_DAYS} days.`,
  };
}

export default async function TopRobinsPage({ params }: TopRobinsPageProps) {
  const { cityName } = await params;
  const { cityName: name, windowDays, total, robins } = await getCityTopRobins(cityName);

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
