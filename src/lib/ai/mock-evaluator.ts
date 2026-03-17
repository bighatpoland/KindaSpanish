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
  const matchedChunk =
    input.targetChunks.find((chunk) => normalizedReply.includes(chunk.toLowerCase())) ??
    input.targetChunks[0];
  const hasEnoughWords = normalizedReply.split(/\s+/).filter(Boolean).length >= 2;
  const functionHit = Boolean(matchedChunk && hasEnoughWords);
  const expectedFunctionCue = input.expectedFunctions?.[0];

  return {
    comprehensibilityScore: functionHit ? 0.9 : hasEnoughWords ? 0.72 : 0.58,
    functionHit,
    primaryFeedback: functionHit
      ? expectedFunctionCue
        ? `Clear enough to handle the ${expectedFunctionCue} moment in real life.`
        : "Clear enough to work in real life."
      : hasEnoughWords
        ? "The idea is there. Add one stronger survival chunk so the meaning lands faster."
        : "Make it one beat longer so the other person can understand what you need.",
    retryPrompt: functionHit
      ? "Try it once more with calmer pacing."
      : `Retry with "${matchedChunk}" somewhere in the sentence.`,
    carryAwayChunk: matchedChunk,
    avoidLongText: true
  };
}

export function buildMockRetry(input: SuggestRetryInput) {
  return `${input.primaryFeedback} One more go, but shorter.`;
}
