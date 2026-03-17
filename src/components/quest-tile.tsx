"use client";

import { ReactNode } from "react";
import { UISoundName } from "@/lib/audio/ui-sounds";
import { SoundLink } from "@/components/sound-link";
import { SoundButton } from "@/components/sound-button";

type QuestTileProps = {
  title: string;
  eyebrow: string;
  description: string;
  href?: string;
  chips?: ReactNode;
  footer?: ReactNode;
  variant?: "hero" | "place";
  sound?: UISoundName;
};

export function QuestTile({
  title,
  eyebrow,
  description,
  href,
  chips,
  footer,
  variant = "place",
  sound = "successClear"
}: QuestTileProps) {
  const baseClass =
    variant === "hero"
      ? "quest-tile quest-tile--hero game-interactive hero-scroll ornament-frame rounded-panel border border-walnut/18 courtyard-tile px-5 py-4 shadow-panel"
      : "quest-tile game-interactive ornament-frame rounded-plaque border border-walnut/16 courtyard-tile px-4 py-4 shadow-sm";

  const content = (
    <>
      <p className="text-[11px] uppercase tracking-[0.22em] text-bark/55">{eyebrow}</p>
      <h3
        className={`${variant === "hero" ? "text-[1.75rem]" : "text-xl"} mt-2 font-semibold leading-tight text-walnut`}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-plum/80">{description}</p>
      {chips ? <div className="mt-4 flex flex-wrap gap-2">{chips}</div> : null}
      {footer ? <div className="mt-5">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <SoundLink href={href} sound={sound} className={baseClass}>
        {content}
      </SoundLink>
    );
  }

  return (
    <SoundButton
      type="button"
      sound={sound}
      className={`${baseClass} w-full text-left`}
    >
      {content}
    </SoundButton>
  );
}
