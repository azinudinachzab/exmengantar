import { createClient, RedisClientType } from 'redis';
import { Profile, ProfileInput } from "./types";

// Data layer backed by Redis Cloud (via node-redis), reached through
// REDIS_URL. Works on Vercel's read-only serverless filesystem, unlike a
// local JSON file. Function signatures match the previous versions, so
// nothing outside this module had to change.
//
// Data shape:
//   profile:<id>   -> JSON string of a Profile
//   profiles:index -> sorted set, score = createdAt (ms), member = id
//                      (lets us list newest-first without a full table scan)

let client: RedisClientType | null = null;

// Cache the connection across invocations instead of reconnecting (and
// leaking connections) on every request.
async function getClient(): Promise<RedisClientType> {
  if (client) return client;
  client = createClient({ url: process.env.REDIS_URL }) as RedisClientType;
  client.on("error", (err) => console.error("Redis Client Error", err));
  await client.connect();
  return client;
}

const PROFILE_KEY = (id: string) => `profile:${id}`;
const INDEX_KEY = "profiles:index";

export async function getProfiles(): Promise<Profile[]> {
  const redis = await getClient();

  // newest first
  const ids = await redis.zRange(INDEX_KEY, 0, -1, { REV: true });
  if (ids.length === 0) return [];

  const raw = await Promise.all(ids.map((id) => redis.get(PROFILE_KEY(id))));
  return raw
    .filter((r): r is string => r !== null)
    .map((r) => JSON.parse(r) as Profile);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const redis = await getClient();
  const raw = await redis.get(PROFILE_KEY(id));
  return raw ? (JSON.parse(raw) as Profile) : undefined;
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  const redis = await getClient();
  const now = new Date().toISOString();
  const newProfile: Profile = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  await redis.set(PROFILE_KEY(newProfile.id), JSON.stringify(newProfile));
  await redis.zAdd(INDEX_KEY, { score: Date.now(), value: newProfile.id });

  return newProfile;
}

export async function updateProfile(
  id: string,
  input: Partial<ProfileInput>
): Promise<Profile | undefined> {
  const redis = await getClient();
  const raw = await redis.get(PROFILE_KEY(id));
  if (!raw) return undefined;

  const existing = JSON.parse(raw) as Profile;
  const updated: Profile = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await redis.set(PROFILE_KEY(id), JSON.stringify(updated));
  return updated;
}

export async function deleteProfile(id: string): Promise<boolean> {
  const redis = await getClient();
  const deletedCount = await redis.del(PROFILE_KEY(id));
  if (deletedCount === 0) return false;

  await redis.zRem(INDEX_KEY, id);
  return true;
}