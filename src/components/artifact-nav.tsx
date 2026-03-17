"use client";

import { SoundLink } from "@/components/sound-link";
import { CompassIcon, HammerIcon, ScrollIcon } from "@/components/settlers-icons";

const tabs = [
  { href: "/", label: "Map", icon: CompassIcon },
  { href: "/arcade", label: "Yard", icon: HammerIcon },
  { href: "/review", label: "Archive", icon: ScrollIcon }
];

export function ArtifactNav({ activePath }: { activePath: string }) {
  return (
    <nav className="stone-panel gold-corners fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-panel border border-[#121b27] px-2 py-2 text-mist shadow-card">
      {tabs.map((tab) => {
        const active = activePath === tab.href;
        const Icon = tab.icon;
        return (
          <SoundLink
            key={tab.href}
            href={tab.href}
            sound="successClear"
            className={`artifact-tab flex min-w-[88px] flex-col items-center justify-center gap-1 rounded-[18px] border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${
              active
                ? "artifact-tab--active medallion border-brass/25 text-walnut"
                : "menu-cell--dark border-white/10 text-sand/92"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-current/15 bg-black/10">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <span>{tab.label}</span>
          </SoundLink>
        );
      })}
    </nav>
  );
}
