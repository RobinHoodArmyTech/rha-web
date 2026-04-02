/**
 * Checkin domain types.
 */

export interface BadgeType {
  name: string;
  drives: number;
  icon: "medal" | "compass" | "helmet" | "shield";
  description: string;
}

export interface CheckInPhoto {
  id: number;
  imageUrl: string;
  city: string;
  timeAgo: string;
  volunteer: string;
}

export interface CityStats {
  city: string;
  checkIns: number;
}

export interface CheckInSubmission {
  photoFile: File;
  city: string;
  notes?: string;
}

export interface CheckInRecord {
  id: string;
  userId: string;
  city: string;
  notes?: string;
  photoUrl: string;
  createdAt: string;
}
