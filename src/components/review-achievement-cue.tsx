"use client";

import { useEffect, useState } from "react";
import { RewardBanner } from "@/components/reward-banner";
import { Chip } from "@/components/chip";
import { useSound } from "@/hooks/use-sound";

type AchievementCueItem = {
  id: string;
  title: string;
  tier: string;
};

const STORAGE_KEY = "kinda-spanish-seen-achievements";

export function ReviewAchievementCue({
  unlockedAchievements
}: {
  unlockedAchievements: AchievementCueItem[];
}) {
  const [active, setActive] = useState<AchievementCueItem | null>(null);
  const playAchievement = useSound("rewardClaim", { volume: 0.5 });

  useEffect(() => {
    const seen = new Set<string>(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]
    );
    const newlyUnlocked = unlockedAchievements.find((achievement) => !seen.has(achievement.id));

    if (!newlyUnlocked) {
      return;
    }

    seen.add(newlyUnlocked.id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
    setActive(newlyUnlocked);
    playAchievement();
  }, [playAchievement, unlockedAchievements]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const timeout = window.setTimeout(() => setActive(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <RewardBanner
      title={`Achievement unlocked: ${active.title}`}
      body="Another little trophy for showing up, retrying, and making your Spanish more useful in the wild."
      icon="❖"
      tone="gold"
    >
      <Chip>{active.tier}</Chip>
      <Chip>Celebration, not grades</Chip>
    </RewardBanner>
  );
}

