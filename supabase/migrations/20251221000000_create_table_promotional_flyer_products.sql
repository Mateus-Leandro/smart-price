DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'warning_promotional_flyer_product_type') THEN
    CREATE TYPE public.warning_promotional_flyer_product_type AS ENUM (
      'NO_COMPETITOR_PRICE',
      'COMPETITOR_PRICE',
      'COMPETITOR_MARGIN'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.promotional_flyer_products (
  promotional_flyer_id   BIGINT      NOT NULL,
  product_id             BIGINT      NOT NULL,
  company_id             BIGINT      NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at             TIMESTAMPTZ          DEFAULT (NOW() AT TIME ZONE 'utc'),
  lock_price             BOOLEAN     NOT NULL DEFAULT false,
  price_discount_percent NUMERIC              DEFAULT 0.0,
  warning_type           public.warning_promotional_flyer_product_type DEFAULT 'NO_COMPETITOR_PRICE',
  lock_competitor_prices BOOLEAN              DEFAULT false,
  additional_cost        NUMERIC
);
