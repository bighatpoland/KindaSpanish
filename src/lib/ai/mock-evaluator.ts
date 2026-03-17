import type { AttemptResult, TurnPrompt } from "@/entities/domain";
import type {
  EvaluateAttemptInput,
  GenerateTurnPromptInput,
  SuggestRetryInput
} from "@/lib/ai/types";

export function buildMockTurnPrompt(input: GenerateTurnPromptInput): TurnPrompt {
  return {
    scenarioId: input.scenarioId,
    turnIndex: 0,
    audioTranscript: "Perdona, una pregunta rápida.",
    expectedFunctions: [input.skillFocus],
    hints: ["Keep it short", "Use the chunk you already know"]
  };
}

export function buildMockAttemptResult(input: EvaluateAttemptInput): AttemptResult {
  const normalizedReply = input.learnerReply.toLowerCase();
  const normalizedTarget = input.targetChunk.toLowerCase();
  const functionHit = normalizedReply.includes(normalizedTarget);

  return {
    comprehensibilityScore: functionHit ? 0.89 : 0.64,
    functionHit,
    primaryFeedback: functionHit
      ? "Clear enough to work in real life."
      : "The idea is there. Add one more useful chunk to make it land faster.",
    retryPrompt: functionHit
      ? "Try it once more with calmer pacing."
      : `Retry with "${input.targetChunk}" somewhere in the sentence.`,
    carryAwayChunk: input.targetChunk,
    avoidLongText: true
  };
}

export function buildMockRetry(input: SuggestRetryInput) {
  return `${input.primaryFeedback} One more go, but shorter.`;
}

