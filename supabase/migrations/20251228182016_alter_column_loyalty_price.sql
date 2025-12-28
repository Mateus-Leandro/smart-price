-- Altera o nome da coluna de loyalty_price para current_loyalty_price
ALTER TABLE public.promotional_flyer_products 
RENAME COLUMN loyalty_price TO current_loyalty_price;