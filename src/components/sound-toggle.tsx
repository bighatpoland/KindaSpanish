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
      className={`artifact-tab rounded-panel border px-3 py-2 text-left ${
        enabled
          ? "medallion artifact-tab--active text-walnut"
          : "border-walnut/15 bg-[linear-gradient(180deg,rgba(244,232,203,0.94)_0%,rgba(224,196,141,0.92)_100%)] text-walnut shadow-sm"
      }`}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
    >
      <p className="text-[10px] uppercase tracking-[0.24em] text-bark/70">Sound</p>
      <p className="text-sm font-semibold">{hydrated ? (enabled ? "On" : "Off") : "..."}</p>
    </button>
  );
}
