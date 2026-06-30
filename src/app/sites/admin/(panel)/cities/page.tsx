"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ListFilter, MessageCircle, Pencil, Trash2, X, Info } from "lucide-react";
import type { CityWithCountry } from "@/core/services/backend/city/cityService";
import { ADMIN_ROLES } from "@/core/config/constants";
import { CreateCitySchema } from "@/core/validators/cityValidation";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { api } from "@/lib/http";
import DataTable, { type Column } from "@/components/ui/DataTable";

// Shared input styling — matches the login screen / app design language.
const inputBase =
  "w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:bg-green-950/30 dark:text-white";
const inputBorder = (hasError?: string) =>
  hasError ? "border-rose-400 dark:border-rose-500" : "border-slate-200 dark:border-green-800/40";

type FormErrors = Partial<Record<"cityName" | "countryId" | "cityEmail" | "foodCadetsLink", string>>;

// Paths are relative to the shared client's base URL (/api/v1).
const CITY_PATH = "/admin/city";

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export default function CitiesPage() {
  const router = useRouter();
  const { roleName } = useAdminSession();
  const isAuthorized = ADMIN_ROLES.includes(roleName);

  const [cities, setCities] = useState<CityWithCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityWithCountry | null>(null);
  const [deletingCity, setDeletingCity] = useState<CityWithCountry | null>(null);
  const [isConfirmingEdit, setIsConfirmingEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cityName: "",
    countryId: "",
    cityEmail: "",
    foodCadetsLink: ""
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // Client-side validation against the SAME schema the API enforces (single source
  // of truth). countryId is coerced to a number to match CreateCitySchema; empty
  // optional links collapse to undefined.
  const formErrors = useMemo<FormErrors>(() => {
    const candidate = {
      cityName: formData.cityName,
      countryId: formData.countryId ? Number(formData.countryId) : undefined,
      cityEmail: formData.cityEmail,
      foodCadetsLink: formData.foodCadetsLink || undefined,
    };
    const result = CreateCitySchema.safeParse(candidate);
    if (result.success) return {};
    const flat = result.error.flatten().fieldErrors;
    return Object.fromEntries(
      Object.entries(flat).map(([k, msgs]) => [k, msgs?.[0]]),
    ) as FormErrors;
  }, [formData]);
  const isFormValid = Object.keys(formErrors).length === 0;

  const touch = (key: string) => setTouched(prev => ({ ...prev, [key]: true }));
  const visibleError = (key: keyof FormErrors) => (submitted || touched[key] ? formErrors[key] : undefined);
  const resetValidation = () => {
    setTouched({});
    setSubmitted(false);
  };

  // Client-side access gate. The API enforces ADMIN_ROLES independently;
  // this is UX only — redirect a non-admin who navigates here directly.
  useEffect(() => {
    if (!isAuthorized) router.replace("/sites/admin");
  }, [isAuthorized, router]);

  // Load the list from the role-guarded API on mount.
  const loadCities = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await api.get<{ data: CityWithCountry[] }>(CITY_PATH);
      setCities(res.data ?? []);
    } catch (err) {
      console.error(err);
      setLoadError(errorMessage(err, "Failed to load cities."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) loadCities();
  }, [isAuthorized, loadCities]);

  const uniqueCountries = useMemo(() => {
    const map = new Map<number, string>();
    cities.forEach(c => map.set(c.countryId, c.countryName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cities]);

  // Filtering — free-text search matches city name, country name, or email.
  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cities.filter(c => {
      const matchSearch =
        !q ||
        c.cityName.toLowerCase().includes(q) ||
        c.countryName.toLowerCase().includes(q) ||
        (c.cityEmail?.toLowerCase().includes(q) ?? false);
      const matchCountry = countryFilter === "All" || c.countryName === countryFilter;
      return matchSearch && matchCountry;
    });
  }, [cities, search, countryFilter]);

  const openAddModal = () => {
    setFormData({ cityName: "", countryId: "", cityEmail: "", foodCadetsLink: "" });
    resetValidation();
    setIsAddModalOpen(true);
  };

  const openEditModal = (city: CityWithCountry) => {
    setFormData({
      cityName: city.cityName,
      countryId: city.countryId.toString(),
      cityEmail: city.cityEmail || "",
      foodCadetsLink: city.foodCadetsLink || ""
    });
    resetValidation();
    setEditingCity(city);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingCity(null);
    setDeletingCity(null);
    setIsConfirmingEdit(false);
    resetValidation();
  };

  const handleDelete = async () => {
    if (!deletingCity) return;
    setIsSubmitting(true);
    try {
      await api.delete(`${CITY_PATH}/${deletingCity.id}`);
      setCities(prev => prev.filter(c => c.id !== deletingCity.id));
      closeModals();
    } catch (err) {
      console.error(err);
      alert(errorMessage(err, "Failed to delete city"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate against the shared schema before anything else.
    setSubmitted(true);
    if (!isFormValid) return;

    if (editingCity && !isConfirmingEdit) {
      setIsConfirmingEdit(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        cityName: formData.cityName,
        countryId: Number(formData.countryId),
        cityEmail: formData.cityEmail,
        foodCadetsLink: formData.foodCadetsLink || undefined,
      };

      if (editingCity) {
        // Edit → PATCH /api/v1/admin/city/:id
        const res = await api.patch<{ data: CityWithCountry }>(`${CITY_PATH}/${editingCity.id}`, payload);
        setCities(prev => prev.map(c => c.id === editingCity.id ? { ...c, ...res.data } : c));
        closeModals();
      } else {
        // Add → POST /api/v1/admin/city
        const res = await api.post<{ data: CityWithCountry }>(CITY_PATH, { ...payload, isFoodCity: true, isAcademyCity: false });
        setCities(prev => [...prev, res.data].sort((a, b) => a.cityName.localeCompare(b.cityName)));
        closeModals();
      }
    } catch (err) {
      console.error(err);
      alert(errorMessage(err, editingCity ? "Failed to update city" : "Failed to add city"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Column definitions for the shared DataTable.
  const columns: Column<CityWithCountry>[] = [
    { key: "cityName", header: "City Name", cellClassName: "font-medium text-slate-900 dark:text-white" },
    { key: "countryName", header: "Country" },
    { key: "cityEmail", header: "City Email", render: (c) => c.cityEmail || "N/A" },
    {
      key: "foodCadetsLink",
      header: "Food Cadets Link",
      render: (c) =>
        c.foodCadetsLink ? (
          <a
            href={c.foodCadetsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 transition-colors hover:bg-green-200 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        ) : (
          <span className="text-sm text-slate-400">Not provided</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(c)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#1a6b3c] dark:hover:bg-green-900/30 dark:hover:text-green-300"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeletingCity(c)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Non-admins are redirected by the effect above; render nothing meanwhile.
  if (!isAuthorized) return null;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">City Management</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage operational cities, leads, and overarching volunteer metrics.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#1a6b3c] to-[#166534] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-[#22c55e] hover:to-[#16a34a]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add City
        </button>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredCities}
          rowKey={(c) => c.id}
          isLoading={isLoading}
          error={loadError}
          onRetry={loadCities}
          emptyMessage="No cities found."
          resetKey={`${search}|${countryFilter}`}
          toolbar={
            <>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white"
                  placeholder="Search by city or country..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-slate-400" />
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white"
                >
                  <option value="All">All Countries</option>
                  {uniqueCountries.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </>
          }
        />
      </div>

      {/* Add / Edit / Delete City Modal */}
      {(isAddModalOpen || editingCity || deletingCity) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModals}
          />
          <div className="relative flex w-[95vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[440px] dark:border-green-800/30 dark:bg-[#0f2818]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-green-800/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {deletingCity ? "Delete City" : (editingCity ? (isConfirmingEdit ? "Confirm Changes" : "Edit City") : "Add New City")}
              </h3>
              <button type="button" onClick={closeModals} className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-green-900/30">
                <X className="h-5 w-5" />
              </button>
            </div>

            {deletingCity ? (
              <div className="space-y-5 p-6">
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40">
                    <Trash2 className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Delete {deletingCity.cityName}?</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This action cannot be undone. Are you sure you want to permanently delete this city?
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-green-800/40 dark:text-slate-200 dark:hover:bg-green-950/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-60"
                  >
                    {isSubmitting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6">
              {isConfirmingEdit ? (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                    <Info className="h-7 w-7 text-[#1a6b3c] dark:text-green-300" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Are you sure?</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You are about to save changes for <strong className="text-slate-700 dark:text-slate-200">{editingCity?.cityName}</strong>. Please confirm your action.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">City Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={formData.cityName}
                      onChange={e => setFormData(p => ({ ...p, cityName: e.target.value }))}
                      onBlur={() => touch("cityName")}
                      className={`${inputBase} ${inputBorder(visibleError("cityName"))}`}
                      placeholder="Enter city name"
                    />
                    {visibleError("cityName") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("cityName")}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Country <span className="text-rose-500">*</span></label>
                    <select
                      value={formData.countryId}
                      onChange={e => setFormData(p => ({ ...p, countryId: e.target.value }))}
                      onBlur={() => touch("countryId")}
                      className={`${inputBase} ${inputBorder(visibleError("countryId"))} cursor-pointer`}
                    >
                      <option value="" disabled>Select a country</option>
                      {uniqueCountries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {visibleError("countryId") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("countryId")}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">City Email <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      value={formData.cityEmail}
                      onChange={e => setFormData(p => ({ ...p, cityEmail: e.target.value }))}
                      onBlur={() => touch("cityEmail")}
                      className={`${inputBase} ${inputBorder(visibleError("cityEmail"))}`}
                      placeholder="e.g. city@robinhoodarmy.com"
                    />
                    {visibleError("cityEmail") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("cityEmail")}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Food Cadets WhatsApp Link</label>
                    <input
                      type="url"
                      value={formData.foodCadetsLink}
                      onChange={e => setFormData(p => ({ ...p, foodCadetsLink: e.target.value }))}
                      onBlur={() => touch("foodCadetsLink")}
                      className={`${inputBase} ${inputBorder(visibleError("foodCadetsLink"))}`}
                      placeholder="https://chat.whatsapp.com/..."
                    />
                    {visibleError("foodCadetsLink") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("foodCadetsLink")}</p>}
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => isConfirmingEdit ? setIsConfirmingEdit(false) : closeModals()}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-green-800/40 dark:text-slate-200 dark:hover:bg-green-950/20"
                >
                  {isConfirmingEdit ? "Back" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-[#1a6b3c] to-[#166534] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-[#22c55e] hover:to-[#16a34a] disabled:opacity-60"
                >
                  {isSubmitting
                    ? (editingCity ? "Saving..." : "Adding...")
                    : (isConfirmingEdit ? "Confirm & Save" : (editingCity ? "Save Changes" : "Add City"))}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
