import type { SessionProgress } from "@/entities/domain";

export interface SessionRepository {
  loadProgress: (scenarioId: string) => SessionProgress | null;
  saveProgress: (progress: SessionProgress) => void;
  clearProgress: (scenarioId: string) => void;
}
