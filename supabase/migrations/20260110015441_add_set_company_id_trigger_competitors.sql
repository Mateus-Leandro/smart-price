drop trigger if exists trg_set_company_id_competitors
on public.competitors;

create trigger trg_set_company_id_competitors
before update
on public.competitors
for each row
execute function public.set_company_id_from_metadata();
