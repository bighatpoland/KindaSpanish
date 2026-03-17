"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { AppSupabaseClient } from "@/lib/supabase/client";

type SupabaseAuthState = {
  client: AppSupabaseClient | null;
  user: User | null;
  userId?: string;
  isRemoteReady: boolean;
  status: "disabled" | "booting" | "ready" | "error";
};

const SupabaseAuthContext = createContext<SupabaseAuthState>({
  client: null,
  user: null,
  userId: undefined,
  isRemoteReady: false,
  status: "disabled"
});

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createBrowserSupabaseClient(), []);
  const [state, setState] = useState<SupabaseAuthState>({
    client,
    user: null,
    userId: undefined,
    isRemoteReady: false,
    status: client ? "booting" : "disabled"
  });

  useEffect(() => {
    if (!client) {
      return;
    }

    let cancelled = false;

    const boot = async () => {
      try {
        const sessionResult = await client.auth.getSession();
        let user = sessionResult.data.session?.user ?? null;

        if (!user) {
          const authResult = await client.auth.signInAnonymously();
          user = authResult.data.user ?? null;
        }

        if (user?.id) {
          try {
            await client.from("profiles").upsert(
              {
                id: user.id,
                prefers_audio: true,
                walking_mode: true,
                dialect_mode: "andalusian-light"
              },
              { onConflict: "id" }
            );
          } catch {
            // Ignore when backend tables are not provisioned yet.
          }
        }

        if (!cancelled) {
          setState({
            client,
            user,
            userId: user?.id,
            isRemoteReady: Boolean(user?.id),
            status: user?.id ? "ready" : "error"
          });
        }
      } catch {
        if (!cancelled) {
          setState({
            client,
            user: null,
            userId: undefined,
            isRemoteReady: false,
            status: "error"
          });
        }
      }
    };

    void boot();

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;

      setState({
        client,
        user,
        userId: user?.id,
        isRemoteReady: Boolean(user?.id),
        status: user?.id ? "ready" : "error"
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [client]);

  return <SupabaseAuthContext.Provider value={state}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() {
  return useContext(SupabaseAuthContext);
}
