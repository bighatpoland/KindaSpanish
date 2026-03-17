import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ArcadeCatchTheChunkClient } from "@/components/arcade-catch-the-chunk-client";
import { SectionCard } from "@/components/section-card";

export default async function ArcadeGamePage({
  params
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  if (gameId !== "catch-the-chunk") {
    notFound();
  }

  return (
    <AppShell activePath="/arcade">
      <div className="space-y-4">
        <SectionCard title="Catch the Chunk" eyebrow="Playable station" accent="gold">
          <ArcadeCatchTheChunkClient />
        </SectionCard>
      </div>
    </AppShell>
  );
}
