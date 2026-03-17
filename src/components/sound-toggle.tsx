"use client";

import { useSound } from "@/hooks/use-sound";
import { useSoundSettings } from "@/components/sound-provider";

export function SoundToggle() {
  const { enabled, setEnabled, hydrated } = useSoundSettings();
  const playReward = useSound("rewardClaim", { volume: 0.5 });

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);

    if (next) {
      playReward();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`artifact-tab rounded-panel border px-3 py-2 text-left text-bark ${
        enabled ? "medallion artifact-tab--active" : "border-bark/15 bg-[#efe1c1]/90 shadow-sm"
      }`}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-bark/70">Sound</p>
      <p className="text-sm font-semibold">{hydrated ? (enabled ? "On" : "Off") : "..."}</p>
    </button>
  );
}

