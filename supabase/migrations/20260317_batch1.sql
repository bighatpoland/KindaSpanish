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

alter table public.profiles enable row level security;
alter table public.review_items enable row level security;
alter table public.scenario_sessions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "review_items_select_own" on public.review_items;
create policy "review_items_select_own" on public.review_items
for select using (auth.uid() = user_id);

drop policy if exists "review_items_write_own" on public.review_items;
create policy "review_items_write_own" on public.review_items
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "scenario_sessions_select_own" on public.scenario_sessions;
create policy "scenario_sessions_select_own" on public.scenario_sessions
for select using (auth.uid() = user_id);

drop policy if exists "scenario_sessions_write_own" on public.scenario_sessions;
create policy "scenario_sessions_write_own" on public.scenario_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
