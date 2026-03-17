import type { SessionProgress } from "@/entities/domain";

export interface SessionRepository {
  loadProgress: (scenarioId: string, userId?: string) => Promise<SessionProgress | null>;
  saveProgress: (progress: SessionProgress, userId?: string) => Promise<void>;
  clearProgress: (scenarioId: string, userId?: string) => Promise<void>;
}
