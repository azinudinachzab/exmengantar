"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Profile, ProfileInput } from "@/lib/types";

const ROLE_OPTIONS = ["Full-time", "Contract", "Fractional", "Freelance", "Internship"];

type Props = {
  mode: "create" | "edit";
  profileId?: string;
  initial?: Profile;
};

function toCsv(arr: string[]) {
  return arr.join(", ");
}

function fromCsv(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProfileForm({ mode, profileId, initial }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    title: initial?.title ?? "",
    previousCompany: toCsv(initial?.previousCompany ?? []),
    location: initial?.location ?? "",
    bio: initial?.bio ?? "",
    skills: toCsv(initial?.skills ?? []),
    openToRoles: initial?.openToRoles ?? [],
    layoffDate: initial?.layoffDate?.slice(0, 10) ?? "",
    email: initial?.email ?? "",
    linkedin: initial?.linkedin ?? "",
    portfolio: initial?.portfolio ?? "",
    photoUrl: initial?.photoUrl ?? "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleRole(role: string) {
    setForm((f) => ({
      ...f,
      openToRoles: f.openToRoles.includes(role)
        ? f.openToRoles.filter((r) => r !== role)
        : [...f.openToRoles, role],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.title.trim() || !form.email.trim()) {
      setError("Name, title, and email are required.");
      return;
    }

    const payload: ProfileInput = {
      name: form.name.trim(),
      title: form.title.trim(),
      previousCompany: fromCsv(form.previousCompany),
      location: form.location.trim(),
      bio: form.bio.trim(),
      skills: fromCsv(form.skills),
      openToRoles: form.openToRoles,
      layoffDate: form.layoffDate,
      email: form.email.trim(),
      linkedin: form.linkedin.trim(),
      portfolio: form.portfolio.trim(),
      photoUrl: form.photoUrl.trim(),
    };

    setSubmitting(true);
    try {
      const res = await fetch(
        mode === "create" ? "/api/profiles" : `/api/profiles/${profileId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Request failed");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong saving this profile. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-paper-raised px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/40";
  const labelClass = "block text-xs font-mono uppercase tracking-wide text-ink-soft mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <p className="rounded-sm border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full name *</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jordan Reyes"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jordan@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Title / role *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Senior Frontend Engineer"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Previous company (comma-separated)</label>
          <input
            className={inputClass}
            value={form.previousCompany}
            onChange={(e) => update("previousCompany", e.target.value)}
            placeholder="Acme Corp"
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            className={inputClass}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Denver, CO (Remote OK)"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea
          className={inputClass}
          rows={4}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="A few sentences on impact and experience — what a hiring manager should know."
        />
      </div>

      <div>
        <label className={labelClass}>Skills (comma-separated)</label>
        <input
          className={inputClass}
          value={form.skills}
          onChange={(e) => update("skills", e.target.value)}
          placeholder="React, TypeScript, GraphQL"
        />
      </div>

      <div>
        <label className={labelClass}>Open to</label>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((role) => {
            const active = form.openToRoles.includes(role);
            return (
              <button
                type="button"
                key={role}
                onClick={() => toggleRole(role)}
                className={`rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-colors ${
                  active
                    ? "border-signal bg-signal-soft text-signal"
                    : "border-line text-ink-soft hover:border-ink-soft"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Layoff date</label>
          <input
            type="date"
            className={inputClass}
            value={form.layoffDate}
            onChange={(e) => update("layoffDate", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input
            className={inputClass}
            value={form.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Portfolio / website URL</label>
        <input
          className={inputClass}
          value={form.portfolio}
          onChange={(e) => update("portfolio", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-sm bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Add to roster"
              : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-sm text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
