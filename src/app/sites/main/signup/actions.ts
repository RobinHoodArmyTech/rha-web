"use server";

import {
  normalizeMobileNumber,
  validateSignupValues,
  type SignupFormState,
} from "@/domains/main/lib/signupValidation";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitSignup(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const values = {
    helpType: readString(formData, "helpType"),
    fullName: readString(formData, "fullName"),
    mobileNumber: readString(formData, "mobileNumber"),
    email: readString(formData, "email"),
    age: readString(formData, "age"),
    facebookProfile: readString(formData, "facebookProfile"),
    city: readString(formData, "city"),
    locality: readString(formData, "locality"),
    thoughts: readString(formData, "thoughts"),
    agreedToPrinciples: formData.get("agreedToPrinciples") === "on",
  };

  const fieldErrors = validateSignupValues(values);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const payload = {
    ...values,
    mobileNumber: normalizeMobileNumber(values.mobileNumber),
  };

  // Backend integration will replace this step later. The action is already in
  // place, so the form flow can be wired to a real API without changing the UI.
  console.info("Signup submission ready for backend integration", payload);

  return {
    status: "success",
    message:
      "Thanks for joining the Robin family. Your signup is ready for our team to review.",
    fieldErrors: {},
  };
}

