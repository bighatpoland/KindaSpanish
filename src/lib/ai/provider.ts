import type {
  AIConversationService,
  EvaluateAttemptInput,
  GenerateTurnPromptInput,
  SuggestRetryInput
} from "@/lib/ai/types";
import {
  buildMockAttemptResult,
  buildMockRetry,
  buildMockTurnPrompt
} from "@/lib/ai/mock-evaluator";

export class MockAIConversationService implements AIConversationService {
  async generateTurnPrompt(input: GenerateTurnPromptInput) {
    return buildMockTurnPrompt(input);
  }

  async evaluateAttempt(input: EvaluateAttemptInput) {
    return buildMockAttemptResult(input);
  }

  async suggestRetry(input: SuggestRetryInput) {
    return buildMockRetry(input);
  }
}

export function getAIConversationService() {
  return new MockAIConversationService();
}
