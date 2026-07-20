"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/http";
import { citySlug } from "@/lib/citySlug";
import type { CityCheckinPage } from "@/core/services/backend/checkin/cityCheckinService";
import CityHero from "./CityHero";
import CityRecentCheckIns from "./CityRecentCheckIns";
import CityActiveRobins from "./CityActiveRobins";

interface CityCheckinViewProps {
  /** Raw (possibly URL-encoded) city name from the route segment. */
  cityName: string;
}

type Status = "loading" | "ready" | "error";

export default function CityCheckinView({ cityName }: CityCheckinViewProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<CityCheckinPage | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get<{ data: CityCheckinPage }>(`/checkin/city/${encodeURIComponent(cityName)}`)
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [cityName]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a1a0f]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin text-[#16a34a]" />
          <p className="text-sm font-medium">Loading check-ins…</p>
        </div>
      </main>
    );
  }

  if (status === "error" || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a1a0f] px-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Couldn&apos;t load this city
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Something went wrong fetching check-ins. Please try again.
          </p>
          <Link
            href="/sites/checkin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a6b3c] hover:bg-[#155e3a] text-white text-sm font-semibold transition-colors"
          >
            Back to all cities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white dark:bg-[#0a1a0f]">
      <CityHero
        cityName={data.cityName}
        countryName={data.countryName}
        uniqueRobins={data.uniqueRobins}
        totalCheckins={data.totalCheckins}
        windowDays={data.windowDays}
      />
      <CityRecentCheckIns
        cityName={data.cityName}
        citySlug={citySlug(data.cityName)}
        checkins={data.recentCheckins}
      />
      <CityActiveRobins robins={data.activeRobins} citySlug={citySlug(data.cityName)} />
    </main>
  );
}
