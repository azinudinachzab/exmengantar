import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { Profile } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SkillsDisplay } from "@/components/SkillsDisplay";

// Redis is the source of truth and the dashboard mutates it anytime, so
// always render fresh — consistent with the roster homepage.
export const dynamic = "force-dynamic";

type PeoplePageProps = PageProps<"/people/[id]">;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function buildDescription(profile: Profile) {
  const bits: string[] = [];
  bits.push(
    profile.bio?.trim() ||
      `${profile.name} is a ${profile.title} who is open to work.`
  );
  if (profile.previousCompany.length > 0) {
    bits.push(`Previously at ${profile.previousCompany.join(", ")}.`);
  }
  if (profile.location) {
    bits.push(`Based in ${profile.location}.`);
  }
  if (profile.skills.length > 0) {
    bits.push(`Skills: ${profile.skills.join(", ")}.`);
  }
  return bits.join(" ");
}

export async function generateMetadata({
  params,
}: PeoplePageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);

  // Unknown or deleted profile: keep crawlers from indexing a soft-404.
  if (!profile) {
    return {
      title: "Profile not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${profile.name} — ${profile.title} | Open to Work`;
  const description = buildDescription(profile);

  return {
    title,
    description,
    alternates: { canonical: `/people/${profile.id}` },
    openGraph: {
      type: "profile",
      url: `/people/${profile.id}`,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProfilePage({ params }: PeoplePageProps) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  // Person rich result: jobTitle, skills, past companies, and sameAs links
  // give search engines exactly what recruiter queries look for.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/people/${profile.id}`,
    dateModified: profile.updatedAt || undefined,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
      description: profile.bio || undefined,
      email: profile.email ? `mailto:${profile.email}` : undefined,
      homeLocation: profile.location
        ? { "@type": "Place", address: profile.location }
        : undefined,
      alumniOf:
        profile.previousCompany.length > 0
          ? profile.previousCompany.map((company) => ({
              "@type": "Organization",
              name: company,
            }))
          : undefined,
      knowsAbout: profile.skills.length > 0 ? profile.skills : undefined,
      sameAs: [profile.linkedin, profile.portfolio].filter(Boolean),
      url: `${SITE_URL}/people/${profile.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink transition-colors"
          >
            &larr; Back to the roster
          </Link>

          <article className="mt-6 rounded-sm border border-line bg-paper-raised p-8 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 shrink-0 rounded-full bg-ink text-paper flex items-center justify-center font-display text-xl">
                {initials(profile.name)}
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
                  {profile.name}
                </h1>
                <p className="mt-1 text-lg text-ink-soft">{profile.title}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <span className="relative status-dot h-1.5 w-1.5 rounded-full bg-signal" />
              <span className="font-mono uppercase tracking-wide text-signal">
                Available now
              </span>
              {profile.layoffDate && (
                <span className="text-ink-soft/70">
                  · laid off {formatDate(profile.layoffDate)}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="mt-6 text-ink leading-relaxed">{profile.bio}</p>
            )}

            {(profile.previousCompany.length > 0 ||
              profile.location ||
              profile.openToRoles.length > 0) && (
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm border-t border-line pt-6">
                {profile.previousCompany.length > 0 && (
                  <div>
                    <dt className="font-mono uppercase tracking-wide text-[11px] text-ink-soft/60 mb-1">
                      Previously at
                    </dt>
                    <dd className="text-ink">
                      {profile.previousCompany.join(", ")}
                    </dd>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <dt className="font-mono uppercase tracking-wide text-[11px] text-ink-soft/60 mb-1">
                      Based in
                    </dt>
                    <dd className="text-ink">{profile.location}</dd>
                  </div>
                )}
                {profile.openToRoles.length > 0 && (
                  <div>
                    <dt className="font-mono uppercase tracking-wide text-[11px] text-ink-soft/60 mb-1">
                      Open to
                    </dt>
                    <dd className="text-ink">
                      {profile.openToRoles.join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {profile.skills.length > 0 && (
              <div className="mt-6">
                <SkillsDisplay 
                  skills={profile.skills}
                  maxVisible={6}
                  showMoreLabel="show more"
                />
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center gap-5 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-sm bg-ink text-paper px-4 py-2 font-medium hover:bg-ink/90"
              >
                Contact {profile.name.split(" ")[0]}
              </a>
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-soft hover:text-ink underline decoration-line underline-offset-4"
                >
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-soft hover:text-ink underline decoration-line underline-offset-4"
                >
                  Portfolio
                </a>
              )}
            </div>
          </article>
        </div>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-ink-soft">
          <p>Built by the people on this list, for the people on this list.</p>
        </div>
      </footer>
    </>
  );
}
