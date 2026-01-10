-- 1. Remover os triggers temporariamente para evitar conflitos durante a alteração (opcional, mas seguro)
DROP TRIGGER IF EXISTS trg_set_company_id_competitors ON public.competitors;
DROP TRIGGER IF EXISTS update_competitors_updated_at ON public.competitors;

-- 2. Remover a constraint de chave primária composta atual
ALTER TABLE public.competitors DROP CONSTRAINT competitors_pkey;

-- 3. Alterar o tipo da coluna id de bigint para int4 (integer)
-- O PostgreSQL requer o USING para converter tipos de identidade
ALTER TABLE public.competitors 
  ALTER COLUMN id TYPE int4;

-- 4. Adicionar a nova chave primária apenas na coluna id
ALTER TABLE public.competitors ADD CONSTRAINT competitors_pkey PRIMARY KEY (id);

-- 5. Recriar os triggers
CREATE TRIGGER trg_set_company_id_competitors 
BEFORE INSERT ON public.competitors 
FOR EACH ROW EXECUTE FUNCTION set_company_id_from_metadata();

CREATE TRIGGER update_competitors_updated_at 
BEFORE UPDATE ON public.competitors 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();