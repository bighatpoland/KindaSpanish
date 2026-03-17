import type {
  AIConversationService,
  EvaluateAttemptInput,
  GenerateTurnPromptInput,
  SuggestRetryInput
} from "@/lib/ai/types";

export class MockAIConversationService implements AIConversationService {
  async generateTurnPrompt(input: GenerateTurnPromptInput) {
    return {
      scenarioId: input.scenarioId,
      turnIndex: 0,
      audioTranscript: "Perdona, una pregunta rápida.",
      expectedFunctions: [input.skillFocus],
      hints: ["Keep it short", "Use the chunk you already know"]
    };
  }

  async evaluateAttempt(input: EvaluateAttemptInput) {
    const functionHit = input.learnerReply.toLowerCase().includes(input.targetChunk.toLowerCase());

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

  async suggestRetry(input: SuggestRetryInput) {
    return `${input.primaryFeedback} One more go, but shorter.`;
  }
}

export function getAIConversationService() {
  return new MockAIConversationService();
}

