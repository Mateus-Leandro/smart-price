-- Altera o nome da coluna de actual_sale_price para current_sale_price
ALTER TABLE public.promotional_flyer_products 
RENAME COLUMN actual_sale_price TO current_sale_price;