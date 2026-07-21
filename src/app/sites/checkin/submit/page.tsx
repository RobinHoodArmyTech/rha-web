"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Users, GraduationCap, Upload, CheckCircle, X } from "lucide-react";
import Image from "next/image";
import type { CityWithCountry } from "@/core/services/backend/city/cityService";
import {
  CreateCheckinSchema,
  ALLOWED_SELFIE_TYPES,
  isAllowedSelfieType,
  MAX_SELFIE_BYTES,
} from "@/core/validators/checkinValidation";
import { api } from "@/lib/http";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#0a1a0f] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all";

// How the server wants the selfie uploaded (see /api/v1/checkin/presign).
type UploadPlan =
  | { strategy: "proxy" }
  | { strategy: "s3"; url: string; fields: Record<string, string>; key: string };

/**
 * Downscale + re-encode a selfie to keep uploads small (phone photos are large).
 * Best-effort: falls back to the original file if the browser can't decode it
 * (e.g. some HEIC images).
 */
async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob) return file;
    return new File([blob], "selfie.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function CheckInSubmitPage() {
  const [cities, setCities] = useState<{ id: number; cityName: string }[]>([]);
  const [cityId, setCityId] = useState("");
  const [peopleServed, setPeopleServed] = useState("0");
  const [studentsTaught, setStudentsTaught] = useState("0");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load the real city list (same public endpoint the join-us form uses).
  useEffect(() => {
    api
      .get<{ data: CityWithCountry[] }>("/public/city")
      .then((res) =>
        setCities(
          (res.data ?? [])
            .map((c) => ({ id: c.id, cityName: c.cityName }))
            .sort((a, b) => a.cityName.localeCompare(b.cityName)),
        ),
      )
      .catch((err) => console.error(err));
  }, []);

  const selectedCityName = useMemo(
    () => cities.find((c) => String(c.id) === cityId)?.cityName ?? "",
    [cities, cityId],
  );

  // Validate the fields against the SAME schema the API enforces (single source
  // of truth): cityId required + at least one of people/students > 0.
  const fieldsValid = useMemo(
    () =>
      CreateCheckinSchema.safeParse({
        cityId: cityId ? Number(cityId) : undefined,
        peopleServed: peopleServed === "" ? 0 : Number(peopleServed),
        studentsTaught: studentsTaught === "" ? 0 : Number(studentsTaught),
      }).success,
    [cityId, peopleServed, studentsTaught],
  );
  const hasCount = Number(peopleServed || 0) + Number(studentsTaught || 0) > 0;
  const canSubmit = !!photoFile && fieldsValid && !loading;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !photoFile) return;
    setLoading(true);
    setError(null);
    try {
      const selfie = await compressImage(photoFile);

      // Check type + size BEFORE requesting an upload — no point presigning a
      // file the API will reject anyway.
      if (!isAllowedSelfieType(selfie.type)) {
        setError("Please upload a JPG, PNG, WebP or HEIC image.");
        return;
      }
      if (selfie.size > MAX_SELFIE_BYTES) {
        setError("The selfie must be under 10MB. Please choose a smaller photo.");
        return;
      }

      // Ask the backend how to upload. The server holds the AWS creds and mints
      // the presigned POST — the client never sees any credentials.
      const prep = await api.post<{ data: UploadPlan }>("/checkin/presign", {
        contentType: selfie.type,
      });
      const plan = prep.data;

      if (plan.strategy === "s3") {
        // Upload straight to S3; its presigned policy re-enforces size + type.
        const s3Form = new FormData();
        Object.entries(plan.fields).forEach(([k, v]) => s3Form.append(k, v));
        s3Form.append("file", selfie);
        const upload = await fetch(plan.url, { method: "POST", body: s3Form });
        if (!upload.ok) {
          // S3 returns an XML body with a <Code> (AccessDenied, SignatureDoesNotMatch,
          // EntityTooLarge, ...) — log it so failures are diagnosable.
          const detail = await upload.text().catch(() => "");
          console.error("S3 upload failed:", upload.status, detail);
          throw new Error("Upload failed. Please try again.");
        }

        // Record the check-in against the just-uploaded object.
        await api.post("/checkin", {
          cityId: Number(cityId),
          peopleServed: Number(peopleServed || 0),
          studentsTaught: Number(studentsTaught || 0),
          photoKey: plan.key,
        });
      } else {
        // Dev/local: proxy the file through our own API.
        const form = new FormData();
        form.set("cityId", cityId);
        form.set("peopleServed", peopleServed || "0");
        form.set("studentsTaught", studentsTaught || "0");
        form.set("selfie", selfie);
        const res = await fetch("/api/v1/checkin", { method: "POST", body: form });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(body.message ?? "Submission failed");
        }
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSubmitted(false);
    clearPhoto();
    setCityId("");
    setPeopleServed("0");
    setStudentsTaught("0");
    setError(null);
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#0f2818] rounded-3xl border border-green-200 dark:border-green-900/40 p-10 max-w-md w-full text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#1a6b3c] dark:text-[#4ade80]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Check-In Recorded!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your drive in{" "}
            <span className="font-semibold text-[#1a6b3c] dark:text-[#4ade80]">{selectedCityName}</span>{" "}
            has been saved. Keep spreading the love!
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1a6b3c] to-[#166534] text-white font-semibold rounded-xl hover:from-[#22c55e] hover:to-[#16a34a] transition-all"
          >
            Submit Another
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50 dark:bg-[#060f09]">
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto mb-6 text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Submit Your Drive</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Log how many you served, add a selfie, and pick your city.
          </p>
        </div>
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          noValidate
          className="max-w-lg mx-auto bg-white dark:bg-[#0f2818] rounded-3xl border border-gray-100 dark:border-green-900/30 p-8 shadow-xl space-y-6"
        >
          {/* People served + Students taught */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> People Served
              </label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={peopleServed}
                onChange={(e) => setPeopleServed(e.target.value)}
                onFocus={(e) => e.target.select()}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> Students Taught
              </label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={studentsTaught}
                onChange={(e) => setStudentsTaught(e.target.value)}
                onFocus={(e) => e.target.select()}
                className={inputClass}
              />
            </div>
          </div>
          {!hasCount && (
            <p className="-mt-3 text-xs text-gray-400">Enter at least one person served or student taught.</p>
          )}

          {/* Photo upload */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> Drive Selfie *
            </label>
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED_SELFIE_TYPES.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden h-52">
                <Image src={photoPreview} alt="Preview" fill className="object-cover" sizes="(max-width: 640px) 100vw, 512px" unoptimized />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-52 rounded-2xl border-2 border-dashed border-gray-200 dark:border-green-900/40 hover:border-[#22c55e] hover:bg-green-50 dark:hover:bg-green-900/10 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500"
              >
                <Upload className="w-8 h-8" />
                <span className="text-sm font-medium">Click to upload photo</span>
                <span className="text-xs">JPG, PNG, WEBP up to 10MB</span>
              </button>
            )}
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1a6b3c] dark:text-[#4ade80]" /> City *
            </label>
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} required className={inputClass}>
              <option value="">{cities.length ? "Select your city" : "Loading cities…"}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.cityName}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            className="w-full py-3.5 bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Submit Check-In</>
            )}
          </motion.button>
        </motion.form>
      </section>
    </main>
  );
}
