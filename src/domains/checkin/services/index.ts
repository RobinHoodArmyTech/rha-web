/**
 * Checkin domain service — all check-in related API calls.
 * Replace stubs with real implementation when backend is ready.
 */
import { api } from "@/core/services/http";
import type { CheckInRecord, CheckInSubmission } from "@/domains/checkin/types";

export async function submitCheckIn(_payload: CheckInSubmission): Promise<CheckInRecord> {
  // TODO: multipart/form-data POST to /api/v1/checkin
  return api.post<CheckInRecord>("/checkin", _payload);
}

export async function getRecentCheckIns(): Promise<CheckInRecord[]> {
  // TODO: GET /api/v1/checkin
  return api.get<CheckInRecord[]>("/checkin");
}
