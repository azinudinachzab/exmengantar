import { SiteHeader } from "@/components/SiteHeader";
import { ProfileForm } from "@/components/ProfileForm";

export default function NewProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
            Dashboard / New
          </p>
          <h1 className="font-display text-3xl text-ink mb-8">Add a profile</h1>
          <ProfileForm mode="create" />
        </div>
      </main>
    </>
  );
}
