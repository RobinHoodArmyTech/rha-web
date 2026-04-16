import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiError, ApiResponse } from "@/core/apiResponse";
import { JoinUsSchema, normalizeMobileNumber } from "@/core/validators/joinUsValidation";
import { createSignup } from "@/core/services/backend/auth/signupService";
import { sendSignupEmail } from "@/core/services/backend/email/emailService";

/**
 * POST /api/v1/auth/signup — collect join-us information (public)
 */
export const POST = withApiHandler(async (request) => {
  const body = await request.json().catch((err) => {
    console.error("Failed to parse request body:", err);
    throw new ApiError(400, "Invalid request body");
  });

  const data = JoinUsSchema.parse(body);
  const normalized = { ...data, mobileNumber: normalizeMobileNumber(data.mobileNumber) };

  const signup = await createSignup(normalized);

  sendSignupEmail(signup.email).catch((err) =>
    console.error("Failed to send signup email:", err)
  );

  return ApiResponse.success({
    data: {
      id: signup.id,
      fullName: signup.fullName,
      email: signup.email,
      mobileNumber: signup.mobileNumber,
      cityId: signup.cityId,
    },
    message: "Signup successful",
  });
});
