import Link from "next/link";
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

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
        <SectionCard title="Ready for real-life Spanish?" eyebrow="Today" accent="coral">
          <p className="text-sm leading-6 text-plum/80">
            {userProfile.walkingMode
              ? "Built for dog walks, queue moments, and tiny brave attempts."
              : "Built for short, useful sessions that turn into real-life phrases."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>{progressProfile.coinsBalance} coins</Chip>
            <Chip>{streakState.currentDays}-day streak</Chip>
            <Chip>Level {progressProfile.level}</Chip>
            <Chip>{userProfile.dialectMode}</Chip>
          </div>

          <div className="mt-5 grid gap-3">
            <Link
              href={`/session/${scenarios[0].id}`}
              className="rounded-pill bg-ink px-5 py-4 text-center text-sm font-semibold text-white"
            >
              Continue daily mission
            </Link>
            <Link
              href="/arcade"
              className="rounded-pill border border-ink/10 bg-white px-5 py-4 text-center text-sm font-semibold text-ink"
            >
              Play arcade sprint
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Progress that actually means something" eyebrow="Shared progression" accent="gold">
          <ProgressBar value={level.pct} label={`Level ${progressProfile.level} to ${progressProfile.level + 1}`} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-[22px] bg-white/85 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-plum/55">{card.eyebrow}</p>
                <h3 className="mt-2 text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-5 text-plum/75">{card.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="This week’s tiny wins" eyebrow="What counts" accent="teal">
          <ul className="space-y-3 text-sm leading-6 text-plum/80">
            <li>6 real-life scenarios completed</li>
            <li>4 retries that got clearer on the second try</li>
            <li>2 real-world missions done outside the app</li>
            <li>Highest rewards come from speaking, listening, and delayed recall</li>
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}

