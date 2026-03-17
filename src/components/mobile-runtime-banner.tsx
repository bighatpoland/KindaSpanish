"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/chip";

type RuntimeInfo = {
  online: boolean;
  supportsAudio: boolean;
  supportsMic: boolean;
  standalone: boolean;
};

export function MobileRuntimeBanner() {
  const [runtime, setRuntime] = useState<RuntimeInfo | null>(null);

  useEffect(() => {
    const computeRuntime = () => {
      setRuntime({
        online: navigator.onLine,
        supportsAudio: typeof window.Audio !== "undefined",
        supportsMic: Boolean(
          navigator.mediaDevices &&
            typeof navigator.mediaDevices.getUserMedia === "function"
        ),
        standalone: window.matchMedia("(display-mode: standalone)").matches
      });
    };

    computeRuntime();
    window.addEventListener("online", computeRuntime);
    window.addEventListener("offline", computeRuntime);

    return () => {
      window.removeEventListener("online", computeRuntime);
      window.removeEventListener("offline", computeRuntime);
    };
  }, []);

  if (!runtime) {
    return null;
  }

  const needsBanner = !runtime.online || !runtime.supportsMic || !runtime.standalone;

  if (!needsBanner) {
    return null;
  }

  return (
    <div className="mb-4 rounded-panel border border-bark/12 bg-[#f7ecd6]/95 px-4 py-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-bark/60">Phone testing</p>
      <p className="mt-1 text-sm leading-6 text-plum/80">
        {runtime.online
          ? "This build is phone-ready, but some device features still need the right browser setup."
          : "You are offline right now, so live features and future sync will be limited."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip>{runtime.online ? "Online" : "Offline"}</Chip>
        <Chip>{runtime.supportsAudio ? "Audio ok" : "Audio unavailable"}</Chip>
        <Chip>{runtime.supportsMic ? "Mic API ready" : "Mic API missing"}</Chip>
        <Chip>{runtime.standalone ? "Installed mode" : "Browser mode"}</Chip>
      </div>
      {!runtime.standalone ? (
        <p className="mt-3 text-xs leading-5 text-bark/70">
          Tip: add the app to your home screen for cleaner phone testing and fewer browser UI
          interruptions.
        </p>
      ) : null}
    </div>
  );
}

