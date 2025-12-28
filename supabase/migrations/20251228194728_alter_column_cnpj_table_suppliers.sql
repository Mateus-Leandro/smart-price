-- 1. Definir CNPJ como NOT NULL
-- Certifique-se de que não existem registros com CNPJ nulo antes de rodar, 
-- ou defina um valor padrão temporário.
ALTER TABLE public.suppliers 
ALTER COLUMN cnpj SET NOT NULL;

-- 2. Garantir que created_at use TIMESTAMPTZ (UTC) com valor padrão now()
ALTER TABLE public.suppliers 
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at TYPE TIMESTAMPTZ;

-- 3. Garantir que updated_at use TIMESTAMPTZ (UTC) com valor padrão now()
ALTER TABLE public.suppliers 
ALTER COLUMN updated_at SET DEFAULT now(),
ALTER COLUMN updated_at TYPE TIMESTAMPTZ;