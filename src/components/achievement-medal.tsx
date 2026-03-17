import { AchievementTier } from "@/entities/domain";

const tierStyles: Record<AchievementTier, string> = {
  bronze: "from-[#c69860] to-[#8f6435]",
  silver: "from-[#d8d4ca] to-[#8d8578]",
  gold: "from-[#d8b451] to-[#9f7725]"
};

export function AchievementMedal({
  tier,
  label
}: {
  tier: AchievementTier;
  label: string;
}) {
  return (
    <div
      className={`medallion--alive relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b ${tierStyles[tier]} text-bark shadow-medal transition-transform duration-200 hover:-translate-y-0.5`}
    >
      <div className="absolute inset-[7px] rounded-full border border-white/30" />
      <div className="absolute -bottom-2 left-3 h-5 w-3 rounded-b-sm bg-cypress/85" />
      <div className="absolute -bottom-2 right-3 h-5 w-3 rounded-b-sm bg-olive/80" />
      <span className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-bark">
        {label}
      </span>
    </div>
  );
}
