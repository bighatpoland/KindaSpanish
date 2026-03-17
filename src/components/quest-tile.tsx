import Link from "next/link";
import { ReactNode } from "react";

type QuestTileProps = {
  title: string;
  eyebrow: string;
  description: string;
  href?: string;
  chips?: ReactNode;
  footer?: ReactNode;
  variant?: "hero" | "place";
};

export function QuestTile({
  title,
  eyebrow,
  description,
  href,
  chips,
  footer,
  variant = "place"
}: QuestTileProps) {
  const baseClass =
    variant === "hero"
      ? "quest-tile quest-tile--hero game-interactive ornament-frame rounded-panel border border-bark/15 bg-[linear-gradient(180deg,rgba(248,239,219,0.98)_0%,rgba(233,216,183,0.96)_100%)] p-4 shadow-panel"
      : "quest-tile game-interactive ornament-frame rounded-plaque border border-bark/15 bg-[#f7ecd6]/95 p-4 shadow-sm";

  const content = (
    <>
      <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">{eyebrow}</p>
      <h3 className={`${variant === "hero" ? "text-2xl" : "text-lg"} mt-2 font-semibold text-bark`}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-5 text-plum/78">{description}</p>
      {chips ? <div className="mt-4 flex flex-wrap gap-2">{chips}</div> : null}
      {footer ? <div className="mt-5">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
