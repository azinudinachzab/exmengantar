import { NextRequest, NextResponse } from "next/server";
import { createProfile, getProfiles } from "@/lib/db";
import { ProfileInput } from "@/lib/types";

export async function GET() {
  const profiles = await getProfiles();
  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ProfileInput;

  if (!body.name || !body.title || !body.email) {
    return NextResponse.json(
      { error: "name, title, and email are required" },
      { status: 400 }
    );
  }

  const profile = await createProfile({
    name: body.name,
    title: body.title,
    previousCompany: body.previousCompany ?? [],
    location: body.location ?? "",
    bio: body.bio ?? "",
    skills: body.skills ?? [],
    openToRoles: body.openToRoles ?? [],
    layoffDate: body.layoffDate ?? "",
    email: body.email,
    linkedin: body.linkedin ?? "",
    portfolio: body.portfolio ?? "",
    photoUrl: body.photoUrl ?? "",
  });

  return NextResponse.json(profile, { status: 201 });
}
