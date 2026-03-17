"use client";

import { useEffect, useState } from "react";
import { RewardBanner } from "@/components/reward-banner";
import { Chip } from "@/components/chip";
import { useSound } from "@/hooks/use-sound";

type HomeStateEventsProps = {
  level: number;
  currentDays: number;
  streakProtected: boolean;
};

type HomeEvent =
  | {
      kind: "level-up";
      title: string;
      body: string;
      tone: "gold";
      icon: string;
    }
  | {
      kind: "streak-warning";
      title: string;
      body: string;
      tone: "ember";
      icon: string;
    };

const LEVEL_STORAGE_KEY = "kinda-spanish-last-seen-level";
const STREAK_WARNING_STORAGE_KEY = "kinda-spanish-streak-warning-seen";

export function HomeStateEvents({
  level,
  currentDays,
  streakProtected
}: HomeStateEventsProps) {
  const [event, setEvent] = useState<HomeEvent | null>(null);
  const playLevelUp = useSound("levelUp", { volume: 0.56 });
  const playWarning = useSound("streakWarningSoft", { volume: 0.52 });

  useEffect(() => {
    const seenLevel = Number(window.localStorage.getItem(LEVEL_STORAGE_KEY) ?? "0");

    if (seenLevel < level) {
      window.localStorage.setItem(LEVEL_STORAGE_KEY, String(level));
      setEvent({
        kind: "level-up",
        title: `Village level ${level}`,
        body: "You have grown your little settlement. New confidence, more loops, one less freeze.",
        tone: "gold",
        icon: "✦"
      });
      playLevelUp();
      return;
    }

    const shouldWarn = currentDays > 0 && !streakProtected;
    const warnedForKey = window.sessionStorage.getItem(STREAK_WARNING_STORAGE_KEY);

    if (shouldWarn && warnedForKey !== String(currentDays)) {
      window.sessionStorage.setItem(STREAK_WARNING_STORAGE_KEY, String(currentDays));
      setEvent({
        kind: "streak-warning",
        title: "Lantern running low",
        body: "A tiny run will keep today alive. No need for a full lesson, just keep the flame on.",
        tone: "ember",
        icon: "!"
      });
      playWarning();
    }
  }, [currentDays, level, playLevelUp, playWarning, streakProtected]);

  useEffect(() => {
    if (!event) {
      return;
    }

    const timeout = window.setTimeout(() => setEvent(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [event]);

  if (!event) {
    return null;
  }

  return (
    <RewardBanner title={event.title} body={event.body} tone={event.tone} icon={event.icon}>
      {event.kind === "level-up" ? <Chip>Level up</Chip> : null}
      {event.kind === "streak-warning" ? <Chip>Streak at risk</Chip> : null}
      <Chip>{currentDays}-day streak</Chip>
    </RewardBanner>
  );
}

