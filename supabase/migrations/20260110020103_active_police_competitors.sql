-- 1. Habilitar o RLS na tabela
alter table public.competitors enable row level security;

-- 2. Criar a política ALL para todas as operações
create policy "Somente sua empresa"
on "public"."competitors"
as PERMISSIVE
for ALL
to authenticated
using (
    (company_id = ( SELECT get_my_company() AS get_my_company))
)
with check (
    (company_id = ( SELECT get_my_company() AS get_my_company))
);