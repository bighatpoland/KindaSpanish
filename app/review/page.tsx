import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { SectionCard } from "@/components/section-card";
import { achievements, streakState, userAchievementProgress, weeklyReport } from "@/features/gamification/data";
import { getUnlockedAchievements } from "@/features/gamification/selectors";
import { reviewItems } from "@/features/scenarios/data";

export default function ReviewPage() {
  const progressRows = getUnlockedAchievements(achievements, userAchievementProgress);

  return (
    <AppShell activePath="/review">
      <div className="space-y-4">
        <SectionCard title="Review and rewards" eyebrow="Keep the streak useful" accent="gold">
          <div className="flex flex-wrap gap-2">
            <Chip>{streakState.currentDays}-day streak</Chip>
            <Chip>{streakState.streakProtected ? "Streak saver ready" : "No saver active"}</Chip>
            <Chip>{weeklyReport.stuckFunctions.length} stuck functions to target</Chip>
          </div>
          <p className="mt-4 text-sm leading-6 text-plum/80">
            Review stays short. The app celebrates showing up, retries after feedback, and phrases
            you can carry into the next real interaction.
          </p>
        </SectionCard>

        <SectionCard title="Ready for recall" eyebrow="Spaced in context" accent="coral">
          <div className="space-y-3">
            {reviewItems.map((item) => (
              <div key={item.id} className="rounded-[22px] bg-white/85 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold">{item.chunk}</h3>
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
              <div key={row.id} className="rounded-[22px] bg-white/85 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-plum/55">
                      {row.category}
                    </p>
                    <h3 className="mt-1 text-base font-semibold">{row.title}</h3>
                  </div>
                  <Chip>{row.tier}</Chip>
                </div>
                <p className="mt-2 text-sm leading-6 text-plum/75">{row.description}</p>
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

