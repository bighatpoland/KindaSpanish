import type {
  Achievement,
  ArcadeGame,
  ProgressProfile,
  Scenario,
  StreakState,
  UserAchievementProgress
} from "@/entities/domain";

export function getUnlockedAchievements(
  allAchievements: Achievement[],
  progressRows: UserAchievementProgress[]
) {
  return allAchievements
    .map((achievement) => {
      const progress = progressRows.find((row) => row.achievementId === achievement.id);
      return {
        ...achievement,
        progressValue: progress?.currentValue ?? 0,
        isUnlocked: Boolean(progress?.unlockedAt)
      };
    })
    .sort((a, b) => Number(b.isUnlocked) - Number(a.isUnlocked));
}

export function getLevelProgress(progress: ProgressProfile) {
  const levelFloor = progress.level * 100;
  const progressed = progress.xpTotal - levelFloor;
  const pct = Math.max(0, Math.min(100, Math.round((progressed / progress.xpToNextLevel) * 100)));
  return { progressed, pct };
}

export function getDailyHomeCards(
  scenarios: Scenario[],
  games: ArcadeGame[],
  streak: StreakState
) {
  return [
    {
      title: "Continue",
      eyebrow: "Daily mission",
      body: `${scenarios[0]?.intent ?? "Pick today’s scenario"} in ${scenarios[0]?.estimatedMinutes ?? 2} min`
    },
    {
      title: "Play Arcade",
      eyebrow: "Second pillar",
      body: `${games.length} games ready, built for queues and dog walks`
    },
    {
      title: "Save your streak",
      eyebrow: `${streak.currentDays}-day streak`,
      body: streak.streakProtected
        ? "You have a soft landing today with Queue Mode ready"
        : "One tiny run keeps the chain alive"
    },
    {
      title: "Today's phrase win",
      eyebrow: "Carry-away chunk",
      body: scenarios[0]?.targetChunks[0] ?? "Start with one useful phrase"
    }
  ];
}

