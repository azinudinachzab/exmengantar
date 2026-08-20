import { notFound } from "next/navigation";
import { getProfile } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { ProfileForm } from "@/components/ProfileForm";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
            Dashboard / Edit
          </p>
          <h1 className="font-display text-3xl text-ink mb-8">
            Edit {profile.name}&rsquo;s profile
          </h1>
          <ProfileForm mode="edit" profileId={profile.id} initial={profile} />
        </div>
      </main>
    </>
  );
}
