"use client";

import { useState, useTransition, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Globe,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Users,
} from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { submitSignup } from "@/app/sites/main/signup/actions";
import {
  SignupSchema,
  initialSignupState,
  normalizeMobileNumber,
  type SignupFormState,
} from "@/domains/main/lib/signupValidation";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const helpOptions = [
  "Teach",
  "Volunteer Time",
  "Become a Restaurant Partner",
];

const cityOptions = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Other",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValues = {
  helpType: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  age: string;
  facebookProfile: string;
  city: string;
  locality: string;
  thoughts: string;
  agreedToPrinciples: boolean;
};

type FieldKey = keyof FormValues;
type ClientErrors = Partial<Record<FieldKey, string>>;

const initialValues: FormValues = {
  helpType: "",
  fullName: "",
  mobileNumber: "",
  email: "",
  age: "",
  facebookProfile: "",
  city: "",
  locality: "",
  thoughts: "",
  agreedToPrinciples: false,
};

// ─── Client-side validation ───────────────────────────────────────────────────

function getClientErrors(v: FormValues): ClientErrors {
  const result = SignupSchema.safeParse(v);
  if (result.success) return {};

  const errors: ClientErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as FieldKey;
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}

const REQUIRED: FieldKey[] = [
  "helpType",
  "fullName",
  "mobileNumber",
  "email",
  "city",
  "locality",
  "agreedToPrinciples",
];

// ─── Small primitives ─────────────────────────────────────────────────────────

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
      {error}
    </p>
  );
}

const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/10 dark:border-slate-700 dark:bg-[#0a1a0f] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#4ade80] dark:focus:ring-[#4ade80]/10";

// ─── Radix Select wrapper ─────────────────────────────────────────────────────

function FormSelect({
  placeholder,
  options,
  value,
  onValueChange,
  icon: Icon,
  error,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onValueChange: (v: string) => void;
  icon?: React.ElementType;
  error?: string;
}) {
  return (
    <div>
      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition-colors",
            "focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/10",
            "data-[state=open]:border-[#1a6b3c] data-[state=open]:ring-2 data-[state=open]:ring-[#1a6b3c]/10",
            "dark:border-slate-700 dark:bg-[#0a1a0f] dark:focus:border-[#4ade80] dark:focus:ring-[#4ade80]/10 dark:data-[state=open]:border-[#4ade80] dark:data-[state=open]:ring-[#4ade80]/10",
            value ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
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
              "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
              "rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60",
              "dark:border-slate-700 dark:bg-[#0f2818] dark:shadow-slate-900/60",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt}
                  value={opt}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none",
                    "data-[highlighted]:bg-[#f0f7f2] data-[highlighted]:text-[#1a6b3c]",
                    "data-[state=checked]:font-semibold data-[state=checked]:text-[#1a6b3c]",
                    "dark:text-slate-300 dark:data-[highlighted]:bg-green-900/30 dark:data-[highlighted]:text-[#4ade80] dark:data-[state=checked]:text-[#4ade80]"
                  )}
                >
                  <SelectPrimitive.ItemText>{opt}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3">
                    <Check className="h-3.5 w-3.5 text-[#1a6b3c]" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <FieldError error={error} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SignupForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverState, setServerState] = useState<SignupFormState>(initialSignupState);
  const [isPending, startTransition] = useTransition();

  const clientErrors = useMemo(() => getClientErrors(values), [values]);

  // Show error for a field only if it's been touched or form was submitted
  function visibleError(field: FieldKey): string | undefined {
    if (submitted || touched[field]) return clientErrors[field];
    return undefined;
  }

  // Button active only when all required fields are valid
  const isFormValid = useMemo(
    () => REQUIRED.every((f) => !clientErrors[f]),
    [clientErrors]
  );

  function set<K extends FieldKey>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear server error for this field when user edits
    if (serverState.fieldErrors?.[field]) {
      setServerState((prev) => ({
        ...prev,
        fieldErrors: { ...prev.fieldErrors, [field]: undefined },
      }));
    }
  }

  function touch(field: FieldKey) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid) return;

    const fd = new FormData();
    fd.set("helpType", values.helpType);
    fd.set("fullName", values.fullName);
    fd.set("mobileNumber", normalizeMobileNumber(values.mobileNumber));
    fd.set("email", values.email);
    if (values.age) fd.set("age", values.age);
    if (values.facebookProfile) fd.set("facebookProfile", values.facebookProfile);
    fd.set("city", values.city);
    fd.set("locality", values.locality);
    if (values.thoughts) fd.set("thoughts", values.thoughts);
    if (values.agreedToPrinciples) fd.set("agreedToPrinciples", "on");

    startTransition(async () => {
      const result = await submitSignup(serverState, fd);
      setServerState(result);
      if (result.status === "success") {
        setValues(initialValues);
        setTouched({});
        setSubmitted(false);
      }
    });
  }

  const fieldError = (field: FieldKey) =>
    visibleError(field) ?? serverState.fieldErrors?.[field];

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Join our family.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          How would you like to help? Share a few details and we&apos;ll keep
          the next step ready for you.
        </p>
      </div>

      {serverState.status === "error" && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400">
          {serverState.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* How to help */}
        <FormSelect
          placeholder="Select how you would like to help *"
          options={helpOptions}
          value={values.helpType}
          onValueChange={(v) => { set("helpType", v); touch("helpType"); }}
          error={fieldError("helpType")}
        />

        {/* Full name */}
        <div>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              autoComplete="name"
              placeholder="Full Name *"
              value={values.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              onBlur={() => touch("fullName")}
              aria-invalid={Boolean(fieldError("fullName"))}
              className={cn(inputBase, "pl-9")}
            />
          </div>
          <FieldError error={fieldError("fullName")} />
        </div>

        {/* Mobile + Age */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Mobile Number *"
                value={values.mobileNumber}
                onChange={(e) => set("mobileNumber", e.target.value)}
                onBlur={() => {
                  set("mobileNumber", normalizeMobileNumber(values.mobileNumber));
                  touch("mobileNumber");
                }}
                aria-invalid={Boolean(fieldError("mobileNumber"))}
                className={cn(inputBase, "pl-9")}
              />
            </div>
            <FieldError error={fieldError("mobileNumber")} />
          </div>

          <div>
            <input
              type="number"
              inputMode="numeric"
              min="16"
              max="120"
              placeholder="Age (optional)"
              value={values.age}
              onChange={(e) => set("age", e.target.value)}
              onBlur={() => { if (values.age) touch("age"); }}
              className={inputBase}
            />
            <FieldError error={fieldError("age")} />
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              autoComplete="email"
              placeholder="Email Address *"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => touch("email")}
              aria-invalid={Boolean(fieldError("email"))}
              className={cn(inputBase, "pl-9")}
            />
          </div>
          <FieldError error={fieldError("email")} />
        </div>

        {/* Facebook */}
        <div>
          <div className="relative">
            <Facebook className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="url"
              placeholder="Facebook Profile Link (optional)"
              value={values.facebookProfile}
              onChange={(e) => set("facebookProfile", e.target.value)}
              onBlur={() => { if (values.facebookProfile) touch("facebookProfile"); }}
              className={cn(inputBase, "pl-9")}
            />
          </div>
          <FieldError error={fieldError("facebookProfile")} />
        </div>

        {/* City + Locality */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect
            placeholder="Select City *"
            options={cityOptions}
            value={values.city}
            onValueChange={(v) => { set("city", v); touch("city"); }}
            icon={MapPin}
            error={fieldError("city")}
          />

          <div>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Locality *"
                value={values.locality}
                onChange={(e) => set("locality", e.target.value)}
                onBlur={() => touch("locality")}
                aria-invalid={Boolean(fieldError("locality"))}
                className={cn(inputBase, "pl-9")}
              />
            </div>
            <FieldError error={fieldError("locality")} />
          </div>
        </div>

        {/* Thoughts */}
        <div className="relative">
          <MessageSquareText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <textarea
            rows={3}
            placeholder="Any thoughts? We'd love to hear them! (optional)"
            value={values.thoughts}
            onChange={(e) => set("thoughts", e.target.value)}
            className={cn(inputBase, "resize-none pl-9")}
          />
        </div>

        {/* Agreement */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-800/20">
          <div className="flex items-start gap-3">
            <CheckboxPrimitive.Root
              id="agreedToPrinciples"
              checked={values.agreedToPrinciples}
              onCheckedChange={(checked) => {
                set("agreedToPrinciples", checked === true);
                touch("agreedToPrinciples");
              }}
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6b3c] focus-visible:ring-offset-1",
                values.agreedToPrinciples
                  ? "border-[#1a6b3c] bg-[#1a6b3c]"
                  : "border-slate-300 bg-white dark:border-slate-600 dark:bg-[#0a1a0f]"
              )}
            >
              <CheckboxPrimitive.Indicator>
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            <LabelPrimitive.Root
              htmlFor="agreedToPrinciples"
              className="cursor-pointer text-sm leading-6 text-slate-700 dark:text-slate-300"
            >
              By checking this box, I agree to follow the Robin Hood Army&apos;s
              core principles and understand that any personal risk during the
              process will be borne by me and the Robin Hood Army is not liable.
            </LabelPrimitive.Root>
          </div>
          <FieldError error={fieldError("agreedToPrinciples")} />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isPending || (submitted && !isFormValid)}
          whileHover={{ scale: isPending ? 1 : 1.01 }}
          whileTap={{ scale: isPending ? 1 : 0.98 }}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all",
            isFormValid && !isPending
              ? "bg-gradient-to-r from-[#1a6b3c] to-[#14512f] shadow-lg shadow-[#1a6b3c]/20 hover:from-[#1f7a45] hover:to-[#166534]"
              : "cursor-not-allowed bg-slate-300 shadow-none dark:bg-slate-700"
          )}
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting…
            </>
          ) : (
            <>
              Join the Army
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>

        {serverState.status === "success" && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {serverState.message}
          </div>
        )}
      </form>
    </div>
  );
}
