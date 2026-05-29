-- DiabeSense: sync auth.users → public.users
-- Run in Supabase Dashboard → SQL Editor

-- 1. Enable RLS
alter table public.users enable row level security;

-- 2. Policies (drop first if re-running)
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_insert_own" on public.users;

create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

-- 3. Auto-create public.users when auth.users created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Backfill existing auth users missing from public.users
insert into public.users (id, name, email, phone)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email,
  coalesce(raw_user_meta_data->>'phone', '')
from auth.users
where id not in (select id from public.users);
