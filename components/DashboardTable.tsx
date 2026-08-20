"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Profile } from "@/lib/types";

export function DashboardTable({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} from the roster? This can't be undone.`)) return;
    setError(null);
    setPendingId(id);
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      startTransition(() => router.refresh());
    } catch {
      setError("Couldn't delete that profile. Try again.");
    } finally {
      setPendingId(null);
    }
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line py-16 text-center">
        <p className="font-display text-lg text-ink">The roster is empty.</p>
        <p className="text-sm text-ink-soft mt-1 mb-5">
          Add the first profile to get it in front of hiring teams.
        </p>
        <Link
          href="/dashboard/new"
          className="inline-block rounded-sm bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-ink/90"
        >
          Add a profile
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-sm border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-sm border border-line bg-paper-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">
                Previous company
              </th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">
                Updated
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p, i) => (
              <tr
                key={p.id}
                className="border-b border-line last:border-0 hover:bg-paper transition-colors"
              >
                <td className="px-4 py-3 roster-number text-ink-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink-soft">{p.title}</td>
                <td className="px-4 py-3 text-ink-soft hidden md:table-cell">
                  {p.previousCompany.length > 0 ? p.previousCompany.join(", ") : "—"}
                </td>
                <td className="px-4 py-3 text-ink-soft hidden lg:table-cell font-mono text-xs">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/dashboard/${p.id}/edit`}
                      className="text-ink-soft hover:text-ink underline underline-offset-4 decoration-line"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={isPending && pendingId === p.id}
                      className="text-danger hover:text-danger/80 underline underline-offset-4 decoration-danger/30 disabled:opacity-50"
                    >
                      {isPending && pendingId === p.id ? "Removing…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
