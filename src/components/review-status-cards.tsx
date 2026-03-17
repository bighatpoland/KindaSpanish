"use client";

import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/components/supabase-auth-provider";
import { loadReviewItems, loadReviewQueue, REVIEW_QUEUE_UPDATED_EVENT } from "@/features/review/review-service";

type ReviewStatus = {
  dueNow: number;
  totalItems: number;
  solidItems: number;
};

export function ReviewStatusCards() {
  const { userId, isRemoteReady } = useSupabaseAuth();
  const [status, setStatus] = useState<ReviewStatus>({
    dueNow: 0,
    totalItems: 0,
    solidItems: 0
  });

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const [queue, items] = await Promise.all([
        loadReviewQueue({
          userId,
          remoteEnabled: isRemoteReady
        }),
        loadReviewItems({
          userId,
          remoteEnabled: isRemoteReady
        })
      ]);

      if (!cancelled) {
        setStatus({
          dueNow: queue.totalDue,
          totalItems: items.length,
          solidItems: items.filter((item) => item.easeState === "solid").length
        });
      }
    };

    void hydrate();

    const refresh = () => {
      void hydrate();
    };

    window.addEventListener(REVIEW_QUEUE_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener(REVIEW_QUEUE_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [isRemoteReady, userId]);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Due now</p>
        <p className="mt-2 text-2xl font-semibold text-bark">{status.dueNow}</p>
      </div>
      <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Tracked phrases</p>
        <p className="mt-2 text-2xl font-semibold text-bark">{status.totalItems}</p>
      </div>
      <div className="courtyard-tile rounded-plaque border border-cypress/16 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Solid</p>
        <p className="mt-2 text-2xl font-semibold text-bark">{status.solidItems}</p>
      </div>
    </div>
  );
}
