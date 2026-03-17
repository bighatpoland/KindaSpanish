import type { AttemptResult, TurnPrompt } from "@/entities/domain";

export interface GenerateTurnPromptInput {
  scenarioId: string;
  skillFocus: string;
}

export interface EvaluateAttemptInput {
  scenarioId: string;
  learnerReply: string;
  targetChunks: string[];
  expectedFunctions?: string[];
}

export interface SuggestRetryInput {
  learnerReply: string;
  primaryFeedback: string;
}

export interface AIConversationService {
  generateTurnPrompt(input: GenerateTurnPromptInput): Promise<TurnPrompt>;
  evaluateAttempt(input: EvaluateAttemptInput): Promise<AttemptResult>;
  suggestRetry(input: SuggestRetryInput): Promise<string>;
}
