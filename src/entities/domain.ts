export type ScenarioDifficulty = "starter" | "steady" | "stretch";

export type RewardType =
  | "xp"
  | "coins"
  | "unlock"
  | "cosmetic"
  | "identity";

export type AchievementCategory =
  | "consistency"
  | "courage"
  | "real-life"
  | "fluency-chunks"
  | "listening";

export type AchievementTier = "bronze" | "silver" | "gold";

export type CriteriaType =
  | "streak-days"
  | "spoken-attempts"
  | "retry-wins"
  | "real-life-missions"
  | "fast-audio-wins"
  | "chunk-mastery";

export type InputMode = "tap" | "speak" | "mixed";
export type SessionAttemptInputMode = "speech" | "typed";
export type ReviewOutcome = "again" | "good" | "easy";
export type ReviewState = "fresh" | "warming" | "solid";
export type SessionProgressStatus =
  | "not-started"
  | "listening"
  | "ready-to-respond"
  | "responding"
  | "feedback-ready"
  | "completed";
export type SpeechCaptureStatus =
  | "unsupported"
  | "ready"
  | "requesting-permission"
  | "recording"
  | "transcribing"
  | "done"
  | "error";

export interface ScenarioAudioClip {
  id: string;
  variant: string;
  transcript: string;
  src?: string;
  playbackRate?: number;
  ttsFallback: boolean;
}

export interface Reward {
  type: RewardType;
  value?: number;
  unlockTarget?: string;
  cosmeticId?: string;
  label: string;
}

export interface Scenario {
  id: string;
  domain: string;
  intent: string;
  difficulty: ScenarioDifficulty;
  estimatedMinutes: number;
  quickStartPrompt: string;
  transcript: readonly string[];
  targetChunks: readonly string[];
  mission: string;
  audioClips: readonly ScenarioAudioClip[];
}

export interface TurnPrompt {
  scenarioId: string;
  turnIndex: number;
  audioTranscript: string;
  expectedFunctions: string[];
  hints: string[];
}

export interface AttemptResult {
  comprehensibilityScore: number;
  functionHit: boolean;
  primaryFeedback: string;
  retryPrompt: string;
  carryAwayChunk: string;
  avoidLongText: boolean;
}

export interface ReviewItem {
  id: string;
  scenarioId: string;
  chunk: string;
  sentence: string;
  audioRef: string;
  dueAt: string;
  easeState: ReviewState;
  intervalDays: number;
  repetitions: number;
  lastReviewedAt?: string;
}

export interface ReviewQueue {
  dueNow: ReviewItem[];
  upcoming: ReviewItem[];
  totalDue: number;
}

export interface WeeklyReport {
  completedScenarios: number;
  retriesSucceeded: number;
  missionsDone: number;
  stuckFunctions: string[];
}

export interface UserProfile {
  name: string;
  timeBudget: string;
  prefersAudio: boolean;
  walkingMode: boolean;
  dialectMode: "neutral" | "andalusian-light";
}

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  tier: AchievementTier;
  unlockReward: Reward;
  criteriaType: CriteriaType;
  criteriaValue: number;
  rarity: "common" | "rare" | "epic";
}

export interface UserAchievementProgress {
  achievementId: string;
  currentValue: number;
  unlockedAt?: string;
  claimedAt?: string;
  tier: AchievementTier;
}

export interface ArcadeGame {
  id: string;
  name: string;
  skillFocus: string;
  durationSeconds: number;
  inputMode: InputMode;
  unlockRule: string;
  rewardProfile: string;
}

export interface ArcadeRunResult {
  gameId: string;
  score: number;
  accuracy: number;
  speedBonus: number;
  xpEarned: number;
  coinsEarned: number;
  masterySignals: string[];
}

export interface StreakState {
  currentDays: number;
  longestDays: number;
  lastActiveAt: string;
  streakProtected: boolean;
  saverUsed: boolean;
}

export interface ProgressProfile {
  level: number;
  xpTotal: number;
  xpToNextLevel: number;
  coinsBalance: number;
  unlockedGames: string[];
  unlockedThemeIds: string[];
}

export interface MissionLink {
  sourceScenarioId: string;
  relatedArcadeGameIds: string[];
  recommendedReviewItems: string[];
}

export interface SessionState {
  scenarioId: string;
  currentTurn: number;
  startedAt: string;
  lastCheckpoint: string;
  completionState: "active" | "retry-ready" | "finished";
}

export interface SessionAttempt {
  id: string;
  scenarioId: string;
  inputMode: SessionAttemptInputMode;
  transcript: string;
  createdAt: string;
  result: AttemptResult;
}

export interface SessionProgress {
  sessionId: string;
  scenarioId: string;
  status: SessionProgressStatus;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  heardVariants: string[];
  latestTranscript: string;
  latestAttemptResult?: AttemptResult;
  attemptCount: number;
  lastInputMode?: SessionAttemptInputMode;
  attempts: SessionAttempt[];
  playbackError?: string;
  fallbackMode?: "file" | "tts";
}
