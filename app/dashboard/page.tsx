import Link from "next/link";
import { getProfiles } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { DashboardTable } from "@/components/DashboardTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profiles = await getProfiles();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
                Dashboard
              </p>
              <h1 className="font-display text-3xl text-ink">Manage the roster</h1>
              <p className="text-sm text-ink-soft mt-1">
                Add, edit, or remove profiles. Changes go live on the public
                roster immediately.
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="shrink-0 rounded-sm bg-ink text-paper px-4 py-2.5 text-sm font-medium hover:bg-ink/90 text-center"
            >
              + Add a profile
            </Link>
          </div>

          <DashboardTable profiles={profiles} />
        </div>
      </main>
    </>
  );
}
