-- migration: add search_text column + trigger para suppliers

alter table public.suppliers
add column if not exists search_text text;

create or replace function public.set_suppliers_search_text()
returns trigger
language plpgsql
as $$
begin
  new.search_text := trim(
    concat_ws(
      ' ',
      new.id::text,
      new.name,
      new.cnpj
    )
  );

  return new;
end;
$$;

update public.suppliers
set search_text = trim(
  concat_ws(
    ' ',
    id::text,
    name,
    cnpj
  )
);


drop trigger if exists trg_set_suppliers_search_text on public.suppliers;

create trigger trg_set_suppliers_search_text
before insert or update on public.suppliers
for each row
execute function public.set_suppliers_search_text();

create index if not exists idx_suppliers_search_text
on public.suppliers
using gin (to_tsvector('simple', search_text));