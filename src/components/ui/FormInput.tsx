import { cn } from "@/lib/utils";
import FieldError from "./FieldError";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  error?: string;
}

export default function FormInput({ icon: Icon, error, className, ...props }: FormInputProps) {
  return (
    <div>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        )}
        <input
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-colors",
            "placeholder:text-slate-400 focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/10",
            "dark:border-slate-700 dark:bg-[#0a1a0f] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#4ade80] dark:focus:ring-[#4ade80]/10",
            Icon && "pl-9",
            className,
          )}
          {...props}
        />
      </div>
      <FieldError error={error} />
    </div>
  );
}
