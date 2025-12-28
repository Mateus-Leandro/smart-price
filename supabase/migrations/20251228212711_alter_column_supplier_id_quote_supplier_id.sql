-- Altera o nome da coluna de supplier_id para quote_supplier_id
ALTER TABLE public.promotional_flyer_products 
RENAME COLUMN supplier_id TO quote_supplier_id;