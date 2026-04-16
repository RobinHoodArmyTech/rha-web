import { Check, ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
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

const itemClass = cn(
  "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none",
  "data-[highlighted]:bg-[#f0f7f2] data-[highlighted]:text-[#1a6b3c]",
  "data-[state=checked]:font-semibold data-[state=checked]:text-[#1a6b3c]",
  "dark:text-slate-300 dark:data-[highlighted]:bg-green-900/30 dark:data-[highlighted]:text-[#4ade80] dark:data-[state=checked]:text-[#4ade80]",
);

function SelectItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <SelectPrimitive.Item value={value} className={cn(itemClass, className)}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3">
        <Check className="h-3.5 w-3.5 text-[#1a6b3c]" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export default function FormSelect({
  placeholder,
  options,
  groups,
  value,
  onValueChange,
  icon: Icon,
  error,
}: FormSelectProps) {
  return (
    <div>
      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition-colors",
            "focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/10",
            "data-[state=open]:border-[#1a6b3c] data-[state=open]:ring-2 data-[state=open]:ring-[#1a6b3c]/10",
            "dark:border-slate-700 dark:bg-[#0a1a0f] dark:focus:border-[#4ade80] dark:focus:ring-[#4ade80]/10 dark:data-[state=open]:border-[#4ade80] dark:data-[state=open]:ring-[#4ade80]/10",
            value ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500",
          )}
        >
          {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
          <SelectPrimitive.Value placeholder={placeholder} className="flex-1 text-left" />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "z-50 max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
              "rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60",
              "dark:border-slate-700 dark:bg-[#0f2818] dark:shadow-slate-900/60",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options?.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}

              {groups?.map((group) => (
                <SelectPrimitive.Group key={group.label}>
                  <SelectPrimitive.Label className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {group.label}
                  </SelectPrimitive.Label>
                  {group.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="pl-6">{opt.label}</SelectItem>
                  ))}
                </SelectPrimitive.Group>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <FieldError error={error} />
    </div>
  );
}
