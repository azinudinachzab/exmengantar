"use client";

import React, { useState } from "react";

interface SkillsDisplayProps {
  skills: string[];
  maxVisible?: number;
  showMoreLabel?: string;
  showLessLabel?: string;
}

export function SkillsDisplay({ 
  skills, 
  maxVisible = 6, 
  showMoreLabel = "show more",
  showLessLabel = "show less"
}: SkillsDisplayProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? skills : skills.slice(0, maxVisible);
  const hasMore = skills.length > maxVisible;
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleSkills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-gold/40 bg-gold-soft px-2.5 py-0.5 text-[11px] text-ink"
        >
          {skill}
        </span>
      ))}
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="underline px-2.5 py-0.5 text-[11px] text-ink cursor-pointer hover:bg-gold/60 transition-colors"
        >
          {showAll ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
}