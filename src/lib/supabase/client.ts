import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabaseEnv } from "@/lib/env";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type LooseTableShape = {
  Row: Record<string, Json | null>;
  Insert: Record<string, Json | null>;
  Update: Record<string, Json | null>;
  Relationships: [];
};

type SupabaseDatabase = {
  public: {
    Tables: Record<string, LooseTableShape>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type AppSupabaseClient = SupabaseClient<SupabaseDatabase>;

let browserSupabaseClient: AppSupabaseClient | null = null;

export function createBrowserSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  if (!browserSupabaseClient) {
    browserSupabaseClient = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL as string,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    ) as AppSupabaseClient;
  }

  return browserSupabaseClient;
}
