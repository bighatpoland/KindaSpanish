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
    gold: "from-gold/30",
    teal: "from-teal/30",
    coral: "from-coral/30",
    plum: "from-plum/20"
  }[accent];

  return (
    <section className={`rounded-panel bg-gradient-to-br ${accentClass} to-white p-5 shadow-card`}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.22em] text-plum/55">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

