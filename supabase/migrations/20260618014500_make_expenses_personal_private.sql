-- Expenses are now individual personal spending only.
-- Home Budget is no longer reduced by expense records.

update public.expenses
set paid_from = 'personal'
where paid_from is distinct from 'personal';

alter table public.expenses
alter column paid_from set default 'personal';
