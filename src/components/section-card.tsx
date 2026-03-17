import { ReactNode } from "react";

export function SectionCard({
  title,
  eyebrow,
  children,
  accent = "gold"
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  accent?: "gold" | "teal" | "coral" | "plum";
}) {
  const accentClass = {
    gold: "border-brass/25",
    teal: "border-grove/28",
    coral: "border-ember/25",
    plum: "border-cypress/22"
  }[accent];

  return (
    <section
      className={`ornament-frame parchment-panel rounded-panel border ${accentClass} p-5 shadow-panel`}
    >
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.22em] text-bark/60">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-xl font-semibold text-bark">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
