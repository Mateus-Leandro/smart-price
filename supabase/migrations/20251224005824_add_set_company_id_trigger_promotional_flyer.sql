drop trigger if exists trg_set_company_id_promotional_flyers
on public.promotional_flyers;

create trigger trg_set_company_id_promotional_flyers
before insert or update
on public.promotional_flyers
for each row
execute function public.set_company_id_from_metadata();
