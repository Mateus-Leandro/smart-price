-- Adiciona a coluna com o tipo data e hora com fuso horário
ALTER TABLE public.promotional_flyer_products
ADD COLUMN IF NOT EXISTS erp_import_date TIMESTAMPTZ;

-- Comentário para documentação no banco
COMMENT ON COLUMN public.promotional_flyer_products.erp_import_date IS 'Data e hora em que o produto foi importado no ERP';