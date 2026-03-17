"use client";

import { useEffect, useState } from "react";
import { ARCADE_RUNS_UPDATED_EVENT } from "@/features/arcade/arcade-service";
import { useSupabaseAuth } from "@/components/supabase-auth-provider";
import { REVIEW_QUEUE_UPDATED_EVENT } from "@/features/review/review-service";
import { SESSION_PROGRESS_UPDATED_EVENT } from "@/features/session/session-service";
import { loadProgressSnapshot, type ProgressSnapshot } from "@/features/progression/progression-service";

export function useProgressSnapshot() {
  const { userId, isRemoteReady } = useSupabaseAuth();
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const nextSnapshot = await loadProgressSnapshot({
        userId,
        remoteEnabled: isRemoteReady
      });

      if (!cancelled) {
        setSnapshot(nextSnapshot);
      }
    };

    void hydrate();

    const refresh = () => {
      void hydrate();
    };

    window.addEventListener(ARCADE_RUNS_UPDATED_EVENT, refresh);
    window.addEventListener(REVIEW_QUEUE_UPDATED_EVENT, refresh);
    window.addEventListener(SESSION_PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener(ARCADE_RUNS_UPDATED_EVENT, refresh);
      window.removeEventListener(REVIEW_QUEUE_UPDATED_EVENT, refresh);
      window.removeEventListener(SESSION_PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [isRemoteReady, userId]);

  return snapshot;
}
