drop trigger if exists trg_set_updated_at_promotional_flyer_products
on public.promotional_flyer_products;

create trigger trg_set_updated_at_promotional_flyer_products
before update
on public.promotional_flyer_products
for each row
execute function public.set_updated_at();
