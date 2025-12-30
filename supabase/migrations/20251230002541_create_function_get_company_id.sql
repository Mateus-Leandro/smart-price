-- Criando a função para obter company_id do token
create or replace function public.get_my_company() 
returns bigint as $$
  select ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id')::bigint;
$$ language sql stable;