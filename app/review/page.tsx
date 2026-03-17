import { AchievementMedal } from "@/components/achievement-medal";
import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { ReviewAchievementCue } from "@/components/review-achievement-cue";
import { SectionCard } from "@/components/section-card";
import { achievements, streakState, userAchievementProgress, weeklyReport } from "@/features/gamification/data";
import { getUnlockedAchievements } from "@/features/gamification/selectors";
import { reviewItems } from "@/features/scenarios/data";

export default function ReviewPage() {
  const progressRows = getUnlockedAchievements(achievements, userAchievementProgress);

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

        <SectionCard title="Satchel and trophy room" eyebrow="Keep the streak useful" accent="gold">
          <RewardBanner
            title="Trophy room is awake"
            body="Review stays short. The app celebrates showing up, retries after feedback, and phrases you can carry into the next real interaction."
            icon="❖"
            tone="teal"
          >
            <Chip>{streakState.currentDays}-day streak</Chip>
            <Chip>{streakState.streakProtected ? "Streak saver ready" : "No saver active"}</Chip>
            <Chip>{weeklyReport.stuckFunctions.length} stuck functions to target</Chip>
          </RewardBanner>
        </SectionCard>

        <SectionCard title="Phrases ready for recall" eyebrow="Spaced in context" accent="coral">
          <div className="space-y-3">
            {reviewItems.map((item) => (
              <div key={item.id} className="ornament-frame rounded-plaque border border-bark/12 bg-[#f7ecd6]/95 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-bark">{item.chunk}</h3>
                  <Chip>{item.nextReviewAt}</Chip>
                </div>
                <p className="mt-2 text-sm leading-6 text-plum/75">{item.sentence}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Achievements" eyebrow="Celebration, not grades" accent="teal">
          <div className="space-y-3">
            {progressRows.map((row) => (
              <div key={row.id} className="ornament-frame rounded-plaque border border-bark/12 bg-[#f7ecd6]/95 p-4">
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
                  <div className="medallion rounded-panel px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-bark">
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
      </div>
    </AppShell>
  );
}
