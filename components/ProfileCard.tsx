import Link from "next/link";
import { Profile } from "@/lib/types";
import { SkillsDisplay } from "./SkillsDisplay";

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

export function ProfileCard({ profile, index }: { profile: Profile; index: number }) {
  return (
    <article className="group relative rounded-sm border border-line bg-paper-raised p-6 flex flex-col gap-4 transition-shadow hover:shadow-[0_2px_0_0_var(--ink)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 rounded-full bg-ink text-paper flex items-center justify-center font-display text-sm">
            {initials(profile.name)}
          </div>
          <div>
            <h3 className="font-display text-xl leading-tight text-ink">
              <Link
                href={`/people/${profile.id}`}
                className="hover:text-gold transition-colors"
              >
                {profile.name}
              </Link>
            </h3>
            <p className="text-sm text-ink-soft leading-snug">{profile.title}</p>
          </div>
        </div>
        <span className="roster-number text-xs text-ink-soft/70 pt-1">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
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

      <p
        tabIndex={0}
        className="text-sm text-ink-soft leading-relaxed line-clamp-3 cursor-help hover:line-clamp-none focus:line-clamp-none focus:outline-none"
      >
        {profile.bio}
      </p>

      <div className="text-xs text-ink-soft space-y-1">
        {profile.previousCompany.length > 0 && (
          <p>
            <span className="text-ink-soft/60">Previously</span>{" "}
            <span className="text-ink">{profile.previousCompany.join(", ")}</span>
          </p>
        )}
        {profile.location && (
          <p>
            <span className="text-ink-soft/60">Based in</span>{" "}
            <span className="text-ink">{profile.location}</span>
          </p>
        )}
      </div>

      {profile.skills.length > 0 && (
        <SkillsDisplay 
          skills={profile.skills}
          maxVisible={6}
          showMoreLabel="show more"
        />
      )}

      <div className="mt-auto pt-3 border-t border-line flex items-center gap-4 text-sm">
        <a
          href={`mailto:${profile.email}`}
          className="font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
        >
          Contact
        </a>
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft hover:text-ink"
          >
            LinkedIn
          </a>
        )}
        {profile.portfolio && (
          <a
            href={profile.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft hover:text-ink"
          >
            Portfolio
          </a>
        )}
      </div>
    </article>
  );
}
