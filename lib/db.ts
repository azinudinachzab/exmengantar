import { promises as fs } from "fs";
import path from "path";
import { Profile, ProfileInput } from "./types";

// NOTE: This uses a local JSON file as a lightweight "database". It's great
// for local development and small deployments (e.g. a single persistent
// server or a VM). On serverless platforms with an ephemeral/read-only
// filesystem (e.g. default Vercel deployments) writes will NOT persist
// across requests. Swap this file for a real database (Postgres, SQLite via
// Turso, Supabase, etc.) before going to production. The function
// signatures below are written so that swap is a drop-in replacement.

const DATA_FILE = path.join(process.cwd(), "data", "profiles.json");

async function readAll(): Promise<Profile[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Profile[];
}

async function writeAll(profiles: Profile[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(profiles, null, 2), "utf-8");
}

export async function getProfiles(): Promise<Profile[]> {
  const profiles = await readAll();
  // newest first
  return profiles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const profiles = await readAll();
  return profiles.find((p) => p.id === id);
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  const profiles = await readAll();
  const now = new Date().toISOString();
  const newProfile: Profile = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  profiles.push(newProfile);
  await writeAll(profiles);
  return newProfile;
}

export async function updateProfile(
  id: string,
  input: Partial<ProfileInput>
): Promise<Profile | undefined> {
  const profiles = await readAll();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  profiles[idx] = {
    ...profiles[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await writeAll(profiles);
  return profiles[idx];
}

export async function deleteProfile(id: string): Promise<boolean> {
  const profiles = await readAll();
  const next = profiles.filter((p) => p.id !== id);
  if (next.length === profiles.length) return false;
  await writeAll(next);
  return true;
}
