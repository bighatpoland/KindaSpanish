import { ReactNode } from "react";

export function Chip({
  children,
  tone = "sand"
}: {
  children: ReactNode;
  tone?: "sand" | "forest" | "gold";
}) {
  const toneClass = {
    sand: "border-bark/10 bg-[#f6ebd4]/95 text-bark",
    forest: "forest-chip",
    gold: "border-brass/20 bg-[#f3e1b6]/95 text-bark"
  }[tone];

  return (
    <span className={`rounded-pill border px-3 py-1 text-xs font-medium shadow-sm ${toneClass}`}>
      {children}
    </span>
  );
}
