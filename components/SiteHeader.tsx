import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80 sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl font-medium tracking-tight text-ink group-hover:opacity-80">
            Ex-Mengantar IT Team
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-soft hidden sm:inline">
            open to work
          </span>
        </Link>
        {/* <nav className="flex items-center gap-6 font-mono text-[13px] uppercase tracking-wide">
          <Link href="/" className="text-ink-soft hover:text-ink transition-colors">
            Roster
          </Link>
          <Link
            href="/dashboard"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            Dashboard
          </Link>
        </nav> */}
        <a
          href="/api/download-profiles"
          className="rounded-md border border-gold/40 bg-gold-soft px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-gold/60 transition-colors"
        >
          Download All Profiles
        </a>
      </div>
    </header>
  );
}
