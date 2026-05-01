"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, Users } from "lucide-react";
import { JoinUsSchema, normalizeMobileNumber, type JoinUsValues, type JoinUsFieldErrors } from "@/core/validators/joinUsValidation";
import { api } from "@/core/services/http";
import { cn } from "@/lib/utils";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";

interface City {
  id: number;
  cityName: string;
  countryName: string;
}

function getFieldErrors(values: JoinUsValues): JoinUsFieldErrors {
  const result = JoinUsSchema.safeParse(values);
  if (result.success) return {};
  const flat = result.error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flat).map(([k, msgs]) => [k, msgs[0]]),
  );
}

export default function JoinUsForm() {
  const [values, setValues] = useState<JoinUsValues>({ fullName: "", mobileNumber: "", email: "", cityId: 0 });
  const [touched, setTouched] = useState<Partial<Record<keyof JoinUsValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    api.get<{ data: City[] }>("/public/city")
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, []);

  const clientErrors = useMemo(() => getFieldErrors(values), [values]);

  function visibleError(field: keyof JoinUsValues): string | undefined {
    if (submitted || touched[field] || values[field]) return clientErrors[field];
    return undefined;
  }

  const isFormValid = useMemo(
    () => Object.keys(clientErrors).length === 0,
    [clientErrors],
  );

  function set<K extends keyof JoinUsValues>(field: K, value: JoinUsValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function touch(field: keyof JoinUsValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid) return;

    setLoading(true);
    setStatus("idle");

    try {
      await api.post("/public/joinus", values);

      setStatus("success");
      setMessage("Thanks for your interest! We'll be in touch soon.");
      setValues({ fullName: "", mobileNumber: "", email: "", cityId: 0 });
      setTouched({});
      setSubmitted(false);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cityGroups = useMemo(() => {
    const grouped: Record<string, { label: string; value: string }[]> = {};
    for (const city of cities) {
      if (!grouped[city.countryName]) grouped[city.countryName] = [];
      grouped[city.countryName].push({ label: city.cityName, value: String(city.id) });
    }
    return Object.entries(grouped).map(([label, options]) => ({ label, options }));
  }, [cities]);

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Join Us
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Share a few details and we&apos;ll get you started on your volunteering journey.
        </p>
      </div>

      {status === "error" && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormInput
          type="text"
          autoComplete="name"
          placeholder="Full Name *"
          icon={Users}
          value={values.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          onBlur={() => touch("fullName")}
          error={visibleError("fullName")}
        />

        <FormInput
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Mobile Number *"
          icon={Phone}
          value={values.mobileNumber}
          onChange={(e) => set("mobileNumber", e.target.value)}
          onBlur={() => {
            const normalized = normalizeMobileNumber(values.mobileNumber);
            if (normalized) set("mobileNumber", normalized);
            touch("mobileNumber");
          }}
          error={visibleError("mobileNumber")}
        />

        <FormInput
          type="email"
          autoComplete="email"
          placeholder="Email Address *"
          icon={Mail}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => touch("email")}
          error={visibleError("email")}
        />

        <FormSelect
          placeholder="Select City *"
          groups={cityGroups}
          value={values.cityId ? String(values.cityId) : ""}
          onValueChange={(id) => {
            set("cityId", Number(id));
            touch("cityId");
          }}
          icon={MapPin}
          error={visibleError("cityId")}
        />

        <motion.button
          type="submit"
          disabled={loading || (submitted && !isFormValid)}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all",
            isFormValid && !loading
              ? "bg-gradient-to-r from-[#1a6b3c] to-[#14512f] shadow-lg shadow-[#1a6b3c]/20 hover:from-[#1f7a45] hover:to-[#166534]"
              : "cursor-not-allowed bg-slate-300 shadow-none dark:bg-slate-700",
          )}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting…
            </>
          ) : (
            <>
              Join Us
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
