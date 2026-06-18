-- Stores one private-expense PIN hash per fixed profile.
-- The PIN is hashed in the browser before saving; the raw PIN is not stored.

create table if not exists public.profile_expense_pins (
  profile_id text primary key references public.profiles(id) on update cascade on delete cascade,
  pin_hash text not null,
  pin_salt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile_expense_pins enable row level security;

drop policy if exists "beitna_private_app_select" on public.profile_expense_pins;
drop policy if exists "beitna_private_app_insert" on public.profile_expense_pins;
drop policy if exists "beitna_private_app_update" on public.profile_expense_pins;
drop policy if exists "beitna_private_app_delete" on public.profile_expense_pins;

create policy "beitna_private_app_select" on public.profile_expense_pins for select to anon, authenticated using (true);
create policy "beitna_private_app_insert" on public.profile_expense_pins for insert to anon, authenticated with check (true);
create policy "beitna_private_app_update" on public.profile_expense_pins for update to anon, authenticated using (true) with check (true);
create policy "beitna_private_app_delete" on public.profile_expense_pins for delete to anon, authenticated using (true);
