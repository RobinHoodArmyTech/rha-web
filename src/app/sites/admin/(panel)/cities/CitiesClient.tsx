"use client";

import React, { useState, useMemo } from "react";
import { CityWithCountry } from "@/core/services/backend/city/cityService";
import { addCityAction, editCityAction, deleteCityAction } from "./actions";

export default function CitiesClient({ initialCities }: { initialCities: CityWithCountry[] }) {
  const [cities, setCities] = useState<CityWithCountry[]>(initialCities);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
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

  const uniqueCountries = useMemo(() => {
    const map = new Map<number, string>();
    cities.forEach(c => map.set(c.countryId, c.countryName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cities]);

  // Filtering
  const filteredCities = useMemo(() => {
    return cities.filter(c => {
      const matchSearch = c.cityName.toLowerCase().includes(search.toLowerCase()) || 
                          (c.cityEmail && c.cityEmail.toLowerCase().includes(search.toLowerCase()));
      const matchCountry = countryFilter === "All" || c.countryName === countryFilter;
      return matchSearch && matchCountry;
    });
  }, [cities, search, countryFilter]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredCities.length / limit) || 1;
  const paginatedCities = filteredCities.slice((page - 1) * limit, page * limit);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, countryFilter, limit]);

  const openAddModal = () => {
    setFormData({ cityName: "", countryId: "", cityEmail: "", foodCadetsLink: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (city: CityWithCountry) => {
    setFormData({
      cityName: city.cityName,
      countryId: city.countryId.toString(),
      cityEmail: city.cityEmail || "",
      foodCadetsLink: city.foodCadetsLink || ""
    });
    setEditingCity(city);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingCity(null);
    setDeletingCity(null);
    setIsConfirmingEdit(false);
  };

  const handleDelete = async () => {
    if (!deletingCity) return;
    setIsSubmitting(true);
    try {
      const result = await deleteCityAction(deletingCity.id, deletingCity.cityName);
      if (result.success) {
        setCities(prev => prev.filter(c => c.id !== deletingCity.id));
        closeModals();
      } else {
        alert(result.error || "Failed to delete city");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        // Edit Action
        const result = await editCityAction(editingCity.id, payload);
        if (result.success && result.city) {
          setCities(prev => prev.map(c => c.id === editingCity.id ? { ...c, ...result.city } as CityWithCountry : c));
          closeModals();
        } else {
          alert(result.error || "Failed to update city");
        }
      } else {
        // Add Action
        const result = await addCityAction({ ...payload, isFoodCity: true, isAcademyCity: false });
        if (result.success && result.city) {
          setCities(prev => [...prev, result.city as any].sort((a, b) => a.cityName.localeCompare(b.cityName)));
          closeModals();
        } else {
          alert(result.error || "Failed to add city");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (i === page - 2 || i === page + 2) {
        pages.push('...');
      }
    }
    return pages.filter((p, index, arr) => p !== '...' || arr[index - 1] !== '...');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-headline-lg font-bold text-on-surface">City Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage operational cities, leads, and overarching volunteer metrics.</p>
        </div>
        <button 
          type="button"
          onClick={openAddModal}
          className="bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add City
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_1px_3px_rgba(0,0,0,0.02),_0px_4px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent rounded-lg focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70" 
              placeholder="Search cities..." 
              type="text" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-on-surface font-body-md text-body-md">
              <label>Show</label>
              <select 
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="bg-surface-container-low text-on-surface border border-transparent rounded-lg px-2 py-1 outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">filter_list</span>
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-surface-container-low text-on-surface border border-transparent rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md cursor-pointer"
              >
                <option value="All">All Countries</option>
                {uniqueCountries.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
                <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">City Name</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Country</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">City Email</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Food Cadets Link</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              {paginatedCities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                    No cities found.
                  </td>
                </tr>
              ) : (
                paginatedCities.map((city) => (
                  <tr key={city.id} className="border-b border-outline-variant/10 hover:bg-primary-fixed/10 transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface">{city.cityName}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{city.countryName}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{city.cityEmail || "N/A"}</td>
                    <td className="py-3 px-4">
                      {city.foodCadetsLink ? (
                        <a 
                          href={city.foodCadetsLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm hover:bg-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          WhatsApp
                        </a>
                      ) : (
                        <span className="text-on-surface-variant text-sm">Not provided</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <button 
                          type="button"
                          onClick={() => openEditModal(city)}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setDeletingCity(city)}
                          className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error-container/50 transition-colors cursor-pointer" 
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-body-md text-body-md gap-4">
          <p>
            Showing {filteredCities.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, filteredCities.length)} of {filteredCities.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((p, i) => (
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 text-on-surface-variant">...</span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${page === p ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
                  >
                    {p}
                  </button>
                )
              ))}
            </div>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modern Add / Edit / Delete City Modal */}
      {(isAddModalOpen || editingCity || deletingCity) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModals}
          />
          <div className="relative bg-surface rounded-2xl w-[95vw] sm:w-[440px] shadow-2xl border border-outline-variant/20 overflow-hidden transform transition-all flex flex-col">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-display text-headline-sm font-bold text-on-surface">
                {deletingCity ? "Delete City" : (editingCity ? (isConfirmingEdit ? "Confirm Changes" : "Edit City") : "Add New City")}
              </h3>
              <button type="button" onClick={closeModals} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {deletingCity ? (
              <div className="p-6 space-y-5 bg-surface-container-lowest">
                <div className="py-4 text-center">
                  <span className="material-symbols-outlined text-error text-[48px] mb-4">delete_forever</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Delete {deletingCity.cityName}?</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    This action cannot be undone. Are you sure you want to permanently delete this city?
                  </p>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={closeModals}
                    className="px-5 py-2.5 border border-outline-variant text-on-surface-variant font-label-md rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-error text-on-error font-label-md rounded-xl hover:bg-error/90 disabled:opacity-70 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-surface-container-lowest">
              {isConfirmingEdit ? (
                <div className="py-4 text-center">
                  <span className="material-symbols-outlined text-warning text-[48px] mb-4 text-primary">info</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Are you sure?</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    You are about to save changes for <strong>{editingCity?.cityName}</strong>. Please confirm your action.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5">City Name <span className="text-error">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.cityName}
                      onChange={e => setFormData(p => ({ ...p, cityName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-xl focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Enter city name"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5">Country <span className="text-error">*</span></label>
                    <select 
                      required
                      value={formData.countryId}
                      onChange={e => setFormData(p => ({ ...p, countryId: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-xl focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select a country</option>
                      {uniqueCountries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5">City Email (Optional)</label>
                    <input 
                      type="email" 
                      value={formData.cityEmail}
                      onChange={e => setFormData(p => ({ ...p, cityEmail: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-xl focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="e.g. city@robinhoodarmy.com"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5">Food Cadets WhatsApp Link (Optional)</label>
                    <input 
                      type="url" 
                      value={formData.foodCadetsLink}
                      onChange={e => setFormData(p => ({ ...p, foodCadetsLink: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-xl focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                </>
              )}
              
              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => isConfirmingEdit ? setIsConfirmingEdit(false) : closeModals()}
                  className="px-5 py-2.5 border border-outline-variant text-on-surface-variant font-label-md rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  {isConfirmingEdit ? "Back" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:bg-on-primary-fixed-variant disabled:opacity-70 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
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
