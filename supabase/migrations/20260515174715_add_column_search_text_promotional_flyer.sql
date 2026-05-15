-- migration: add search_text column + trigger para promotional_flyers


alter table public.promotional_flyers
add column if not exists search_text text;

create or replace function public.set_promotional_flyers_search_text()
returns trigger
language plpgsql
as $$
begin
  new.search_text := trim(
    concat_ws(
      ' ',
      new.id_integral::text,
      new.name
    )
  );

  return new;
end;
$$;

update public.promotional_flyers
set search_text = trim(
  concat_ws(
    ' ',
    id_integral::text,
    name
  )
);

drop trigger if exists trg_set_promotional_flyers_search_text
on public.promotional_flyers;

create trigger trg_set_promotional_flyers_search_text
before insert or update on public.promotional_flyers
for each row
execute function public.set_promotional_flyers_search_text();

create index if not exists idx_promotional_flyers_search_text
on public.promotional_flyers
using gin (to_tsvector('simple', search_text));