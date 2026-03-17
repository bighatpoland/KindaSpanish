"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BuildingMarker } from "@/components/building-marker";
import { Chip } from "@/components/chip";
import { HomeStateEvents } from "@/components/home-state-events";
import { ProgressBar } from "@/components/progress-bar";
import { QuestTile } from "@/components/quest-tile";
import { RewardBanner } from "@/components/reward-banner";
import { SectionCard } from "@/components/section-card";
import { SoundButton } from "@/components/sound-button";
import { SoundLink } from "@/components/sound-link";
import {
  CoinStackIcon,
  CompassIcon,
  CrateIcon,
  HouseIcon,
  ScrollIcon,
  TowerIcon
} from "@/components/settlers-icons";
import { useProgressSnapshot } from "@/hooks/use-progress-snapshot";
import {
  arcadeGames,
  progressProfile,
  streakState,
  userAchievementProgress,
  userProfile,
  weeklyReport
} from "@/features/gamification/data";
import { getLevelProgress } from "@/features/gamification/selectors";
import { reviewItems, scenarios } from "@/features/scenarios/data";
import { readActiveSession } from "@/lib/session/active-session";
import { readStoredSessionProgress } from "@/lib/session/session-storage";

const HOME_ONBOARDING_SEEN_KEY = "kinda-spanish-home-onboarded-v1";

export default function HomePage() {
  const snapshot = useProgressSnapshot();
  const activeProfile = snapshot?.profile ?? progressProfile;
  const activeStreak = snapshot?.streak ?? streakState;
  const activeAchievementProgress = snapshot?.achievementProgress ?? userAchievementProgress;
  const activeWeeklyReport = snapshot?.weeklyReport ?? weeklyReport;
  const activeReviewDueNow = snapshot?.reviewDueNow ?? reviewItems.length;
  const level = getLevelProgress(activeProfile);
  const mainScenario = scenarios[0];
  const unlockedAchievements =
    snapshot?.unlockedAchievements ??
    activeAchievementProgress.filter((item) => item.unlockedAt).length;

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
        <HomeStateEvents
          level={activeProfile.level}
          currentDays={activeStreak.currentDays}
          streakProtected={activeStreak.streakProtected}
        />

        <SectionCard title="Today's map" eyebrow="Home" accent="gold">
          <div className="map-board gold-corners relative overflow-hidden rounded-panel border border-white/10 p-4">
            <div className="absolute left-[18%] top-[14%] h-24 w-24 rounded-full bg-[#90a7cb]/8 blur-3xl" />
            <div className="absolute right-[10%] top-[18%] h-20 w-20 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute left-[8%] bottom-[14%] h-24 w-24 rounded-full bg-olive/10 blur-3xl" />
            <div className="absolute right-[20%] bottom-[10%] h-20 w-20 rounded-full bg-cypress/8 blur-3xl" />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#d9c392]/72">
                    Building menu
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#b28a4d] menu-cell shadow-panel">
                      <CompassIcon className="h-6 w-6" />
                    </span>
                    <h3 className="text-[1.65rem] font-semibold leading-tight text-[#f4e7c3]">
                      One small useful win
                    </h3>
                  </div>
                  <p className="mt-2 max-w-[18rem] text-sm leading-6 text-[#d7cbaf]/82">
                    Start the mission, review one phrase, or do a quick drill. Everything below is
                    here to help you speak faster in a real moment today.
                  </p>
                </div>
                <div className="menu-cell rounded-[18px] border border-[#8f6b3b] px-3 py-3 text-right text-walnut shadow-panel">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-walnut/70">Next up</p>
                  <div className="mt-1 flex items-center justify-end gap-2">
                    <CrateIcon className="h-5 w-5" />
                    <p className="text-sm font-semibold">{mainScenario.estimatedMinutes} min mission</p>
                  </div>
                </div>
              </div>

              <div className="map-path absolute left-[50%] top-[35%] hidden h-[38%] w-[2px] -translate-x-1/2 md:block" />
              <div className="map-path absolute left-[24%] top-[56%] hidden h-[2px] w-[52%] md:block" />
              <BuildingMarker label="Town square" icon="house" className="left-[10%] top-[24%]" />
              <BuildingMarker label="Training yard" icon="tower" className="right-[12%] top-[46%]" />
              <BuildingMarker label="Archive house" icon="compass" className="left-[13%] bottom-[10%]" />

              <div className="grid gap-3">
                <QuestTile
                  href={`/session/${mainScenario.id}`}
                  sound="missionReady"
                  variant="hero"
                  eyebrow="Town square"
                  title="Start today's mission"
                  description={`${mainScenario.intent} in about ${mainScenario.estimatedMinutes} minutes.`}
                  chips={
                    <>
                      <Chip tone="gold">{mainScenario.domain}</Chip>
                      <Chip>{mainScenario.estimatedMinutes} min</Chip>
                      <Chip tone="forest">{mainScenario.targetChunks[0]}</Chip>
                    </>
                  }
                  footer={
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-walnut">Current scenario</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-bark/55">
                          Listen, answer, retry
                        </p>
                      </div>
                      <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-walnut shadow-medal">
                        <HouseIcon className="h-6 w-6" />
                      </div>
                    </div>
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <QuestTile
                    href="/arcade"
                    sound="arcadeUnlock"
                    eyebrow="Training yard"
                    title="Arcade practice"
                    description={`${arcadeGames.length} quick games for queues, walks, and reaction speed.`}
                    chips={
                      <>
                        <Chip tone="gold">{activeProfile.unlockedGames.length} unlocked</Chip>
                        <Chip tone="forest">Fast drills</Chip>
                      </>
                    }
                  />

                  <QuestTile
                    href="/review"
                    sound="rewardClaim"
                    eyebrow="Archive house"
                    title="Review phrases"
                    description={`${activeReviewDueNow} phrases are waiting for recall and cleanup.`}
                    chips={
                      <>
                        <Chip tone="ember">{activeReviewDueNow} due now</Chip>
                        <Chip>Spaced review</Chip>
                      </>
                    }
                  />

                  <QuestTile
                    href={activeStreak.streakProtected ? "/review" : `/session/${mainScenario.id}`}
                    sound={activeStreak.streakProtected ? "streakReminder" : "streakWarningSoft"}
                    eyebrow="Lantern tower"
                    title={activeStreak.streakProtected ? "Streak is safe" : "Save today's streak"}
                    description={
                      activeStreak.streakProtected
                        ? `${activeStreak.currentDays} days running. A quick review keeps your momentum warm.`
                        : "Your streak needs one small action today. Start the mission and keep the lantern lit."
                    }
                    chips={
                      <>
                        <Chip tone="gold">{activeStreak.currentDays} days</Chip>
                        <Chip tone={activeStreak.streakProtected ? "forest" : "ember"}>
                          {activeStreak.streakProtected ? "Safe" : "At risk"}
                        </Chip>
                      </>
                    }
                  />

                  <QuestTile
                    href={`/session/${mainScenario.id}`}
                    sound="dailyReminder"
                    eyebrow="Market board"
                    title="Today's phrase"
                    description={`Practice "${mainScenario.targetChunks[0]}" before you need it in the wild.`}
                    chips={
                      <>
                        <Chip tone="forest">{mainScenario.targetChunks[0]}</Chip>
                        <Chip>Carry-away phrase</Chip>
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Progress strip" eyebrow="At a glance" accent="teal">
          <div className="grid gap-3">
            <ProgressBar
              value={level.pct}
              label={`Level ${activeProfile.level} to ${activeProfile.level + 1}`}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="menu-cell rounded-[18px] border border-[#8f6b3b] p-4 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#a57d42] bg-black/5">
                  <CoinStackIcon className="h-5 w-5" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-bark/55">Coins</p>
                <p className="mt-2 text-2xl font-semibold text-walnut">{activeProfile.coinsBalance}</p>
              </div>
              <div className="menu-cell rounded-[18px] border border-[#8f6b3b] p-4 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#a57d42] bg-black/5">
                  <TowerIcon className="h-5 w-5" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-bark/55">Achievements</p>
                <p className="mt-2 text-2xl font-semibold text-walnut">{unlockedAchievements}</p>
              </div>
              <div className="menu-cell rounded-[18px] border border-[#8f6b3b] p-4 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#a57d42] bg-black/5">
                  <ScrollIcon className="h-5 w-5" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-bark/55">Style</p>
                <p className="mt-2 text-sm font-semibold text-walnut">{userProfile.dialectMode}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent wins" eyebrow="What counts" accent="coral">
          <RewardBanner
            title="Useful progress beats decorative progress"
            body="The village tracks real things: missions finished, retries that got clearer, and phrases that you can actually use outside."
            icon="✦"
            tone="gold"
          >
            <Chip tone="gold">{activeWeeklyReport.completedScenarios} scenarios done</Chip>
            <Chip>{activeWeeklyReport.retriesSucceeded} successful retries</Chip>
            <Chip tone="forest">{activeWeeklyReport.missionsDone} real-life missions</Chip>
          </RewardBanner>
        </SectionCard>
      </div>
    </AppShell>
  );
}
