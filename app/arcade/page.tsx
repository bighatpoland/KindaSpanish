"use client";

import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { SectionCard } from "@/components/section-card";
import { SoundLink } from "@/components/sound-link";
import { useProgressSnapshot } from "@/hooks/use-progress-snapshot";
import { useEffect, useState } from "react";
import { arcadeGames, progressProfile } from "@/features/gamification/data";
import { ARCADE_RUNS_UPDATED_EVENT, loadArcadeRuns } from "@/features/arcade/arcade-service";
import type { ArcadeRunResult } from "@/entities/domain";

export default function ArcadePage() {
  const snapshot = useProgressSnapshot();
  const activeProfile = snapshot?.profile ?? progressProfile;
  const [runs, setRuns] = useState<ArcadeRunResult[]>([]);
  const bestRun = [...runs].sort((left, right) => right.score - left.score)[0];

  useEffect(() => {
    const hydrate = () => {
      setRuns(loadArcadeRuns());
    };

    hydrate();
    window.addEventListener(ARCADE_RUNS_UPDATED_EVENT, hydrate);
    window.addEventListener("focus", hydrate);

    return () => {
      window.removeEventListener(ARCADE_RUNS_UPDATED_EVENT, hydrate);
      window.removeEventListener("focus", hydrate);
    };
  }, []);

  return (
    <AppShell activePath="/arcade">
      <div className="space-y-4">
        <SectionCard title="Training district" eyebrow="Arcade map" accent="teal">
          <RewardBanner
            title="Quick stations, clear wins"
            body="This district trains reaction speed, listening, and useful chunks for the moments when you need Spanish to work now."
            icon="✦"
            tone="teal"
          >
            <Chip>{activeProfile.unlockedGames.length} stations open</Chip>
            <Chip>Solo progression</Chip>
            <Chip>One-hand friendly</Chip>
          </RewardBanner>
        </SectionCard>

        <SectionCard title="Stations" eyebrow="Pick one job" accent="plum">
          <div className="grid gap-3">
            {arcadeGames.map((game) => {
              const lastRun = runs.find((run) => run.gameId === game.id);
              const isUnlocked = activeProfile.unlockedGames.includes(game.id);
              return (
                <SectionCard
                  key={game.id}
                  title={game.name}
                  eyebrow={`${game.durationSeconds}s • ${game.inputMode}`}
                  accent={isUnlocked ? "gold" : "plum"}
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-sm leading-6 text-plum/80">{game.skillFocus}</p>
                      <p className="mt-3 text-sm text-plum/70">{game.rewardProfile}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Chip>{isUnlocked ? "Open now" : "Locked"}</Chip>
                        <Chip>{isUnlocked ? "Tap to train" : game.unlockRule}</Chip>
                        {lastRun ? <Chip tone="forest">{lastRun.score} best score</Chip> : null}
                      </div>
                      <div className="mt-4">
                        {game.id === "catch-the-chunk" && isUnlocked ? (
                          <SoundLink
                            href="/arcade/catch-the-chunk"
                            sound="arcadeUnlock"
                            className="inline-flex items-center justify-center rounded-panel border border-bark/15 bg-[#efe1c1]/90 px-4 py-3 text-sm font-semibold text-bark shadow-sm"
                          >
                            Play station
                          </SoundLink>
                        ) : (
                          <div className="inline-flex items-center justify-center rounded-panel border border-cypress/12 bg-[linear-gradient(180deg,rgba(234,226,204,0.98)_0%,rgba(220,210,184,0.96)_100%)] px-4 py-3 text-sm font-semibold text-bark/70 shadow-sm">
                            Coming next
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`h-fit rounded-panel border px-4 py-3 text-center shadow-panel ${
                        isUnlocked
                          ? "border-grove/22 bg-[linear-gradient(180deg,rgba(95,124,104,0.98)_0%,rgba(61,86,72,0.98)_100%)] text-mist"
                          : "border-cypress/16 bg-[linear-gradient(180deg,rgba(234,226,204,0.98)_0%,rgba(220,210,184,0.96)_100%)] text-bark"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em]">Station</p>
                      <p className="mt-1 text-lg font-semibold">{isUnlocked ? "Open" : "Locked"}</p>
                      {lastRun ? (
                        <p className="mt-2 text-xs uppercase tracking-[0.15em]">
                          {lastRun.score} score
                        </p>
                      ) : null}
                    </div>
                  </div>
                </SectionCard>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="District status" eyebrow="What this means" accent="teal">
          <div className="grid grid-cols-3 gap-3">
            <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Unlocked</p>
              <p className="mt-2 text-2xl font-semibold text-bark">
                {activeProfile.unlockedGames.length}
              </p>
            </div>
            <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Best run</p>
              <p className="mt-2 text-2xl font-semibold text-bark">
                {bestRun?.score ?? "-"}
              </p>
            </div>
            <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Modes</p>
              <p className="mt-2 text-2xl font-semibold text-bark">{arcadeGames.length}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
