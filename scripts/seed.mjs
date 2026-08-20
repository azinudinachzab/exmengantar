// Seeds Upstash Redis with the sample profiles in data/profiles.json.
// Run with your Upstash credentials available as env vars, e.g.:
//   node --env-file=.env.local scripts/seed.mjs
//
// Safe to run more than once — it overwrites profiles with the same id
// rather than duplicating them.

import { Redis } from "@upstash/redis";
import { readFile } from "fs/promises";
import path from "path";

const redis = Redis.fromEnv();

const PROFILE_KEY = (id) => `profile:${id}`;
const INDEX_KEY = "profiles:index";

async function seed() {
  const filePath = path.join(process.cwd(), "data", "profiles.json");
  const raw = await readFile(filePath, "utf-8");
  const profiles = JSON.parse(raw);

  for (const profile of profiles) {
    await redis.set(PROFILE_KEY(profile.id), profile);
    await redis.zadd(INDEX_KEY, {
      score: new Date(profile.createdAt).getTime(),
      member: profile.id,
    });
    console.log(`Seeded: ${profile.name}`);
  }

  console.log(`\nDone. Seeded ${profiles.length} profiles.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
