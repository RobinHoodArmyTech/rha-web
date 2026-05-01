"use client";

import { useEffect, useState } from "react";
import { api } from "@/core/services/http";
import { normalizeMobileNumber } from "@/core/validators/joinUsValidation";
import Step1Intro from "./Step1Intro";
import Step2PersonalInfo from "./Step2PersonalInfo";
import Step3Values from "./Step3Values";
import Step4Welcome from "./Step4Welcome";
import type { City, PersonalInfoData } from "./types";

const INITIAL_DATA: PersonalInfoData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  age: "",
  cityId: 0,
};

export default function JoinUsFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cities, setCities] = useState<City[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api
      .get<{ data: City[] }>("/master/cities")
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/auth/signup", {
        fullName: personalInfo.fullName,
        mobileNumber: normalizeMobileNumber(personalInfo.mobileNumber),
        email: personalInfo.email,
        age: personalInfo.age, // z.coerce.number() on server handles string → number
        cityId: personalInfo.cityId,
      });
      setStep(4);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {step === 1 && <Step1Intro onNext={() => setStep(2)} />}

      {step === 2 && (
        <Step2PersonalInfo
          cities={cities}
          data={personalInfo}
          onChange={setPersonalInfo}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3Values
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
        />
      )}

      {step === 4 && <Step4Welcome name={personalInfo.fullName} />}
    </>
  );
}
