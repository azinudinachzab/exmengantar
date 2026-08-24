"use client";

import { useEffect, useRef, useState } from "react";

interface TitleFilterProps {
  titles: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function TitleFilter({ titles, selected, onChange }: TitleFilterProps) {
  const [open, setOpen] = useState(false);
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

  const displayText =
    selected.length === 0
      ? "All titles"
      : selected.length === 1
        ? selected[0]
        : `${selected.length} titles selected`;

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-sm border border-line bg-paper-raised px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/40 sm:min-w-[180px] justify-between"
      >
        <span>{displayText}</span>
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
          <label className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-paper cursor-pointer border-b border-line">
            <input
              type="checkbox"
              checked={selected.length === 0}
              onChange={() => onChange([])}
              className="rounded-sm border-line text-signal focus:ring-signal/40"
            />
            All titles
          </label>
          {titles.map((title) => (
            <label
              key={title}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-paper cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(title)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, title]);
                  } else {
                    onChange(selected.filter((t) => t !== title));
                  }
                }}
                className="rounded-sm border-line text-signal focus:ring-signal/40"
              />
              {title}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
