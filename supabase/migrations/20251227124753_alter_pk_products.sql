BEGIN;

-- 1. Remover a Foreign Key na tabela dependente
ALTER TABLE public.promotional_flyer_products 
DROP CONSTRAINT IF EXISTS promotional_flyer_products_product_id_fkey;

-- 2. Remover as constraints da tabela products
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_pkey CASCADE;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_id_key;

-- 3. Criar a nova Chave Primária Composta em products
ALTER TABLE public.products ADD PRIMARY KEY (id, company_id);

-- 4. Criar a nova Foreign Key Composta em promotional_flyer_products
-- Isso garante que o vínculo considere tanto o ID quanto a Empresa
ALTER TABLE public.promotional_flyer_products
ADD CONSTRAINT promotional_flyer_products_product_fkey 
FOREIGN KEY (product_id, company_id) 
REFERENCES public.products (id, company_id)
ON UPDATE CASCADE
ON DELETE CASCADE;

COMMIT;