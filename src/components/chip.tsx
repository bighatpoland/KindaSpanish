import { ReactNode } from "react";

export function Chip({
  children,
  tone = "sand"
}: {
  children: ReactNode;
  tone?: "sand" | "forest" | "gold" | "ember";
}) {
  const toneClass = {
    sand: "border-walnut/12 bg-[linear-gradient(180deg,rgba(248,238,212,0.98)_0%,rgba(230,210,162,0.94)_100%)] text-walnut",
    forest: "forest-chip",
    gold: "border-brass/24 bg-[linear-gradient(180deg,rgba(244,225,172,0.98)_0%,rgba(220,183,104,0.94)_100%)] text-walnut",
    ember: "border-ember/24 bg-[linear-gradient(180deg,rgba(231,191,170,0.98)_0%,rgba(197,131,109,0.94)_100%)] text-walnut"
  }[tone];

  return (
    <span
      className={`rounded-pill border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] shadow-sm ${toneClass}`}
    >
      {children}
    </span>
  );
}
