
-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  partner_name text,
  partner_phone text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Dumps and items
create type public.dump_category as enum ('groceries','deadlines','actions','partner');

create table public.dumps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_transcript text not null,
  created_at timestamptz not null default now()
);
alter table public.dumps enable row level security;
create policy "own dumps select" on public.dumps for select to authenticated using (auth.uid() = user_id);
create policy "own dumps insert" on public.dumps for insert to authenticated with check (auth.uid() = user_id);
create policy "own dumps delete" on public.dumps for delete to authenticated using (auth.uid() = user_id);

create table public.dump_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dump_id uuid references public.dumps(id) on delete set null,
  category public.dump_category not null,
  content text not null,
  done boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);
alter table public.dump_items enable row level security;
create policy "own items select" on public.dump_items for select to authenticated using (auth.uid() = user_id);
create policy "own items insert" on public.dump_items for insert to authenticated with check (auth.uid() = user_id);
create policy "own items update" on public.dump_items for update to authenticated using (auth.uid() = user_id);
create policy "own items delete" on public.dump_items for delete to authenticated using (auth.uid() = user_id);

create index dump_items_user_cat_idx on public.dump_items(user_id, category, done);

-- Battery logs
create table public.battery_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level int not null check (level between 0 and 100),
  sleep_hours numeric(3,1),
  hydration_pct int check (hydration_pct between 0 and 100),
  heart_rate int,
  note text,
  recorded_at timestamptz not null default now()
);
alter table public.battery_logs enable row level security;
create policy "own battery select" on public.battery_logs for select to authenticated using (auth.uid() = user_id);
create policy "own battery insert" on public.battery_logs for insert to authenticated with check (auth.uid() = user_id);
create policy "own battery update" on public.battery_logs for update to authenticated using (auth.uid() = user_id);
create policy "own battery delete" on public.battery_logs for delete to authenticated using (auth.uid() = user_id);

create index battery_logs_user_recorded_idx on public.battery_logs(user_id, recorded_at desc);
