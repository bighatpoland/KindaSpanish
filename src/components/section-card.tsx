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
    gold: "bg-[linear-gradient(180deg,#e2bd74_0%,#ad7725_100%)]",
    teal: "bg-[linear-gradient(180deg,#7b998c_0%,#45695a_100%)]",
    coral: "bg-[linear-gradient(180deg,#c97a61_0%,#954938_100%)]",
    plum: "bg-[linear-gradient(180deg,#7d6456_0%,#4a352b_100%)]"
  }[accent];

  return (
    <section className="stone-panel gold-corners relative rounded-panel border border-[#121b27] p-1 shadow-card">
      <div
        className={`pointer-events-none absolute inset-x-10 top-1 h-[3px] rounded-full opacity-90 ${accentClass}`}
      />
      <div className="ornament-frame village-plaque rounded-panel px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-[11px] uppercase tracking-[0.28em] text-walnut/72">{eyebrow}</p>
            ) : null}
            <h2 className="mt-2 text-[1.35rem] font-semibold leading-tight text-walnut">{title}</h2>
          </div>
          <div className="mt-1 h-8 w-8 rounded-full border border-brass/35 bg-[radial-gradient(circle_at_30%_30%,rgba(255,244,214,0.8),transparent_24%),linear-gradient(180deg,rgba(234,201,120,0.95)_0%,rgba(168,117,34,0.95)_100%)] shadow-medal" />
        </div>
        <div className="session-divider mt-4" />
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}
