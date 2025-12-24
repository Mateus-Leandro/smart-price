drop trigger if exists trg_set_company_id_products
on public.products;

create trigger trg_set_company_id_products
before update or insert
on public.products
for each row
execute function public.set_company_id_from_metadata();
