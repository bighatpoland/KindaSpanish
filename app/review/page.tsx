"use client";

import { AchievementMedal } from "@/components/achievement-medal";
import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { ReviewPracticeClient } from "@/components/review-practice-client";
import { ReviewStatusCards } from "@/components/review-status-cards";
import { RewardBanner } from "@/components/reward-banner";
import { ReviewAchievementCue } from "@/components/review-achievement-cue";
import { SectionCard } from "@/components/section-card";
import { useProgressSnapshot } from "@/hooks/use-progress-snapshot";
import { achievements, streakState, userAchievementProgress, weeklyReport } from "@/features/gamification/data";
import { getUnlockedAchievements } from "@/features/gamification/selectors";

export default function ReviewPage() {
  const snapshot = useProgressSnapshot();
  const activeStreak = snapshot?.streak ?? streakState;
  const activeAchievementProgress = snapshot?.achievementProgress ?? userAchievementProgress;
  const activeWeeklyReport = snapshot?.weeklyReport ?? weeklyReport;
  const progressRows = getUnlockedAchievements(achievements, activeAchievementProgress);

  return (
    <AppShell activePath="/review">
      <div className="space-y-4">
        <ReviewAchievementCue
          unlockedAchievements={progressRows
            .filter((row) => row.isUnlocked)
            .map((row) => ({
              id: row.id,
              title: row.title,
              tier: row.tier
            }))}
        />

        <SectionCard title="Archive district" eyebrow="Review map" accent="gold">
          <RewardBanner
            title="Keep the useful pieces"
            body="This district stores the phrases and wins that matter, then sends them back when they are ready to be used again."
            icon="◉"
            tone="teal"
          >
            <Chip>{activeStreak.currentDays}-day streak</Chip>
            <Chip>{activeWeeklyReport.stuckFunctions.length} stuck functions</Chip>
            <Chip>{activeStreak.streakProtected ? "Safe today" : "Save today"}</Chip>
          </RewardBanner>
        </SectionCard>

        <SectionCard title="Phrases due" eyebrow="Spaced recall" accent="coral">
          <ReviewPracticeClient />
        </SectionCard>

        <SectionCard title="Trophy house" eyebrow="Celebration, not grades" accent="teal">
          <div className="grid gap-3">
            {progressRows.map((row) => (
              <div
                key={row.id}
                className="ornament-frame rounded-plaque border border-cypress/14 bg-[linear-gradient(180deg,rgba(247,238,218,0.98)_0%,rgba(229,218,191,0.96)_100%)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AchievementMedal tier={row.tier} label={row.tier.slice(0, 1)} />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">
                        {row.category}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-bark">{row.title}</h3>
                    </div>
                  </div>
                  <div
                    className={`rounded-panel border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                      row.isUnlocked
                        ? "border-grove/18 bg-grove/16 text-bark"
                        : "border-cypress/12 bg-[#efe4c8] text-bark"
                    }`}
                  >
                    {row.tier}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-plum/75">{row.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip>{row.progressValue}/{row.criteriaValue}</Chip>
                  <Chip>{row.unlockReward.label}</Chip>
                  <Chip>{row.isUnlocked ? "Unlocked" : "In progress"}</Chip>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="District notes" eyebrow="What this means" accent="plum">
          <div className="space-y-3">
            <ReviewStatusCards />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Streak</p>
                <p className="mt-2 text-2xl font-semibold text-bark">{activeStreak.currentDays}d</p>
              </div>
              <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Unlocked</p>
                <p className="mt-2 text-2xl font-semibold text-bark">
                  {progressRows.filter((row) => row.isUnlocked).length}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
