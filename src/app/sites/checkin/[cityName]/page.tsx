import type { Metadata } from "next";
import CityCheckinView from "@/components/checkin/city/CityCheckinView";

interface CityPageProps {
  params: Promise<{ cityName: string }>;
}

/** Turn a route segment ("new-delhi" / "Delhi") into a display name for the tab title. */
function displayName(raw: string): string {
  return decodeURIComponent(raw)
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { cityName } = await params;
  const name = displayName(cityName);
  return {
    title: `${name} · RHA Check-In`,
    description: `Recent check-ins and the most active Robins in ${name}.`,
  };
}

export default async function CityCheckinPage({ params }: CityPageProps) {
  const { cityName } = await params;
  // Key by segment so navigating between cities remounts with a fresh loading state.
  return <CityCheckinView key={cityName} cityName={cityName} />;
}
