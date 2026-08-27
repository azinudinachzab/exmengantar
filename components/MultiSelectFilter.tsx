"use client";

import { useEffect, useRef, useState } from "react";

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allLabel?: string;
  searchable?: boolean;
}

export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  allLabel,
  searchable = false,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatSelected = (selected: string[]) => {
    if (selected.length === 1) {
      return selected[0];
    } else if (selected.length === 2) {
      return `${selected[0]} and ${selected[1]}`;
    } else {
      const last = selected[selected.length - 1];
      const rest = selected.slice(0, -1).join(", ");
      return `${rest}, and ${last}`;
    }
  }

  const displayText =
    selected.length === 0 ? label : formatSelected(selected);

  const visibleOptions = searchable
    ? options.filter((o) => o.toLowerCase().includes(search.trim().toLowerCase()))
    : options;

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-sm border border-line bg-paper-raised px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/40 sm:min-w-[180px] justify-between"
      >
        <span
          title={selected.length > 0 ? selected.join(", ") : label}
          className="w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {displayText}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full sm:max-w-[320px] rounded-sm border border-line bg-paper-raised shadow-lg max-h-60 overflow-auto">
          {searchable && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="sticky top-0 w-full border-b border-line bg-paper-raised px-4 py-2 text-sm placeholder:text-ink-soft/60 focus:outline-none"
            />
          )}
          {allLabel && (
            <label className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-paper cursor-pointer border-b border-line">
              <input
                type="checkbox"
                checked={selected.length === 0}
                onChange={() => onChange([])}
                className="rounded-sm border-line text-signal focus:ring-signal/40"
              />
              {allLabel}
            </label>
          )}
          {visibleOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-paper cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="rounded-sm border-line text-signal focus:ring-signal/40"
              />
              {option}
            </label>
          ))}
          {visibleOptions.length === 0 && (
            <p className="px-4 py-2 text-sm text-ink-soft">No matches</p>
          )}
        </div>
      )}
    </div>
  );
}
