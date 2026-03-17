import type {
  Achievement,
  ArcadeGame,
  ArcadeRunResult,
  ProgressProfile,
  Reward,
  StreakState,
  UserAchievementProgress,
  UserProfile,
  WeeklyReport
} from "@/entities/domain";

export const userProfile: UserProfile = {
  name: "You",
  timeBudget: "15 minutes a day",
  prefersAudio: true,
  walkingMode: true,
  dialectMode: "andalusian-light"
};

export const progressProfile: ProgressProfile = {
  level: 4,
  xpTotal: 380,
  xpToNextLevel: 120,
  coinsBalance: 145,
  unlockedGames: ["rapid-reply", "catch-the-chunk", "queue-mode"],
  unlockedThemeIds: ["sunrise-tile", "quiet-confidence"]
};

export const streakState: StreakState = {
  currentDays: 3,
  longestDays: 7,
  lastActiveAt: "Today",
  streakProtected: true,
  saverUsed: false
};

export const achievements: Achievement[] = [
  {
    id: "first-good-enough",
    category: "courage",
    title: "First Good Enough",
    description: "Finish your first spoken attempt without chasing perfect grammar.",
    tier: "bronze",
    unlockReward: { type: "xp", value: 40, label: "+40 XP" },
    criteriaType: "spoken-attempts",
    criteriaValue: 1,
    rarity: "common"
  },
  {
    id: "three-day-streak",
    category: "consistency",
    title: "3-Day Streak",
    description: "Show up three days in a row, even if one of them is tiny.",
    tier: "bronze",
    unlockReward: { type: "coins", value: 35, label: "+35 coins" },
    criteriaType: "streak-days",
    criteriaValue: 3,
    rarity: "common"
  },
  {
    id: "said-it-again",
    category: "courage",
    title: "Said It Again",
    description: "Retry after feedback and make the sentence clearer the second time.",
    tier: "silver",
    unlockReward: {
      type: "unlock",
      unlockTarget: "say-it-better",
      label: "Unlock Say It Better"
    },
    criteriaType: "retry-wins",
    criteriaValue: 3,
    rarity: "rare"
  },
  {
    id: "understood-the-courier",
    category: "real-life",
    title: "Understood the Courier",
    description: "Handle a package moment with one useful phrase and one calm reply.",
    tier: "silver",
    unlockReward: { type: "identity", label: "Courier Energy" },
    criteriaType: "real-life-missions",
    criteriaValue: 1,
    rarity: "rare"
  },
  {
    id: "heard-it-fast",
    category: "listening",
    title: "Heard It Fast",
    description: "Catch meaning in the faster audio version without freezing.",
    tier: "gold",
    unlockReward: {
      type: "cosmetic",
      cosmeticId: "speed-glow",
      label: "Unlock Speed Glow card skin"
    },
    criteriaType: "fast-audio-wins",
    criteriaValue: 5,
    rarity: "epic"
  }
];

export const userAchievementProgress: UserAchievementProgress[] = [
  {
    achievementId: "first-good-enough",
    currentValue: 1,
    unlockedAt: "Today",
    claimedAt: "Today",
    tier: "bronze"
  },
  {
    achievementId: "three-day-streak",
    currentValue: 3,
    unlockedAt: "Today",
    tier: "bronze"
  },
  {
    achievementId: "said-it-again",
    currentValue: 2,
    tier: "silver"
  },
  {
    achievementId: "understood-the-courier",
    currentValue: 1,
    tier: "silver"
  },
  {
    achievementId: "heard-it-fast",
    currentValue: 2,
    tier: "gold"
  }
];

export const rewardCatalog: Reward[] = [
  { type: "unlock", unlockTarget: "queue-mode", label: "Unlock Queue Mode" },
  { type: "cosmetic", cosmeticId: "quiet-confidence", label: "Quiet Confidence theme" },
  { type: "identity", label: "Neighbor Level 1 title" }
];

export const arcadeGames: ArcadeGame[] = [
  {
    id: "rapid-reply",
    name: "Rapid Reply",
    skillFocus: "Quick spoken response to a short real-life prompt",
    durationSeconds: 60,
    inputMode: "mixed",
    unlockRule: "Available from day one",
    rewardProfile: "High XP for spoken retry and clear intent"
  },
  {
    id: "catch-the-chunk",
    name: "Catch the Chunk",
    skillFocus: "Spot the useful phrase hidden inside fast audio",
    durationSeconds: 45,
    inputMode: "tap",
    unlockRule: "Available from day one",
    rewardProfile: "Coins and listening mastery"
  },
  {
    id: "what-did-they-mean",
    name: "What Did They Mean?",
    skillFocus: "Map messy real speech to the right intent",
    durationSeconds: 75,
    inputMode: "tap",
    unlockRule: "Unlock at level 5",
    rewardProfile: "Higher XP for fast accurate listening"
  },
  {
    id: "say-it-better",
    name: "Say It Better",
    skillFocus: "Retry after feedback and sharpen a useful phrase",
    durationSeconds: 90,
    inputMode: "speak",
    unlockRule: "Unlock via Said It Again achievement",
    rewardProfile: "Highest reward for productive retry"
  },
  {
    id: "queue-mode",
    name: "Queue Mode",
    skillFocus: "Ultra-short listening and reaction loop for busy moments",
    durationSeconds: 30,
    inputMode: "mixed",
    unlockRule: "Unlocked early as a streak saver",
    rewardProfile: "Low friction streak and coin rewards"
  }
];

export const arcadeRunResults: ArcadeRunResult[] = [
  {
    gameId: "rapid-reply",
    score: 860,
    accuracy: 0.82,
    speedBonus: 70,
    xpEarned: 55,
    coinsEarned: 14,
    masterySignals: ["spoken attempt", "clear intent", "retry-ready"]
  },
  {
    gameId: "catch-the-chunk",
    score: 790,
    accuracy: 0.88,
    speedBonus: 45,
    xpEarned: 40,
    coinsEarned: 18,
    masterySignals: ["chunk recognition", "fast audio"]
  }
];

export const weeklyReport: WeeklyReport = {
  completedScenarios: 6,
  retriesSucceeded: 4,
  missionsDone: 2,
  stuckFunctions: ["asking for clarification", "fast shop audio"]
};

