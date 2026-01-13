drop trigger if exists trg_set_updated_at_company_branches
on public.company_branches;

create trigger trg_set_updated_at_company_branches
before update
on public.company_branches
for each row
execute function public.set_updated_at();
