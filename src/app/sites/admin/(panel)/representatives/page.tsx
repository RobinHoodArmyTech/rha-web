"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ListFilter, Pencil, Trash2, X, Info } from "lucide-react";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { api } from "@/lib/http";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { ADMIN_ROLES } from "@/core/config/constants";

type Representative = {
  id: number;
  cityId: number;
  fullName: string;
  email?: string | null;
  mobileNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type CityForSelect = { id: number; cityName: string; countryName?: string };

const REP_PATH = "/admin/representative";
const CITY_PATH = "/admin/city";

const inputBase =
  "w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:bg-green-950/30 dark:text-white";
const inputBorder = (hasError?: boolean) =>
  hasError ? "border-rose-400 dark:border-rose-500" : "border-slate-200 dark:border-green-800/40";

const errorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

export default function RepresentativesPage() {
  const router = useRouter();
  const { roleName } = useAdminSession();
  const isAuthorized = ADMIN_ROLES.includes(roleName);

  const [rows, setRows] = useState<Representative[]>([]);
  const [cities, setCities] = useState<CityForSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<number | "All">("All");

  // Modal / edit state
  const [editing, setEditing] = useState<Representative | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<Representative | null>(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", mobileNumber: "", cityId: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingEdit, setIsConfirmingEdit] = useState(false);

  useEffect(() => {
    if (!isAuthorized) router.replace("/sites/admin");
  }, [isAuthorized, router]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [rRes, cRes] = await Promise.all([
        api.get<{ data: Representative[] }>(REP_PATH),
        api.get<{ data: CityForSelect[] }>(CITY_PATH),
      ]);
      setRows(rRes.data ?? []);
      setCities((cRes.data ?? []).map((c) => ({ id: c.id, cityName: c.cityName, countryName: (c as any).countryName })));
    } catch (err) {
      console.error(err);
      setLoadError(errorMessage(err, "Failed to load representatives"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) load();
  }, [isAuthorized, load]);

  const uniqueCities = useMemo(
    () => cities.map((c) => ({ id: c.id, name: c.cityName })).sort((a, b) => a.name.localeCompare(b.name)),
    [cities],
  );

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.mobileNumber ?? "").toLowerCase().includes(q);
      const matchCity = cityFilter === "All" || r.cityId === cityFilter;
      return matchSearch && matchCity;
    });
  }, [rows, search, cityFilter]);

  const openAddModal = () => {
    setFormData({ fullName: "", email: "", mobileNumber: "", cityId: "" });
    setSubmitted(false);
    setTouched({});
    setIsAddModalOpen(true);
    setEditing(null);
  };

  const openEditModal = (rep: Representative) => {
    setFormData({
      fullName: rep.fullName,
      email: rep.email ?? "",
      mobileNumber: rep.mobileNumber ?? "",
      cityId: String(rep.cityId),
    });
    setEditing(rep);
    setIsAddModalOpen(true);
    setSubmitted(false);
    setTouched({});
    setIsConfirmingEdit(false);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditing(null);
    setDeleting(null);
    setIsConfirmingEdit(false);
    setSubmitted(false);
    setTouched({});
  };

  const touch = (k: string) => setTouched((p) => ({ ...p, [k]: true }));
  const visibleError = (key: string) => (submitted || touched[key] ? formValidation()[key as keyof ReturnType<typeof formValidation>] : undefined);

  function formValidation() {
    const errs: Record<string, string | undefined> = {};
    if (!formData.fullName || formData.fullName.trim().length === 0) errs.fullName = "Full name is required";
    if (!formData.cityId || Number.isNaN(Number(formData.cityId)) || Number(formData.cityId) <= 0) errs.cityId = "City is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email";
    return errs;
  }

  const handleDelete = async () => {
    if (!deleting) return;
    setIsSubmitting(true);
    try {
      await api.delete(`${REP_PATH}/${deleting.id}`);
      setRows((prev) => prev.filter((r) => r.id !== deleting.id));
      closeModals();
    } catch (err) {
      console.error(err);
      alert(errorMessage(err, "Failed to delete representative"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitted(true);
    const errs = formValidation();
    if (Object.keys(errs).length > 0) return;

    if (editing && !isConfirmingEdit) {
      setIsConfirmingEdit(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email || undefined,
        mobileNumber: formData.mobileNumber || undefined,
        cityId: Number(formData.cityId),
      };

      if (editing) {
        const res = await api.patch<{ data: Representative }>(`${REP_PATH}/${editing.id}`, payload);
        setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...res.data } : r)));
      } else {
        const res = await api.post<{ data: Representative }>(REP_PATH, payload);
        setRows((prev) => [...prev, res.data].sort((a, b) => a.fullName.localeCompare(b.fullName)));
      }
      closeModals();
    } catch (err) {
      console.error(err);
      alert(errorMessage(err, editing ? "Failed to update representative" : "Failed to add representative"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Representative & { cityName?: string }>[] = [
    { key: "fullName", header: "Name", cellClassName: "font-medium text-slate-900 dark:text-white" },
    {
      key: "city",
      header: "City",
      render: (r) => {
        const c = cities.find((c) => c.id === r.cityId);
        return c ? `${c.cityName}` : String(r.cityId);
      },
    },
    { key: "email", header: "Email", render: (r) => r.email ?? "—" },
    { key: "mobileNumber", header: "Mobile", render: (r) => r.mobileNumber ?? "—" },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(r)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#1a6b3c] dark:hover:bg-green-900/30 dark:hover:text-green-300"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleting(r)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (!isAuthorized) return null;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Representatives</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage city representatives and contact details.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#1a6b3c] to-[#166534] px-4 py-2.5 text-sm font-semibold text-white shadow-md"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Representative
        </button>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredRows}
          rowKey={(r) => r.id}
          isLoading={isLoading}
          error={loadError}
          onRetry={load}
          emptyMessage="No representatives found."
          resetKey={`${search}|${cityFilter}`}
          toolbar={
            <>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                  placeholder="Search by name, email or mobile..."
                  type="text"
                />
              </div>

              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-slate-400" />
                <select
                  value={cityFilter === "All" ? "All" : String(cityFilter)}
                  onChange={(e) => setCityFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900"
                >
                  <option value="All">All Cities</option>
                  {uniqueCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          }
        />
      </div>

      {/* Add / Edit / Delete Modal */}
      {(isAddModalOpen || deleting) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals} />
          <div className="relative flex w-[95vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[520px] dark:border-green-800/30 dark:bg-[#0f2818]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-green-800/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {deleting ? "Delete Representative" : editing ? (isConfirmingEdit ? "Confirm Changes" : "Edit Representative") : "Add Representative"}
              </h3>
              <button type="button" onClick={closeModals} className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-green-900/30">
                <X className="h-5 w-5" />
              </button>
            </div>

            {deleting ? (
              <div className="space-y-5 p-6">
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30">
                    <Trash2 className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Delete {deleting.fullName}?</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModals} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700">Cancel</button>
                  <button type="button" onClick={handleDelete} disabled={isSubmitting} className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white">
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">You are about to save changes. Please confirm.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                        onBlur={() => touch("fullName")}
                        className={`${inputBase} ${inputBorder(Boolean(visibleError("fullName")))}`}
                        placeholder="e.g. Priya Sharma"
                      />
                      {visibleError("fullName") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("fullName")}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">City <span className="text-rose-500">*</span></label>
                      <select
                        value={formData.cityId}
                        onChange={(e) => setFormData((p) => ({ ...p, cityId: e.target.value }))}
                        onBlur={() => touch("cityId")}
                        className={`${inputBase} ${inputBorder(Boolean(visibleError("cityId")))} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select a city
                        </option>
                        {uniqueCities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {visibleError("cityId") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("cityId")}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        onBlur={() => touch("email")}
                        className={`${inputBase} ${inputBorder(Boolean(visibleError("email")))}`}
                        placeholder="e.g. rep@example.com"
                      />
                      {visibleError("email") && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{visibleError("email")}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile</label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData((p) => ({ ...p, mobileNumber: e.target.value }))}
                        className={`${inputBase} ${inputBorder()}`}
                        placeholder="e.g. +911234567890"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => (isConfirmingEdit ? setIsConfirmingEdit(false) : closeModals())} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700">
                    {isConfirmingEdit ? "Back" : "Cancel"}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-[#1a6b3c] to-[#166534] px-5 py-2.5 text-sm font-semibold text-white">
                    {isSubmitting ? (editing ? "Saving..." : "Adding...") : isConfirmingEdit ? "Confirm & Save" : (editing ? "Save Changes" : "Add Representative")}
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