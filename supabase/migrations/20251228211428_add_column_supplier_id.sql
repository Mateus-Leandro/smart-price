-- 1. Adiciona a coluna supplier_id
ALTER TABLE public.promotional_flyer_products
ADD COLUMN IF NOT EXISTS supplier_id int8 NOT NULL;

-- 2. Adiciona a Foreign Key apontando para a PK composta de suppliers
ALTER TABLE public.promotional_flyer_products
ADD CONSTRAINT fk_promotional_flyer_products_supplier
FOREIGN KEY (supplier_id, company_id) 
REFERENCES public.suppliers(id, company_id)
ON DELETE CASCADE;

-- 3. Cria um índice para otimizar os JOINs que você está fazendo na query
CREATE INDEX IF NOT EXISTS idx_flyer_products_supplier_id 
ON public.promotional_flyer_products(supplier_id);