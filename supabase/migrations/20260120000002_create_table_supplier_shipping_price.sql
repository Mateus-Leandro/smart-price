CREATE TABLE IF NOT EXISTS public.supplier_shipping_price (
  company_id     BIGINT      NOT NULL,
  supplier_id    BIGINT      NOT NULL,
  product_id     BIGINT      NOT NULL,
  shipping_price NUMERIC,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at     TIMESTAMPTZ          DEFAULT (NOW() AT TIME ZONE 'utc'),

  CONSTRAINT supplier_shipping_price_pkey
    PRIMARY KEY (company_id, supplier_id, product_id)
);
