"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { useSound } from "@/hooks/use-sound";

const SESSION_STORAGE_KEY = "kinda-spanish-active-session";
const BACKGROUND_AT_KEY = "kinda-spanish-session-background-at";

type ActiveSessionPayload = {
  scenarioId: string;
  intent: string;
  updatedAt: string;
};

export function SessionLifecycleGuard({
  scenarioId,
  intent
}: {
  scenarioId: string;
  intent: string;
}) {
  const [showResumeCue, setShowResumeCue] = useState(false);
  const playResume = useSound("retrySoft", { volume: 0.44 });

  useEffect(() => {
    const previous = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    const backgroundAt = Number(window.sessionStorage.getItem(BACKGROUND_AT_KEY) ?? "0");
    const payload: ActiveSessionPayload = {
      scenarioId,
      intent,
      updatedAt: new Date().toISOString()
    };

    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));

    if (previous) {
      const parsed = JSON.parse(previous) as ActiveSessionPayload;
      const resumedRecently =
        parsed.scenarioId === scenarioId && backgroundAt > 0 && Date.now() - backgroundAt < 1000 * 60 * 20;

      if (resumedRecently) {
        setShowResumeCue(true);
        playResume();
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.sessionStorage.setItem(BACKGROUND_AT_KEY, String(Date.now()));
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
      }
    };

    window.addEventListener("pagehide", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intent, playResume, scenarioId]);

  useEffect(() => {
    if (!showResumeCue) {
      return;
    }

    const timeout = window.setTimeout(() => setShowResumeCue(false), 3600);
    return () => window.clearTimeout(timeout);
  }, [showResumeCue]);

  if (!showResumeCue) {
    return null;
  }

  return (
    <RewardBanner
      title="Session restored"
      body="You came back to the same encounter without losing the thread. Good. Keep going."
      tone="teal"
      icon="↺"
    >
      <Chip>Recovered after interruption</Chip>
      <Chip>{intent}</Chip>
    </RewardBanner>
  );
}

