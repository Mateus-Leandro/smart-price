DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'promotional_flyer_products'
      AND column_name  = 'current_cost_price'
  ) THEN
    ALTER TABLE public.promotional_flyer_products
    RENAME COLUMN current_cost_price TO average_cost_quote;
  END IF;
END $$;