"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  /** Stable identifier for the column (also used as React key). */
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Defaults to `String(row[key])` when omitted. */
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  /** Extra classes for the <td>. */
  cellClassName?: string;
  /** Extra classes for the <th>. */
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  /**
   * Uncontrolled mode: pass the full (already-filtered) dataset — the table
   * paginates it internally.
   * Controlled mode (server-side): pass only the current page's rows; the table
   * renders them as-is and reports page changes via `onPageChange`.
   */
  data: T[];
  rowKey: (row: T) => React.Key;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  /** Page-specific controls (search, filters…) rendered in the header bar. */
  toolbar?: React.ReactNode;
  pageSizeOptions?: number[];
  /** Uncontrolled only: when this changes, pagination resets to page 1 (e.g. active filters). */
  resetKey?: unknown;

  // --- Controlled (server-side) pagination. Provide `onPageChange` to opt in. ---
  /** Current 1-based page (controlled). */
  page?: number;
  /** Current page size (controlled). Falls back to the first `pageSizeOptions` entry. */
  pageSize?: number;
  /** Total row count across all pages, from the server. Required for correct counts in controlled mode. */
  total?: number;
  /** Called when the user navigates pages. Its presence switches the table to controlled mode. */
  onPageChange?: (page: number) => void;
  /** Called when the user changes page size (controlled). Omit to hide the size selector. */
  onPageSizeChange?: (size: number) => void;
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = "No records found.",
  toolbar,
  pageSizeOptions = [10, 20, 50],
  resetKey,
  page: pageProp,
  pageSize,
  total: totalProp,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  // The table is "controlled" (server-side) when the parent owns navigation.
  const isControlled = onPageChange != null;

  const [internalPage, setInternalPage] = useState(1);
  const [internalLimit, setInternalLimit] = useState(pageSizeOptions[0] ?? 10);
  const [prevResetKey, setPrevResetKey] = useState(resetKey);

  // Uncontrolled only: reset to page 1 when filters change — state adjustment
  // during render (React-recommended over an effect; avoids cascading renders).
  if (!isControlled && resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setInternalPage(1);
  }

  const limit = isControlled ? (pageSize ?? pageSizeOptions[0] ?? 10) : internalLimit;
  // Controlled: total comes from the server. Uncontrolled: it's the in-memory length.
  const total = isControlled ? (totalProp ?? 0) : data.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = isControlled ? (pageProp ?? 1) : internalPage;
  // Clamp in case the dataset shrank below the current page.
  const safePage = Math.min(currentPage, totalPages);
  // Controlled: `data` is already the current page. Uncontrolled: slice it here.
  const rows = isControlled ? data : data.slice((safePage - 1) * limit, safePage * limit);

  const goToPage = (next: number) => {
    if (isControlled) onPageChange(next);
    else setInternalPage(next);
  };
  const changeLimit = (next: number) => {
    if (isControlled) onPageSizeChange?.(next);
    else {
      setInternalLimit(next);
      setInternalPage(1);
    }
  };
  // Hide the size selector if there's nothing to choose, or controlled with no handler.
  const showPageSize = pageSizeOptions.length > 1 && (!isControlled || onPageSizeChange != null);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - 1 && i <= safePage + 1)) {
        pages.push(i);
      } else if (i === safePage - 2 || i === safePage + 2) {
        pages.push("...");
      }
    }
    return pages.filter((p, i, arr) => p !== "..." || arr[i - 1] !== "...");
  }, [safePage, totalPages]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-green-800/30 dark:bg-[#0f2818]">
      {toolbar && (
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between dark:border-green-800/30">
          {toolbar}
        </div>
      )}

      <div className="relative overflow-x-auto">
        {/* Re-fetch overlay: keep the current rows in place so the layout (and the
            pagination controls) don't jump while the next page loads. */}
        {isLoading && rows.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-[#0f2818]/60">
            <Loader2 className="h-6 w-6 animate-spin text-[#1a6b3c]" />
          </div>
        )}
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-green-800/30 dark:bg-green-950/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400",
                    alignClass[col.align ?? "left"],
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* Initial load only — during a re-fetch we keep the old rows + overlay. */}
            {isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#1a6b3c]" />
                  <span className="mt-2 block">Loading…</span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-rose-600 dark:text-rose-400">
                  {error}{" "}
                  {onRetry && (
                    <button type="button" onClick={onRetry} className="font-semibold underline hover:text-rose-700">
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-green-900/30 dark:hover:bg-green-950/20"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-slate-600 dark:text-slate-300", alignClass[col.align ?? "left"], col.cellClassName)}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: count, page size, pagination */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-4 text-sm text-slate-500 sm:flex-row dark:border-green-800/30 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <p>
            Showing {total > 0 ? (safePage - 1) * limit + 1 : 0} to {Math.min(safePage * limit, total)} of {total} entries
          </p>
          {showPageSize && (
            <div className="flex items-center gap-2">
              <label>Show</label>
              <select
                value={limit}
                onChange={(e) => changeLimit(Number(e.target.value))}
                className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:border-green-800/40 dark:bg-green-950/30 dark:text-white"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-800/40 dark:hover:bg-green-950/20"
          >
            Prev
          </button>

          <div className="mx-2 flex items-center gap-1">
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-slate-400">...</span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => goToPage(p)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    safePage === p
                      ? "bg-[#1a6b3c] font-semibold text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-green-900/30",
                  )}
                >
                  {p}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages || totalPages === 0}
            className="rounded-lg border border-slate-200 px-3 py-1.5 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-800/40 dark:hover:bg-green-950/20"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
