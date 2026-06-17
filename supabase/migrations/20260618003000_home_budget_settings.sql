-- Home Budget settings for dashboard gauge and minimum-balance warning.

create table if not exists public.home_budget_settings (
  id text primary key default 'default' check (id = 'default'),
  standard_monthly_budget numeric(12,2) not null default 0 check (standard_monthly_budget >= 0),
  minimum_balance numeric(12,2) not null default 200 check (minimum_balance >= 0),
  updated_by text references public.profiles(id) on update cascade,
  updated_at timestamptz not null default now()
);

insert into public.home_budget_settings (id, standard_monthly_budget, minimum_balance)
values ('default', 0, 200)
on conflict (id) do nothing;

alter table public.home_budget_settings enable row level security;

drop policy if exists "beitna_private_app_select" on public.home_budget_settings;
drop policy if exists "beitna_private_app_insert" on public.home_budget_settings;
drop policy if exists "beitna_private_app_update" on public.home_budget_settings;
drop policy if exists "beitna_private_app_delete" on public.home_budget_settings;

create policy "beitna_private_app_select" on public.home_budget_settings for select to anon, authenticated using (true);
create policy "beitna_private_app_insert" on public.home_budget_settings for insert to anon, authenticated with check (true);
create policy "beitna_private_app_update" on public.home_budget_settings for update to anon, authenticated using (true) with check (true);
create policy "beitna_private_app_delete" on public.home_budget_settings for delete to anon, authenticated using (true);
