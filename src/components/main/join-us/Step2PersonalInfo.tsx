"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Mail, MapPin, Phone, Users } from "lucide-react";
import { motion } from "framer-motion";
import { JoinUsSchema, normalizeMobileNumber } from "@/core/validators/joinUsValidation";
import { cn } from "@/lib/utils";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import ProgressSteps from "./ProgressSteps";
import type { City, PersonalInfoData } from "./types";

type FieldKey = Exclude<keyof PersonalInfoData, "cityId">;
type FieldErrors = Partial<Record<keyof PersonalInfoData, string>>;

function validate(data: PersonalInfoData): FieldErrors {
  // JoinUsSchema uses z.coerce.number() for age, so passing age as string works fine
  const result = JoinUsSchema.safeParse(data);
  if (result.success) return {};
  const flat = result.error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flat).map(([k, msgs]) => [k, msgs?.[0]]),
  ) as FieldErrors;
}

interface Props {
  cities: City[];
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PersonalInfo({ cities, data, onChange, onNext, onBack }: Props) {
  const [touched, setTouched] = useState<Partial<Record<keyof PersonalInfoData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(data), [data]);
  const isValid = Object.keys(errors).length === 0;

  function touch(key: keyof PersonalInfoData) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function visibleError(key: keyof PersonalInfoData) {
    return submitted || touched[key] ? errors[key] : undefined;
  }

  function fieldProps(key: FieldKey): React.InputHTMLAttributes<HTMLInputElement> & { error?: string } {
    return {
      value: data[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange({ ...data, [key]: e.target.value }),
      onBlur: () => touch(key),
      error: visibleError(key),
    };
  }

  const cityGroups = useMemo(() => {
    const grouped: Record<string, { label: string; value: string }[]> = {};
    for (const city of cities) {
      if (!grouped[city.countryName]) grouped[city.countryName] = [];
      grouped[city.countryName].push({ label: city.cityName, value: String(city.id) });
    }
    return Object.entries(grouped).map(([label, options]) => ({ label, options }));
  }, [cities]);

  function handleContinue() {
    setSubmitted(true);
    if (!isValid) return;
    onNext();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
      <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left: Progress (desktop only) */}
        <div className="hidden lg:block">
          <ProgressSteps currentStep={1} />
        </div>

        {/* Right: Form card */}
        <div className="w-full lg:ml-auto lg:max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-green-900/30 dark:bg-[#0f2818] dark:shadow-[0_18px_70px_rgba(0,0,0,0.4)] sm:p-8">

            <button
              onClick={onBack}
              className="mb-5 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Tell us about yourself
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Just a few quick things.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your name
                </label>
                <FormInput
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Priya Sharma"
                  icon={Users}
                  {...fieldProps("fullName")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your WhatsApp number
                </label>
                <FormInput
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="e.g. 98765 43210"
                  icon={Phone}
                  value={data.mobileNumber}
                  onChange={(e) => onChange({ ...data, mobileNumber: e.target.value })}
                  onBlur={() => {
                    const normalized = normalizeMobileNumber(data.mobileNumber);
                    if (normalized) onChange({ ...data, mobileNumber: normalized });
                    touch("mobileNumber");
                  }}
                  error={visibleError("mobileNumber")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your email address
                </label>
                <FormInput
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. priya@example.com"
                  icon={Mail}
                  {...fieldProps("email")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your age
                </label>
                <FormInput
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 24"
                  icon={Calendar}
                  min={13}
                  max={100}
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={data.age}
                  onChange={(e) => onChange({ ...data, age: e.target.value })}
                  onBlur={() => touch("age")}
                  error={visibleError("age")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Which city are you in?
                </label>
                <FormSelect
                  placeholder="Select your city"
                  groups={cityGroups}
                  value={data.cityId ? String(data.cityId) : ""}
                  onValueChange={(id) => {
                    onChange({ ...data, cityId: Number(id) });
                    touch("cityId");
                  }}
                  icon={MapPin}
                  error={visibleError("cityId")}
                />
              </div>
            </div>

            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
                isValid
                  ? "bg-[#1a6b3c] text-white shadow-lg shadow-[#1a6b3c]/25 hover:bg-[#1f7a45]"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500",
              )}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </motion.button>

          </div>
        </div>

      </div>
    </div>
  );
}
