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
          <div className="map-board relative overflow-hidden rounded-panel border border-walnut/12 p-4">
            <div className="absolute left-[18%] top-[14%] h-24 w-24 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute right-[10%] top-[18%] h-20 w-20 rounded-full bg-grove/16 blur-3xl" />
            <div className="absolute left-[8%] bottom-[14%] h-24 w-24 rounded-full bg-olive/16 blur-3xl" />
            <div className="absolute right-[20%] bottom-[10%] h-20 w-20 rounded-full bg-cypress/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-bark/60">
                    Village board
                  </p>
                  <h3 className="mt-2 text-[1.65rem] font-semibold leading-tight text-walnut">
                    One small useful win
                  </h3>
                  <p className="mt-2 max-w-[18rem] text-sm leading-6 text-plum/82">
                    Start the mission, review one phrase, or do a quick drill. Everything below is
                    here to help you speak faster in a real moment today.
                  </p>
                </div>
                <div className="timber-panel rounded-panel border border-walnut/30 px-3 py-3 text-right text-mist shadow-timber">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-mist/75">Next up</p>
                  <p className="text-sm font-semibold">{mainScenario.estimatedMinutes} min mission</p>
                </div>
              </div>

              <div className="map-path absolute left-[50%] top-[35%] hidden h-[38%] w-[2px] -translate-x-1/2 md:block" />
              <div className="map-path absolute left-[24%] top-[56%] hidden h-[2px] w-[52%] md:block" />

              <div className="absolute left-[12%] top-[26%] hidden items-center gap-2 md:flex">
                <div className="location-marker medallion h-5 w-5 rounded-full" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-bark/70">
                  Town square
                </span>
              </div>
              <div className="absolute right-[15%] top-[53%] hidden items-center gap-2 md:flex">
                <div className="location-marker h-4 w-4 rounded-full border border-grove/30 bg-grove/40" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-bark/70">
                  Training yard
                </span>
              </div>

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
                      <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-lg text-walnut shadow-medal">
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
                        <Chip tone="gold">{progressProfile.unlockedGames.length} unlocked</Chip>
                        <Chip tone="forest">Fast drills</Chip>
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
                        <Chip tone="ember">{reviewItems.length} due now</Chip>
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
                        <Chip tone="gold">{streakState.currentDays} days</Chip>
                        <Chip tone={streakState.streakProtected ? "forest" : "ember"}>
                          {streakState.streakProtected ? "Safe" : "At risk"}
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
              label={`Level ${progressProfile.level} to ${progressProfile.level + 1}`}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="inset-panel rounded-plaque border border-walnut/14 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-bark/55">Coins</p>
                <p className="mt-2 text-2xl font-semibold text-walnut">{progressProfile.coinsBalance}</p>
              </div>
              <div className="inset-panel rounded-plaque border border-walnut/14 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-bark/55">Achievements</p>
                <p className="mt-2 text-2xl font-semibold text-walnut">{unlockedAchievements}</p>
              </div>
              <div className="inset-panel rounded-plaque border border-walnut/14 p-4 text-center">
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
            <Chip tone="gold">{weeklyReport.completedScenarios} scenarios done</Chip>
            <Chip>{weeklyReport.retriesSucceeded} successful retries</Chip>
            <Chip tone="forest">{weeklyReport.missionsDone} real-life missions</Chip>
          </RewardBanner>
        </SectionCard>
      </div>
    </AppShell>
  );
}
