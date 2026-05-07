CREATE TABLE IF NOT EXISTS public.competitor_price_flyer_products (
  integral_flyer_id BIGINT      NOT NULL,
  product_id        BIGINT      NOT NULL,
  competitor_id     INTEGER     NOT NULL,
  company_id        BIGINT      NOT NULL,
  price             NUMERIC,
  created_at        TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at        TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'utc'),

  CONSTRAINT competitor_price_flyer_products_pkey
    PRIMARY KEY (integral_flyer_id, product_id, competitor_id, company_id)
);
