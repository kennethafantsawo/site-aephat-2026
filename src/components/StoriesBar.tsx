"use client";

import { useState } from "react";

const STORIES = [
  { id: "live", label: "En direct", emoji: "🔴", live: true },
  { id: "camp", label: "Campagnes", emoji: "💊" },
  { id: "congres", label: "Congrès", emoji: "🎤" },
  { id: "sante", label: "Santé", emoji: "🛡️" },
  { id: "sondage", label: "Sondages", emoji: "📊" },
  { id: "bureau", label: "Bureau", emoji: "👥" },
];

export function StoriesBar({ locale }: { locale: string }) {
  const [seen, setSeen] = useState<string[]>([]);
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 pt-1 px-1" style={{ scrollbarWidth: "none" }}>
      {STORIES.map((s) => {
        const isSeen = seen.includes(s.id);
        return (
          <button key={s.id} onClick={() => setSeen((p) => (p.includes(s.id) ? p : [...p, s.id]))} className="flex flex-col items-center gap-1.5 shrink-0 group">
            <span className={`story-ring ${isSeen && !s.live ? "seen" : ""} group-hover:scale-105 transition-transform`}>
              <span className="w-16 h-16 rounded-full bg-white grid place-items-center text-3xl overflow-hidden">
                {s.emoji}
              </span>
            </span>
            <span className="text-[11.5px] font-bold text-[#33463a] flex items-center gap-1">
              {s.live && <span className="live-dot" />}{s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
