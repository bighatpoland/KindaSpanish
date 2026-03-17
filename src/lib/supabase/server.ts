import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseEnv } from "@/lib/env";
import type { AppSupabaseClient } from "@/lib/supabase/client";

export function createServerSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.SUPABASE_SERVICE_ROLE_KEY ?? (env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)
  ) as AppSupabaseClient;
}
