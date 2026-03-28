import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiError, ApiResponse } from "@/core/apiResponse";
import { signupSchema } from "@/core/validators/auth";
import { createSignup } from "@/core/services/backend/auth/signupService";

/**
 * POST /api/v1/auth/signup — collect signup information (public)
 */
export const POST = withApiHandler(async (request) => {
  const body = await request.json().catch((err) => {
    console.error("Failed to parse request body:", err);
    throw new ApiError(400, "Invalid request body");
  });
  const data = signupSchema.parse(body);

  const signup = await createSignup(data);

  return ApiResponse.success({
    data: {
      id: signup.id,
      full_name: signup.full_name,
      email: signup.email,
      phone: signup.phone,
      city: signup.city,
    },
    message: "Signup successful",
  });
});
