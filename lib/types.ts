export interface Profile {
  id: string;
  name: string;
  title: string;          // e.g. "Senior Product Designer"
  previousCompany: string[];
  location: string;
  bio: string;
  skills: string[];
  openToRoles: string[];  // e.g. ["Full-time", "Contract"]
  layoffDate: string;     // ISO date string, e.g. "2026-06-01"
  email: string;
  linkedin?: string;
  portfolio?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProfileInput = Omit<Profile, "id" | "createdAt" | "updatedAt">;
