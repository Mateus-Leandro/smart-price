-- 1. Habilitar o RLS na tabela
alter table public.company_branches enable row level security;

-- 2. Criar a política ALL para todas as operações
create policy "Somente sua empresa"
on "public"."suppliers"
as PERMISSIVE
for ALL
to authenticated
using (
  company_id = ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id'::text)::bigint
)
with check (
  company_id = ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id'::text)::bigint
);