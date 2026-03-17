"use client";

import { SoundLink } from "@/components/sound-link";

const tabs = [
  { href: "/", label: "Map", glyph: "✦" },
  { href: "/arcade", label: "Yard", glyph: "⚒" },
  { href: "/review", label: "Archive", glyph: "❖" }
];

export function ArtifactNav({ activePath }: { activePath: string }) {
  return (
    <nav className="timber-panel ornament-frame fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-panel border border-walnut/30 px-3 py-3 text-mist shadow-timber">
      {tabs.map((tab) => {
        const active = activePath === tab.href;
        return (
          <SoundLink
            key={tab.href}
            href={tab.href}
            sound="successClear"
            className={`artifact-tab flex min-w-[88px] items-center justify-center gap-2 rounded-panel px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] ${
              active ? "artifact-tab--active medallion text-walnut" : "text-sand/90"
            }`}
          >
            <span className="text-base leading-none">{tab.glyph}</span>
            <span>{tab.label}</span>
          </SoundLink>
        );
      })}
    </nav>
  );
}
