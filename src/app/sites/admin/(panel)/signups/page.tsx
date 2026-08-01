"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Users, Building2, CalendarRange, ListFilter } from "lucide-react";
import type {
  SignupWithCity,
  SignupStats,
  SignupCityGroup,
} from "@/core/services/backend/signup/signupService";
import type { CityWithCountry } from "@/core/services/backend/city/cityService";
import { ADMIN_ROLES } from "@/core/config/constants";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { api } from "@/lib/http";
import { formatNumber } from "@/lib/format";
import DataTable, { type Column } from "@/components/ui/DataTable";

// Response shape returned by GET /api/v1/admin/signup.
type SignupListResponse = { rows: SignupWithCity[]; total: number; stats: SignupStats };

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

const dateInputClass =
  "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white";
const selectClass =
  "cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white";

// Quick time-range presets. `days`/`months` are subtracted from today; "all"
// clears the range and "custom" reveals the from/to date pickers.
type RangePreset = { value: string; label: string; days?: number; months?: number };
const RANGE_PRESETS: RangePreset[] = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "3m", label: "Last 3 months", months: 3 },
  { value: "6m", label: "Last 6 months", months: 6 },
  { value: "12m", label: "Last 12 months", months: 12 },
  { value: "custom", label: "Custom range" },
];

/** Local YYYY-MM-DD (what the <input type="date"> and API expect). */
function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-green-800/30 dark:bg-[#0f2818]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#155e3a]/10 text-[#1a6b3c] dark:bg-[#4ade80]/10 dark:text-[#4ade80]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default function SignupsPage() {
  const { roleName } = useAdminSession();
  const isAdmin = ADMIN_ROLES.includes(roleName);

  const [rows, setRows] = useState<SignupWithCity[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<SignupStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Server-side pagination + filter state.
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rangePreset, setRangePreset] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cityFilter, setCityFilter] = useState(""); // "" = all cities (admins only)

  // City options for the admin filter — the full list, fetched once.
  const [cityOptions, setCityOptions] = useState<{ id: number; cityName: string }[]>([]);

  // By-city grouping (admin only, paginated client-side). Shares the date range.
  const [cityGroups, setCityGroups] = useState<SignupCityGroup[]>([]);
  const [cityGroupsLoading, setCityGroupsLoading] = useState(true);
  const [cityGroupsError, setCityGroupsError] = useState<string | null>(null);

  // Debounce the free-text search so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Populate the city filter once (admins only — non-admins are scoped to one city).
  useEffect(() => {
    if (!isAdmin) return;
    api
      .get<{ data: CityWithCountry[] }>("/admin/city")
      .then((res) =>
        setCityOptions(
          (res.data ?? [])
            .map((c) => ({ id: c.id, cityName: c.cityName }))
            .sort((a, b) => a.cityName.localeCompare(b.cityName)),
        ),
      )
      .catch((err) => console.error(err));
  }, [isAdmin]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
      if (cityFilter) params.set("cityId", cityFilter);

      const res = await api.get<{ data: SignupListResponse }>(`/admin/signup?${params.toString()}`);
      setRows(res.data.rows);
      setTotal(res.data.total);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
      setLoadError(errorMessage(err, "Failed to load signups."));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, from, to, debouncedSearch, cityFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // By-city grouping — admins only, and only depends on the date range.
  const loadCityGroups = useCallback(async () => {
    if (!isAdmin) return;
    setCityGroupsLoading(true);
    setCityGroupsError(null);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const qs = params.toString();
      const res = await api.get<{ data: SignupCityGroup[] }>(`/admin/signup/by-city${qs ? `?${qs}` : ""}`);
      setCityGroups(res.data ?? []);
    } catch (err) {
      console.error(err);
      setCityGroupsError(errorMessage(err, "Failed to load city summary."));
    } finally {
      setCityGroupsLoading(false);
    }
  }, [isAdmin, from, to]);

  useEffect(() => {
    loadCityGroups();
  }, [loadCityGroups]);

  // Any filter change returns to page 1 (server-side, so we can't paginate stale filters).
  const resetToFirstPage = () => setPage(1);

  // Translate a preset into concrete from/to dates. "custom" keeps whatever the
  // user has already picked and reveals the date inputs; "all" clears the range.
  const applyPreset = (value: string) => {
    setRangePreset(value);
    resetToFirstPage();
    if (value === "custom") return;
    if (value === "all") {
      setFrom("");
      setTo("");
      return;
    }
    const preset = RANGE_PRESETS.find((p) => p.value === value);
    const today = new Date();
    const start = new Date(today);
    if (preset?.days) start.setDate(start.getDate() - preset.days);
    else if (preset?.months) start.setMonth(start.getMonth() - preset.months);
    setFrom(toISODate(start));
    setTo(toISODate(today));
  };

  const columns = useMemo<Column<SignupWithCity>[]>(() => {
    const cols: Column<SignupWithCity>[] = [
      { key: "fullName", header: "Name", cellClassName: "font-medium text-slate-900 dark:text-white" },
      { key: "email", header: "Email" },
      { key: "mobileNumber", header: "Mobile" },
      { key: "age", header: "Age", render: (s) => s.age ?? "—" },
    ];
    // The city column is redundant for a city-scoped (non-admin) view.
    if (isAdmin) cols.push({ key: "cityName", header: "City" });
    cols.push({ key: "createdAt", header: "Signed Up", render: (s) => formatDate(s.createdAt) });
    return cols;
  }, [isAdmin]);

  const cityGroupColumns: Column<SignupCityGroup>[] = [
    { key: "cityName", header: "City", cellClassName: "font-medium text-slate-900 dark:text-white" },
    { key: "countryName", header: "Country" },
    {
      key: "count",
      header: "Signups",
      align: "right",
      cellClassName: "font-semibold text-slate-900 dark:text-white",
      render: (g) => formatNumber(g.count),
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Signups</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isAdmin
            ? "Volunteer signups across all cities."
            : "Volunteer signups for your city."}
        </p>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Signups" value={stats ? formatNumber(stats.total) : "—"} />
        {isAdmin && (
          <StatCard icon={Building2} label="Cities Represented" value={stats ? stats.cityCount : "—"} />
        )}
      </div>

      {/* By-city grouping (admins only) — paginated client-side. */}
      {isAdmin && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Signups by City</h2>
          <DataTable
            columns={cityGroupColumns}
            data={cityGroups}
            rowKey={(g) => g.cityId}
            isLoading={cityGroupsLoading}
            error={cityGroupsError}
            onRetry={loadCityGroups}
            emptyMessage="No signups in this range."
            resetKey={`${from}|${to}`}
          />
        </div>
      )}

      <div className="mt-6">
        {isAdmin && (
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">All Signups</h2>
        )}
        <DataTable
          columns={columns}
          data={rows}
          rowKey={(s) => s.id}
          isLoading={isLoading}
          error={loadError}
          onRetry={load}
          emptyMessage="No signups found."
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            resetToFirstPage();
          }}
          toolbar={
            <>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    resetToFirstPage();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white"
                  placeholder="Search name, email or mobile..."
                  type="text"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-slate-400" />
                    <select
                      value={cityFilter}
                      onChange={(e) => {
                        setCityFilter(e.target.value);
                        resetToFirstPage();
                      }}
                      className={`${selectClass} max-w-[10rem]`}
                      aria-label="Filter by city"
                    >
                      <option value="">All Cities</option>
                      {cityOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.cityName}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-slate-400" />
                  <select
                    value={rangePreset}
                    onChange={(e) => applyPreset(e.target.value)}
                    className={selectClass}
                    aria-label="Time range"
                  >
                    {RANGE_PRESETS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                {rangePreset === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={from}
                      max={to || undefined}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        resetToFirstPage();
                      }}
                      className={dateInputClass}
                      aria-label="From date"
                    />
                    <span className="text-sm text-slate-400">to</span>
                    <input
                      type="date"
                      value={to}
                      min={from || undefined}
                      onChange={(e) => {
                        setTo(e.target.value);
                        resetToFirstPage();
                      }}
                      className={dateInputClass}
                      aria-label="To date"
                    />
                  </div>
                )}
              </div>
            </>
          }
        />
      </div>
    </>
  );
}
