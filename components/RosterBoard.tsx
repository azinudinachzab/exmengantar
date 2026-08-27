"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Profile } from "@/lib/types";
import { ProfileCard } from "./ProfileCard";
import { MultiSelectFilter } from "./MultiSelectFilter";

export function RosterBoard({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditable
      ) {
        return;
      }

      event.preventDefault();
      searchInputRef.current?.focus();
    };

    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => p.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [profiles]);

  const allTitles = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => set.add(p.title));
    return Array.from(set).sort();
  }, [profiles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.previousCompany.some((s) => s.toLowerCase().includes(q)) ||
        p.skills.some((s) => s.toLowerCase().includes(q));
      const matchesSkill =
        skillFilter.length === 0 || skillFilter.some((s) => p.skills.includes(s));
      const matchesTitle =
        titleFilter.length === 0 || titleFilter.includes(p.title);
      return matchesQuery && matchesSkill && matchesTitle;
    });
  }, [profiles, query, skillFilter, titleFilter]);

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:flex-wrap">
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, title, company, or skill…"
          className="flex-1 rounded-sm border border-line bg-paper-raised px-4 py-2.5 text-sm placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-signal/40"
        />
        <MultiSelectFilter
          label="All titles"
          options={allTitles}
          selected={titleFilter}
          onChange={setTitleFilter}
          allLabel="All titles"
        />
        <MultiSelectFilter
          label="All skills"
          options={allSkills}
          selected={skillFilter}
          onChange={setSkillFilter}
          allLabel="All skills"
          searchable
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line py-16 text-center">
          <p className="font-display text-lg text-ink">
            No one matches that search.
          </p>
          <p className="text-sm text-ink-soft mt-1">
            Try a different name, skill, or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((profile, i) => (
            <ProfileCard key={profile.id} profile={profile} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
