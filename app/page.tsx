import { QuestTile } from "@/components/quest-tile";
import { RewardBanner } from "@/components/reward-banner";
import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { ProgressBar } from "@/components/progress-bar";
import { SectionCard } from "@/components/section-card";
import { progressProfile, streakState, userProfile } from "@/features/gamification/data";
import { getDailyHomeCards, getLevelProgress } from "@/features/gamification/selectors";
import { scenarios } from "@/features/scenarios/data";
import { arcadeGames } from "@/features/gamification/data";

export default function HomePage() {
  const cards = getDailyHomeCards(scenarios, arcadeGames, streakState);
  const level = getLevelProgress(progressProfile);
  const mainScenario = scenarios[0];
  const sideCards = cards.slice(1);

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
        <SectionCard title="Village map" eyebrow="Hub" accent="gold">
          <div className="relative overflow-hidden rounded-panel border border-bark/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,248,232,0.55),transparent_18%),radial-gradient(circle_at_80%_15%,rgba(80,121,108,0.16),transparent_20%),linear-gradient(180deg,rgba(245,233,205,0.98)_0%,rgba(222,202,160,0.96)_100%)] p-4">
            <div className="absolute left-[18%] top-[20%] h-20 w-20 rounded-full bg-gold/10 blur-2xl" />
            <div className="absolute right-[12%] top-[30%] h-16 w-16 rounded-full bg-teal/10 blur-2xl" />

            <div className="relative grid grid-cols-[1.3fr_0.7fr] gap-3">
              <QuestTile
                href={`/session/${mainScenario.id}`}
                variant="hero"
                eyebrow="Town gate"
                title="Continue"
                description={mainScenario.intent}
                chips={
                  <>
                    <Chip>{mainScenario.domain}</Chip>
                    <Chip>{mainScenario.estimatedMinutes} min</Chip>
                    <Chip>{mainScenario.targetChunks[0]}</Chip>
                  </>
                }
                footer={
                  <div className="flex items-center gap-3">
                    <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-lg text-bark shadow-medal">
                      ●
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-bark">Daily mission</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-bark/55">
                        One brave useful moment
                      </p>
                    </div>
                  </div>
                }
              />

              <div className="grid gap-3">
                <div className="medallion rounded-panel p-3 text-center text-bark shadow-medal">
                  <p className="text-[10px] uppercase tracking-[0.18em]">Level</p>
                  <p className="mt-1 text-2xl font-semibold">{progressProfile.level}</p>
                </div>
                <div className="medallion rounded-panel p-3 text-center text-bark shadow-medal">
                  <p className="text-[10px] uppercase tracking-[0.18em]">Streak</p>
                  <p className="mt-1 text-2xl font-semibold">{streakState.currentDays}d</p>
                </div>
                <div className="medallion rounded-panel p-3 text-center text-bark shadow-medal">
                  <p className="text-[10px] uppercase tracking-[0.18em]">Coins</p>
                  <p className="mt-1 text-2xl font-semibold">{progressProfile.coinsBalance}</p>
                </div>
              </div>
            </div>

            <div className="relative mt-4 grid grid-cols-2 gap-3">
              <QuestTile
                href="/arcade"
                eyebrow={sideCards[0]?.eyebrow ?? "Arcade"}
                title="Training grounds"
                description={
                  sideCards[0]?.body ?? "Fast loops for queues, dog walks, and panic-proof recall."
                }
              />

              <QuestTile
                eyebrow={sideCards[1]?.eyebrow ?? "Streak"}
                title="Lantern watch"
                description={sideCards[1]?.body ?? "One tiny run keeps today alive."}
              />

              <QuestTile
                eyebrow={sideCards[2]?.eyebrow ?? "Phrase win"}
                title="Scroll fragment"
                description={sideCards[2]?.body ?? "Start with one useful phrase."}
              />

              <QuestTile
                eyebrow="Mode"
                title="Dog-walk route"
                description={
                  userProfile.walkingMode
                    ? "Audio-first, one-hand friendly, and built for moving through the day."
                    : "Short, useful sessions that turn into real-life phrases."
                }
              />
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard title="Travel log" eyebrow="Campaign progress" accent="coral">
            <ProgressBar
              value={level.pct}
              label={`Level ${progressProfile.level} to ${progressProfile.level + 1}`}
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-plaque border border-bark/12 bg-[#f7ecd6]/95 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Dialect</p>
                <h3 className="mt-2 text-lg font-semibold text-bark">{userProfile.dialectMode}</h3>
              </div>
              <div className="rounded-plaque border border-bark/12 bg-[#f7ecd6]/95 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Time budget</p>
                <h3 className="mt-2 text-lg font-semibold text-bark">{userProfile.timeBudget}</h3>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Camp report" eyebrow="What counts" accent="teal">
            <RewardBanner
              title="Small wins are now worth something"
              body="The village rewards showing up, speaking again after feedback, and reacting before your mind goes blank."
              icon="✦"
            >
              <Chip>Dog-walk friendly</Chip>
              <Chip>One-hand flow</Chip>
              <Chip>Good enough beats perfect</Chip>
            </RewardBanner>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-plum/80">
              <li>6 real-life scenarios completed</li>
              <li>4 retries that got clearer on the second try</li>
              <li>2 real-world missions done outside the app</li>
              <li>Highest rewards come from speaking, listening, and delayed recall</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
