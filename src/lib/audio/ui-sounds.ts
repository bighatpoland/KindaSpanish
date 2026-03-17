export const uiSounds = {
  dailyReminder: "/audio/ui/daily-reminder.wav",
  streakReminder: "/audio/ui/streak-reminder.wav",
  streakWarningSoft: "/audio/ui/streak-warning-soft.wav",
  missionReady: "/audio/ui/mission-ready.wav",
  retrySoft: "/audio/ui/retry-soft.wav",
  rewardClaim: "/audio/ui/reward-claim.wav",
  successClear: "/audio/ui/success-clear.wav",
  arcadeUnlock: "/audio/ui/arcade-unlock.wav",
  levelUp: "/audio/ui/level-up.wav"
} as const;

export type UISoundName = keyof typeof uiSounds;
