-- Beitna Manager online database schema
-- Private fixed-family app: no authentication tables are created here.
-- Run this in Supabase SQL editor or through Supabase migrations.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id text primary key check (id in ('moustafa', 'doaa', 'ahmed', 'sherien')),
  name text not null,
  nickname text not null,
  role text not null,
  color text not null,
  created_at timestamptz not null default now()
);

insert into public.profiles (id, name, nickname, role, color)
values
  ('moustafa', 'Moustafa', 'Pappy', 'Father', '#7A2E3A'),
  ('doaa', 'Doaa', 'Mamy', 'Mother', '#2F6FDB'),
  ('ahmed', 'Ahmed', 'Ahmed', 'Son', '#667A53'),
  ('sherien', 'Sherien', 'shar2ozii', 'Daughter', '#0178CD')
on conflict (id) do update set
  name = excluded.name,
  nickname = excluded.nickname,
  role = excluded.role,
  color = excluded.color;

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null check (amount >= 0),
  category_id text not null,
  description text not null,
  date date not null,
  paid_by text not null references public.profiles(id) on update cascade,
  payment_method text not null,
  paid_from text not null default 'personal' check (paid_from in ('personal', 'home-budget')),
  receipt_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.home_budget_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('add', 'remove')),
  amount numeric(12,2) not null check (amount >= 0),
  description text not null,
  date date not null,
  performed_by text not null references public.profiles(id) on update cascade,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric(12,2) not null check (amount >= 0),
  due_date date not null,
  paid boolean not null default false,
  paid_by text references public.profiles(id) on update cascade,
  payment_date date,
  payment_proof_url text,
  repeat_type text not null default 'one-time' check (repeat_type in ('monthly', 'yearly', 'custom', 'one-time')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  assigned_to text not null references public.profiles(id) on update cascade,
  due_date date not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending' check (status in ('pending', 'done', 'late')),
  notes text,
  related_type text check (related_type in ('bill', 'repair', 'shopping', 'expense')),
  related_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.repairs (
  id uuid primary key default gen_random_uuid(),
  item_name text not null,
  room text not null,
  problem_description text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'new' check (status in ('new', 'need-repair', 'technician-contacted', 'in-progress', 'fixed', 'paid', 'closed')),
  expected_cost numeric(12,2) check (expected_cost >= 0),
  actual_cost numeric(12,2) check (actual_cost >= 0),
  paid_by text references public.profiles(id) on update cascade,
  responsible_person text not null references public.profiles(id) on update cascade,
  technician_name text,
  technician_phone text,
  warranty_status text,
  related_home_item_id text,
  notes text,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.home_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  model text,
  location text not null,
  purchase_date date,
  purchase_price numeric(12,2) check (purchase_price >= 0),
  warranty_end_date date,
  receipt_url text,
  manual_url text,
  last_repair_date date,
  total_repair_cost numeric(12,2) not null default 0 check (total_repair_cost >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity text not null,
  estimated_price numeric(12,2) check (estimated_price >= 0),
  needed_by_date date,
  assigned_buyer text references public.profiles(id) on update cascade,
  bought boolean not null default false,
  notes text,
  category text not null default 'other' check (category in ('food', 'vegetables-fruits', 'meat-chicken-fish', 'cleaning-supplies', 'bathroom', 'kitchen', 'pharmacy', 'home-tools', 'spare-parts', 'other')),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  action_type text not null,
  description text not null,
  performed_by text not null references public.profiles(id) on update cascade,
  related_type text,
  related_id text,
  created_at timestamptz not null default now()
);

create index if not exists expenses_date_idx on public.expenses(date desc);
create index if not exists expenses_paid_by_idx on public.expenses(paid_by);
create index if not exists expenses_paid_from_idx on public.expenses(paid_from);
create index if not exists home_budget_transactions_date_idx on public.home_budget_transactions(date desc);
create index if not exists bills_due_date_idx on public.bills(due_date);
create index if not exists tasks_assigned_to_idx on public.tasks(assigned_to);
create index if not exists repairs_responsible_person_idx on public.repairs(responsible_person);
create index if not exists shopping_items_assigned_buyer_idx on public.shopping_items(assigned_buyer);
create index if not exists activity_log_created_at_idx on public.activity_log(created_at desc);

-- Realtime-friendly updates.
alter table public.expenses replica identity full;
alter table public.home_budget_transactions replica identity full;
alter table public.bills replica identity full;
alter table public.tasks replica identity full;
alter table public.repairs replica identity full;
alter table public.home_items replica identity full;
alter table public.shopping_items replica identity full;
alter table public.activity_log replica identity full;

-- RLS note:
-- This app currently has no authentication by request. For a private family app without auth,
-- frontend-only Supabase access cannot be truly private because the anon key is public.
-- The policies below allow anon/authenticated app clients to read and write.
-- Before publishing publicly, protect writes through authentication or server-side API routes.

alter table public.profiles enable row level security;
alter table public.expenses enable row level security;
alter table public.home_budget_transactions enable row level security;
alter table public.bills enable row level security;
alter table public.tasks enable row level security;
alter table public.repairs enable row level security;
alter table public.home_items enable row level security;
alter table public.shopping_items enable row level security;
alter table public.activity_log enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'expenses',
    'home_budget_transactions',
    'bills',
    'tasks',
    'repairs',
    'home_items',
    'shopping_items',
    'activity_log'
  ]
  loop
    execute format('drop policy if exists "beitna_private_app_select" on public.%I', table_name);
    execute format('drop policy if exists "beitna_private_app_insert" on public.%I', table_name);
    execute format('drop policy if exists "beitna_private_app_update" on public.%I', table_name);
    execute format('drop policy if exists "beitna_private_app_delete" on public.%I', table_name);

    execute format('create policy "beitna_private_app_select" on public.%I for select to anon, authenticated using (true)', table_name);
    execute format('create policy "beitna_private_app_insert" on public.%I for insert to anon, authenticated with check (true)', table_name);
    execute format('create policy "beitna_private_app_update" on public.%I for update to anon, authenticated using (true) with check (true)', table_name);
    execute format('create policy "beitna_private_app_delete" on public.%I for delete to anon, authenticated using (true)', table_name);
  end loop;
end $$;
