import { getProfiles } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { RosterBoard } from "@/components/RosterBoard";

export default async function HomePage() {
  const profiles = await getProfiles();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
            <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
              {profiles.length} {profiles.length === 1 ? "person" : "people"} ready to hire
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] max-w-2xl text-ink">
              IT Engineers, Products, and Designers.
            </h1>
            <p className="mt-5 max-w-xl text-ink-soft leading-relaxed">
              This is a roster of former colleagues affected by layoffs. Every
              person here has been vetted by someone who worked alongside
              them. If you&rsquo;re hiring, start below — reach out directly.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <RosterBoard profiles={profiles} />
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <p>Built by the people on this list, for the people on this list.</p>
          {/* <a href="/dashboard" className="font-mono uppercase tracking-wide hover:text-ink">
            Manage the roster →
          </a> */}
        </div>
      </footer>
    </>
  );
}
