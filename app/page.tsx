import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { HomeStateEvents } from "@/components/home-state-events";
import { ProgressBar } from "@/components/progress-bar";
import { QuestTile } from "@/components/quest-tile";
import { RewardBanner } from "@/components/reward-banner";
import { SectionCard } from "@/components/section-card";
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

export default function HomePage() {
  const level = getLevelProgress(progressProfile);
  const mainScenario = scenarios[0];
  const unlockedAchievements = userAchievementProgress.filter((item) => item.unlockedAt).length;

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
        <HomeStateEvents
          level={progressProfile.level}
          currentDays={streakState.currentDays}
          streakProtected={streakState.streakProtected}
        />

        <SectionCard title="Today's map" eyebrow="Home" accent="gold">
          <div className="village-map-surface relative overflow-hidden rounded-panel border border-cypress/12 p-4">
            <div className="absolute left-[18%] top-[14%] h-24 w-24 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute right-[10%] top-[18%] h-20 w-20 rounded-full bg-grove/16 blur-3xl" />
            <div className="absolute left-[8%] bottom-[14%] h-24 w-24 rounded-full bg-olive/16 blur-3xl" />
            <div className="absolute right-[20%] bottom-[10%] h-20 w-20 rounded-full bg-cypress/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-bark/60">
                    Today
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-bark">
                    One small useful win
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-plum/80">
                    Start the mission, review one phrase, or do a quick drill. Everything below is
                    here to help you speak faster in a real moment today.
                  </p>
                </div>
                <div className="rounded-panel border border-cypress/18 bg-[linear-gradient(180deg,rgba(95,124,104,0.96)_0%,rgba(61,86,72,0.98)_100%)] px-3 py-2 text-right text-mist shadow-panel">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-mist/75">Next up</p>
                  <p className="text-sm font-semibold">{mainScenario.estimatedMinutes} min mission</p>
                </div>
              </div>

              <div className="absolute left-[50%] top-[35%] hidden h-[38%] w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(47,75,62,0)_0%,rgba(47,75,62,0.24)_20%,rgba(47,75,62,0.28)_80%,rgba(47,75,62,0)_100%)] md:block" />
              <div className="absolute left-[24%] top-[56%] hidden h-[2px] w-[52%] bg-[linear-gradient(90deg,rgba(47,75,62,0)_0%,rgba(47,75,62,0.22)_20%,rgba(47,75,62,0.26)_80%,rgba(47,75,62,0)_100%)] md:block" />

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
                      <Chip>{mainScenario.domain}</Chip>
                      <Chip>{mainScenario.estimatedMinutes} min</Chip>
                      <Chip>{mainScenario.targetChunks[0]}</Chip>
                    </>
                  }
                  footer={
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-bark">Current scenario</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-bark/55">
                          Listen, answer, retry
                        </p>
                      </div>
                      <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-lg text-bark shadow-medal">
                        ▶
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
                        <Chip>{progressProfile.unlockedGames.length} unlocked</Chip>
                        <Chip>Fast drills</Chip>
                      </>
                    }
                  />

                  <QuestTile
                    href="/review"
                    sound="rewardClaim"
                    eyebrow="Archive house"
                    title="Review phrases"
                    description={`${reviewItems.length} phrases are waiting for recall and cleanup.`}
                    chips={
                      <>
                        <Chip>{reviewItems.length} due now</Chip>
                        <Chip>Spaced review</Chip>
                      </>
                    }
                  />

                  <QuestTile
                    href={streakState.streakProtected ? "/review" : `/session/${mainScenario.id}`}
                    sound={streakState.streakProtected ? "streakReminder" : "streakWarningSoft"}
                    eyebrow="Lantern tower"
                    title={streakState.streakProtected ? "Streak is safe" : "Save today's streak"}
                    description={
                      streakState.streakProtected
                        ? `${streakState.currentDays} days running. A quick review keeps your momentum warm.`
                        : "Your streak needs one small action today. Start the mission and keep the lantern lit."
                    }
                    chips={
                      <>
                        <Chip>{streakState.currentDays} days</Chip>
                        <Chip>{streakState.streakProtected ? "Safe" : "At risk"}</Chip>
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
                        <Chip>{mainScenario.targetChunks[0]}</Chip>
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
              label={`Level ${progressProfile.level} to ${progressProfile.level + 1}`}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Coins</p>
                <p className="mt-2 text-2xl font-semibold text-bark">{progressProfile.coinsBalance}</p>
              </div>
              <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Achievements</p>
                <p className="mt-2 text-2xl font-semibold text-bark">{unlockedAchievements}</p>
              </div>
              <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Style</p>
                <p className="mt-2 text-sm font-semibold text-bark">{userProfile.dialectMode}</p>
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
            <Chip>{weeklyReport.completedScenarios} scenarios done</Chip>
            <Chip>{weeklyReport.retriesSucceeded} successful retries</Chip>
            <Chip>{weeklyReport.missionsDone} real-life missions</Chip>
          </RewardBanner>
        </SectionCard>
      </div>
    </AppShell>
  );
}
