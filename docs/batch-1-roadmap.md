# Batch 1 Roadmap: Auth, Remote Review, Remote Session Restore

## Goal
Make Kinda Spanish ready for real persistence without breaking the current local-first prototype.

Batch 1 delivers:
- Supabase anonymous auth bootstrap
- remote-backed review repository
- remote-backed session progress repository
- one-time local migration for review and session restore
- safe fallback to local storage when Supabase is not configured yet

## Exact Supabase Tables

### `profiles`
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text null,
  time_budget_minutes int null,
  prefers_audio boolean not null default true,
  walking_mode boolean not null default true,
  dialect_mode text null default 'neutral',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
```

### `review_items`
```sql
create table if not exists public.review_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  scenario_id text not null,
  chunk text not null,
  sentence text not null,
  audio_ref text not null,
  due_at timestamptz not null,
  ease_state text not null check (ease_state in ('fresh', 'warming', 'solid')),
  interval_days int not null default 1,
  repetitions int not null default 0,
  last_reviewed_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, client_id)
);
```

### `scenario_sessions`
```sql
create table if not exists public.scenario_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  session_id text not null,
  status text not null check (
    status in ('not-started', 'listening', 'ready-to-respond', 'responding', 'feedback-ready', 'completed')
  ),
  started_at timestamptz not null,
  updated_at timestamptz not null,
  completed_at timestamptz null,
  heard_variants jsonb not null default '[]'::jsonb,
  latest_transcript text not null default '',
  latest_attempt_result jsonb null,
  attempt_count int not null default 0,
  last_input_mode text null check (last_input_mode in ('speech', 'typed')),
  playback_error text null,
  fallback_mode text null check (fallback_mode in ('file', 'tts')),
  primary key (user_id, scenario_id)
);
```

## Exact RLS Policies
```sql
alter table public.profiles enable row level security;
alter table public.review_items enable row level security;
alter table public.scenario_sessions enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_upsert_own" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "review_items_select_own" on public.review_items
for select using (auth.uid() = user_id);

create policy "review_items_write_own" on public.review_items
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "scenario_sessions_select_own" on public.scenario_sessions
for select using (auth.uid() = user_id);

create policy "scenario_sessions_write_own" on public.scenario_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Route Handlers For Batch 1

Batch 1 can work directly through the browser Supabase client, so no server route handlers are strictly required yet.

These are the exact route handlers we should add next if we decide to move orchestration server-side:
- `GET /api/auth/status`
  - return whether Supabase env is configured and whether auth bootstrap succeeded
- `POST /api/review/migrate`
  - trigger manual migration of local review items into remote storage
- `GET /api/session/[id]/restore`
  - return canonical remote session restore payload for one scenario

For this batch, we keep the implementation simpler:
- auth bootstrap runs in a client provider
- review migration happens inside the review service
- session restore happens inside the session service

## File / Module Checklist

### Implemented in Batch 1
- [app/layout.tsx](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/app/layout.tsx)
- [src/components/supabase-auth-provider.tsx](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/components/supabase-auth-provider.tsx)
- [src/lib/supabase/client.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/lib/supabase/client.ts)
- [src/lib/supabase/server.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/lib/supabase/server.ts)
- [src/features/review/review-service.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/features/review/review-service.ts)
- [src/features/review/local-review-repository.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/features/review/local-review-repository.ts)
- [src/features/review/supabase-review-repository.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/features/review/supabase-review-repository.ts)
- [src/features/session/session-service.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/features/session/session-service.ts)
- [src/features/session/local-session-repository.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/features/session/local-session-repository.ts)
- [src/features/session/supabase-session-repository.ts](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/features/session/supabase-session-repository.ts)
- [src/components/review-practice-client.tsx](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/components/review-practice-client.tsx)
- [src/components/session-practice-client.tsx](/Users/konstancjatanjga/Documents/Coding/KindaSpanish/src/components/session-practice-client.tsx)

### Environment checklist
- set `NEXT_PUBLIC_SUPABASE_URL`
- set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- optional: set `SUPABASE_SERVICE_ROLE_KEY` for future server orchestration

### Verification checklist
- first app load creates or restores an anonymous Supabase session
- review still works with no Supabase env
- review migrates local queue once when Supabase is enabled
- session restore still works with no Supabase env
- session progress saves remotely when Supabase is enabled

## Done Criteria
- anonymous auth bootstraps automatically
- review and session services prefer remote repositories when available
- local data is migrated once and not duplicated
- app remains functional if remote persistence is not configured yet
