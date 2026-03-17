"use client";

import { useEffect, useState } from "react";
import { RewardBanner } from "@/components/reward-banner";
import { Chip } from "@/components/chip";
import { useSound } from "@/hooks/use-sound";

const storageKeyForScenario = (scenarioId: string) => `kinda-spanish-session-ready:${scenarioId}`;

export function SessionReadyCue({
  scenarioId,
  intent
}: {
  scenarioId: string;
  intent: string;
}) {
  const [visible, setVisible] = useState(false);
  const playMissionReady = useSound("missionReady", { volume: 0.48 });

  useEffect(() => {
    const key = storageKeyForScenario(scenarioId);

    if (window.sessionStorage.getItem(key) === "true") {
      return;
    }

    window.sessionStorage.setItem(key, "true");
    setVisible(true);
    playMissionReady();
  }, [playMissionReady, scenarioId]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(false), 3600);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <RewardBanner
      title="Mission ready"
      body={`Today's encounter is live: ${intent}. Listen first, then answer before your brain starts bargaining.`}
      icon="◉"
      tone="teal"
    >
      <Chip>Audio-first</Chip>
      <Chip>Daily encounter</Chip>
    </RewardBanner>
  );
}

