import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import FieldError from "./FieldError";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface FormSelectProps {
  placeholder: string;
  options?: string[];
  groups?: SelectGroup[];
  value: string;
  onValueChange: (v: string) => void;
  icon?: React.ElementType;
  error?: string;
}

export default function FormSelect({
  placeholder,
  options = [],
  groups = [],
  value,
  onValueChange,
  icon: Icon = Search,
  error,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const selectedLabel = useMemo(() => {
    if (!value) return "";
    const flatOption = options.find((opt) => opt === value);
    if (flatOption) return flatOption;
    for (const group of groups) {
      const groupedOption = group.options.find((opt) => String(opt.value) === String(value));
      if (groupedOption) return groupedOption.label;
    }
    return value;
  }, [value, options, groups]);

  const handleToggleDropdown = useCallback(() => {
    setIsOpen(prev => {
      const newIsOpen = !prev;
      if (!newIsOpen) {
        setSearchTerm(selectedLabel);
      } else {
        setSearchTerm("");
      }
      return newIsOpen;
    });
  }, [selectedLabel]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(selectedLabel);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedLabel]);

  const filteredOptions = useMemo(() => 
    options.filter((opt) =>
      opt.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [options, searchTerm]
  );

  const filteredGroups = useMemo(() => 
    groups
      .map((group) => ({
        ...group,
        options: group.options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.options.length > 0),
    [groups, searchTerm]
  );

  const hasResults = filteredOptions.length > 0 || filteredGroups.length > 0;

  const handleSelect = useCallback((selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
    setSearchTerm(selectedLabel);
  }, [onValueChange, selectedLabel]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  const handleInputFocus = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      setSearchTerm("");
    }
  }, [isOpen]);

  const displayValue = isOpen ? searchTerm : selectedLabel;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={cn(
          "relative flex w-full items-center gap-2 rounded-xl border bg-white px-3 transition-colors",
          isOpen
            ? "border-[#1a6b3c] ring-2 ring-[#1a6b3c]/10 dark:border-[#4ade80] dark:ring-[#4ade80]/10"
            : "border-slate-200 focus-within:border-[#1a6b3c] focus-within:ring-2 focus-within:ring-[#1a6b3c]/10 dark:border-slate-700 dark:focus-within:border-[#4ade80] dark:focus-within:ring-[#4ade80]/10",
          "dark:bg-[#0a1a0f]"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
        
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="flex-1 truncate bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />

        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 cursor-pointer text-slate-400 transition-transform duration-200 dark:text-slate-500",
            isOpen && "rotate-180"
          )}
          onClick={handleToggleDropdown}
        />
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-[#0f2818] dark:shadow-slate-900/60",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {!hasResults ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No city found.
              </div>
            ) : (
              <>
                {filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 outline-none transition-colors hover:bg-[#f0f7f2] hover:text-[#1a6b3c] dark:text-slate-300 dark:hover:bg-green-900/30 dark:hover:text-[#4ade80]",
                      value === opt && "bg-[#f0f7f2] font-semibold text-[#1a6b3c] dark:bg-green-900/30 dark:text-[#4ade80]"
                    )}
                  >
                    {opt}
                    {value === opt && <Check className="ml-auto h-4 w-4 text-[#1a6b3c] dark:text-[#4ade80]" />}
                  </button>
                ))}

                {filteredGroups.map((group) => (
                  <div key={group.label}>
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {group.label}
                    </div>
                    {group.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        type="button"
                        className={cn(
                          "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2.5 pl-6 text-left text-sm text-slate-700 outline-none transition-colors hover:bg-[#f0f7f2] hover:text-[#1a6b3c] dark:text-slate-300 dark:hover:bg-green-900/30 dark:hover:text-[#4ade80]",
                          String(value) === String(opt.value) && "bg-[#f0f7f2] font-semibold text-[#1a6b3c] dark:bg-green-900/30 dark:text-[#4ade80]"
                        )}
                      >
                        {opt.label}
                        {String(value) === String(opt.value) && (
                          <Check className="ml-auto h-4 w-4 text-[#1a6b3c] dark:text-[#4ade80]" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      <FieldError error={error} />
    </div>
  );
}