import { ReactNode } from "react";

export function RewardBanner({
  title,
  body,
  icon = "✦",
  tone = "gold",
  children
}: {
  title: string;
  body: string;
  icon?: string;
  tone?: "gold" | "teal" | "ember";
  children?: ReactNode;
}) {
  const toneClass = {
    gold: "from-[#f0d08b] to-[#cf9d46]",
    teal: "from-[#84aa9d] to-[#567a6d]",
    ember: "from-[#d49274] to-[#a2553f]"
  }[tone];

  return (
    <div
      className={`reward-banner game-interactive ornament-frame rounded-panel bg-gradient-to-r ${toneClass} p-[1px] shadow-card`}
    >
      <div className="rounded-panel border border-white/40 bg-[linear-gradient(180deg,rgba(250,244,228,0.98)_0%,rgba(239,230,205,0.96)_100%)] px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="medallion medallion--alive flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-bark">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bark/60">Reward</p>
            <h3 className="mt-1 text-lg font-semibold text-bark">{title}</h3>
            <p className="mt-1 text-sm leading-5 text-plum/78">{body}</p>
          </div>
        </div>
        {children ? <div className="mt-3 flex flex-wrap gap-2">{children}</div> : null}
      </div>
    </div>
  );
}
