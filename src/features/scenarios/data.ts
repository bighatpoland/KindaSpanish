import { scenarioSeeds } from "../../../content/scenario-seeds";
import type { MissionLink, ReviewItem, Scenario, TurnPrompt } from "@/entities/domain";

export const scenarios: Scenario[] = [...scenarioSeeds];

export const turnPrompts: Record<string, TurnPrompt[]> = {
  "courier-dropoff": [
    {
      scenarioId: "courier-dropoff",
      turnIndex: 0,
      audioTranscript: "Hola, traigo un paquete para ti.",
      expectedFunctions: ["confirm package", "buy time politely"],
      hints: ["Start small", "Use one familiar chunk"]
    }
  ],
  "corner-shop": [
    {
      scenarioId: "corner-shop",
      turnIndex: 0,
      audioTranscript: "Perdona, que necesitas?",
      expectedFunctions: ["ask for item", "listen for location"],
      hints: ["One noun is enough", "Polite beats perfect"]
    }
  ],
  "neighbor-small-talk": [
    {
      scenarioId: "neighbor-small-talk",
      turnIndex: 0,
      audioTranscript: "Que tal? Todo bien?",
      expectedFunctions: ["greet", "tiny talk"],
      hints: ["Keep it warm", "Short answers still count"]
    }
  ]
};

export const reviewItems: ReviewItem[] = [
  {
    id: "review-courier-1",
    chunk: "un momento",
    sentence: "Si, un momento. Ya voy.",
    audioRef: "courier-dropoff:neutral",
    nextReviewAt: "Tonight",
    easeState: "warming"
  },
  {
    id: "review-shop-1",
    chunk: "tienes",
    sentence: "Perdona, tienes pan integral?",
    audioRef: "corner-shop:neutral",
    nextReviewAt: "Tomorrow",
    easeState: "fresh"
  },
  {
    id: "review-neighbor-1",
    chunk: "todo bien",
    sentence: "Si, todo bien. Y tu?",
    audioRef: "neighbor-small-talk:andalusian-light",
    nextReviewAt: "Tomorrow morning",
    easeState: "warming"
  }
];

export const missionLinks: MissionLink[] = [
  {
    sourceScenarioId: "courier-dropoff",
    relatedArcadeGameIds: ["rapid-reply", "queue-mode"],
    recommendedReviewItems: ["review-courier-1"]
  },
  {
    sourceScenarioId: "corner-shop",
    relatedArcadeGameIds: ["catch-the-chunk", "what-did-they-mean"],
    recommendedReviewItems: ["review-shop-1"]
  },
  {
    sourceScenarioId: "neighbor-small-talk",
    relatedArcadeGameIds: ["say-it-better", "queue-mode"],
    recommendedReviewItems: ["review-neighbor-1"]
  }
];

export function getScenarioById(id: string) {
  return scenarios.find((scenario) => scenario.id === id);
}

