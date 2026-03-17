"use client";

import { useCallback, useRef } from "react";
import { UISoundName, uiSounds } from "@/lib/audio/ui-sounds";
import { useSoundSettings } from "@/components/sound-provider";

type UseSoundOptions = {
  volume?: number;
};

export function useSound(defaultSound?: UISoundName, options?: UseSoundOptions) {
  const { enabled, hydrated } = useSoundSettings();
  const audioCache = useRef(new Map<string, HTMLAudioElement>());

  return useCallback(
    (soundName?: UISoundName) => {
      const key = soundName ?? defaultSound;

      if (!key || !enabled || !hydrated || typeof window === "undefined") {
        return;
      }

      let audio = audioCache.current.get(key);

      if (!audio) {
        audio = new Audio(uiSounds[key]);
        audio.preload = "auto";
        audioCache.current.set(key, audio);
      }

      audio.currentTime = 0;
      audio.volume = options?.volume ?? 0.55;
      void audio.play().catch(() => {
        // Ignore autoplay/user gesture failures; UI remains functional.
      });
    },
    [defaultSound, enabled, hydrated, options?.volume]
  );
}

