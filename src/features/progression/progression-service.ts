"use client";

import type {
  ProgressProfile,
  StreakState,
  UserAchievementProgress,
  WeeklyReport
} from "@/entities/domain";
import { achievements, arcadeGames, userProfile } from "@/features/gamification/data";
import { loadArcadeRuns } from "@/features/arcade/arcade-service";
import { loadReviewItems } from "@/features/review/review-service";
import { loadSessionProgress } from "@/features/session/session-service";
import { scenarios } from "@/features/scenarios/data";

type ProgressionContext = {
  userId?: string;
  remoteEnabled?: boolean;
};

export type ProgressSnapshot = {
  profile: ProgressProfile;
  streak: StreakState;
  weeklyReport: WeeklyReport;
  achievementProgress: UserAchievementProgress[];
  unlockedAchievements: number;
  reviewDueNow: number;
  reviewTrackedCount: number;
  userProfileName: string;
};

function toDateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function computeStreak(activityDates: string[]): StreakState {
  if (activityDates.length === 0) {
    return {
      currentDays: 0,
      longestDays: 0,
      lastActiveAt: "No activity yet",
      streakProtected: false,
      saverUsed: false
    };
  }

  const uniqueDates = Array.from(new Set(activityDates.map(toDateKey))).sort();
  let longest = 1;
  let currentRun = 1;

  for (let index = 1; index < uniqueDates.length; index += 1) {
    const previous = new Date(uniqueDates[index - 1]).getTime();
    const current = new Date(uniqueDates[index]).getTime();
    const diffDays = Math.round((current - previous) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun += 1;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 1;
    }
  }

  const todayKey = toDateKey(new Date().toISOString());
  const lastActiveKey = uniqueDates[uniqueDates.length - 1];
  let currentDays = 1;

  for (let index = uniqueDates.length - 1; index > 0; index -= 1) {
    const current = new Date(uniqueDates[index]).getTime();
    const previous = new Date(uniqueDates[index - 1]).getTime();
    const diffDays = Math.round((current - previous) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentDays += 1;
    } else {
      break;
    }
  }

  return {
    currentDays,
    longestDays: longest,
    lastActiveAt: lastActiveKey,
    streakProtected: lastActiveKey === todayKey,
    saverUsed: false
  };
}

function computeLevelFromXp(xpTotal: number) {
  let level = 1;
  let threshold = 100;
  let consumed = 0;

  while (xpTotal >= consumed + threshold) {
    consumed += threshold;
    level += 1;
    threshold = 100 + (level - 1) * 35;
  }

  return {
    level,
    xpToNextLevel: consumed + threshold - xpTotal
  };
}

export async function loadProgressSnapshot(
  context?: ProgressionContext
): Promise<ProgressSnapshot> {
  const sessions = (
    await Promise.all(
      scenarios.map((scenario) =>
        loadSessionProgress(scenario.id, {
          userId: context?.userId,
          remoteEnabled: context?.remoteEnabled
        })
      )
    )
  ).filter(Boolean);

  const reviewItems = await loadReviewItems({
    userId: context?.userId,
    remoteEnabled: context?.remoteEnabled
  });
  const arcadeRuns = loadArcadeRuns();

  const completedScenarios = sessions.filter((session) => session?.status === "completed").length;
  const successfulAttempts = sessions.reduce(
    (count, session) =>
      count +
      (session?.attempts.filter((attempt) => attempt.result.functionHit).length ?? 0),
    0
  );
  const spokenAttempts = sessions.reduce(
    (count, session) =>
      count + (session?.attempts.filter((attempt) => attempt.inputMode === "speech").length ?? 0),
    0
  );
  const retryWins = sessions.reduce((count, session) => {
    const attempts = session?.attempts ?? [];
    return count + Math.max(0, attempts.filter((attempt) => attempt.result.functionHit).length - 1);
  }, 0);
  const fastAudioWins = sessions.filter(
    (session) =>
      session?.heardVariants.includes("fast") && Boolean(session.latestAttemptResult?.functionHit)
  ).length;
  const reviewedCount = reviewItems.filter((item) => item.lastReviewedAt).length;
  const dueNow = reviewItems.filter((item) => new Date(item.dueAt).getTime() <= Date.now()).length;

  const arcadeXp = arcadeRuns.reduce((sum, run) => sum + run.xpEarned, 0);
  const arcadeCoins = arcadeRuns.reduce((sum, run) => sum + run.coinsEarned, 0);
  const xpTotal =
    completedScenarios * 80 + successfulAttempts * 24 + reviewedCount * 15 + fastAudioWins * 12 + arcadeXp;
  const coinsBalance = completedScenarios * 12 + reviewedCount * 6 + retryWins * 4 + arcadeCoins;
  const levelData = computeLevelFromXp(xpTotal);
  const streak = computeStreak([
    ...sessions
      .map((session) => session?.completedAt ?? session?.updatedAt)
      .filter((value): value is string => Boolean(value)),
    ...reviewItems
      .map((item) => item.lastReviewedAt)
      .filter((value): value is string => Boolean(value))
  ]);

  const achievementProgress = achievements.map((achievement) => {
    let currentValue = 0;

    switch (achievement.criteriaType) {
      case "streak-days":
        currentValue = streak.currentDays;
        break;
      case "spoken-attempts":
        currentValue = spokenAttempts;
        break;
      case "retry-wins":
        currentValue = retryWins;
        break;
      case "real-life-missions":
        currentValue = completedScenarios;
        break;
      case "fast-audio-wins":
        currentValue =
          fastAudioWins + arcadeRuns.filter((run) => run.masterySignals.includes("listening confidence")).length;
        break;
      case "chunk-mastery":
        currentValue = reviewItems.filter((item) => item.easeState === "solid").length;
        break;
      default:
        currentValue = 0;
    }

    const unlocked = currentValue >= achievement.criteriaValue;

    return {
      achievementId: achievement.id,
      currentValue,
      unlockedAt: unlocked ? "Unlocked" : undefined,
      claimedAt: unlocked ? "Claimed" : undefined,
      tier: achievement.tier
    };
  });

  const unlockedGames = arcadeGames
    .filter((game) => {
      if (game.id === "what-did-they-mean") {
        return levelData.level >= 5;
      }

      if (game.id === "say-it-better") {
        return retryWins >= 3;
      }

      return true;
    })
    .map((game) => game.id);

  const weeklyReport: WeeklyReport = {
    completedScenarios,
    retriesSucceeded: retryWins,
    missionsDone: completedScenarios,
    stuckFunctions:
      dueNow > 0
        ? ["review due now"]
        : arcadeRuns.length === 0
          ? ["arcade not started"]
          : fastAudioWins === 0
            ? ["fast audio confidence"]
            : []
  };

  const profile: ProgressProfile = {
    level: levelData.level,
    xpTotal,
    xpToNextLevel: levelData.xpToNextLevel,
    coinsBalance,
    unlockedGames,
    unlockedThemeIds: ["quiet-confidence"]
  };

  return {
    profile,
    streak,
    weeklyReport,
    achievementProgress,
    unlockedAchievements: achievementProgress.filter((item) => item.unlockedAt).length,
    reviewDueNow: dueNow,
    reviewTrackedCount: reviewItems.length,
    userProfileName: userProfile.name
  };
}
