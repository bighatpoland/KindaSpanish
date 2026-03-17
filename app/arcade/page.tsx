import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { SectionCard } from "@/components/section-card";
import { arcadeGames, arcadeRunResults, progressProfile } from "@/features/gamification/data";

export default function ArcadePage() {
  return (
    <AppShell activePath="/arcade">
      <div className="space-y-4">
        <SectionCard title="Arcade is your second pillar" eyebrow="Fast loops" accent="teal">
          <p className="text-sm leading-6 text-plum/80">
            Play one-handed, get immediate rewards, and train the same chunks you need in shops,
            hallways, and delivery moments.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>{progressProfile.unlockedGames.length} games unlocked</Chip>
            <Chip>Solo-only progression</Chip>
            <Chip>No leaderboard pressure</Chip>
          </div>
        </SectionCard>

        <div className="space-y-3">
          {arcadeGames.map((game) => {
            const lastRun = arcadeRunResults.find((run) => run.gameId === game.id);
            const isUnlocked = progressProfile.unlockedGames.includes(game.id);
            return (
              <SectionCard
                key={game.id}
                title={game.name}
                eyebrow={`${game.durationSeconds}s • ${game.inputMode}`}
                accent={isUnlocked ? "gold" : "plum"}
              >
                <p className="text-sm leading-6 text-plum/80">{game.skillFocus}</p>
                <p className="mt-3 text-sm text-plum/70">{game.rewardProfile}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip>{isUnlocked ? "Unlocked" : game.unlockRule}</Chip>
                  {lastRun ? <Chip>Last score {lastRun.score}</Chip> : null}
                  {lastRun ? <Chip>+{lastRun.xpEarned} XP</Chip> : null}
                </div>
              </SectionCard>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

