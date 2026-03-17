"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type SoundSettingsContextValue = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  hydrated: boolean;
};

const STORAGE_KEY = "kinda-spanish-sound-enabled";

const SoundSettingsContext = createContext<SoundSettingsContextValue | null>(null);

export function SoundProvider({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setEnabled(stored === "true");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled, hydrated]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      hydrated
    }),
    [enabled, hydrated]
  );

  return <SoundSettingsContext.Provider value={value}>{children}</SoundSettingsContext.Provider>;
}

export function useSoundSettings() {
  const context = useContext(SoundSettingsContext);

  if (!context) {
    throw new Error("useSoundSettings must be used within SoundProvider");
  }

  return context;
}

