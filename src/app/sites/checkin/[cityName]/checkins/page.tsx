import type { Metadata } from "next";
import {
  getCityCheckinFeed,
  resolveCityName,
  CHECKIN_FEED_DEFAULT_LIMIT,
} from "@/core/services/backend/checkin/cityCheckinService";
import { citySlug } from "@/lib/citySlug";
import CityCheckinsFeed from "@/components/checkin/city/CityCheckinsFeed";

interface CheckinsPageProps {
  params: Promise<{ cityName: string }>;
}

export async function generateMetadata({ params }: CheckinsPageProps): Promise<Metadata> {
  const { cityName } = await params;
  const name = resolveCityName(cityName);
  return {
    title: `Check-Ins in ${name} · RHA Check-In`,
    description: `Browse all recent check-ins from Robins in ${name}.`,
  };
}

export default async function CityCheckinsPage({ params }: CheckinsPageProps) {
  const { cityName } = await params;
  const name = resolveCityName(cityName);
  // First page rendered server-side; the client streams the rest on scroll.
  const first = getCityCheckinFeed(cityName, { limit: CHECKIN_FEED_DEFAULT_LIMIT });

  return (
    <CityCheckinsFeed
      cityName={name}
      citySlug={citySlug(name)}
      initialItems={first.items}
      initialCursor={first.nextCursor}
      total={first.total}
    />
  );
}
