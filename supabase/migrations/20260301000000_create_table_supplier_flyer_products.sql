CREATE TABLE IF NOT EXISTS public.supplier_flyer_products (
  supplier_flyer_id      BIGINT      NOT NULL,
  product_id             BIGINT      NOT NULL,
  company_id             BIGINT      NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at             TIMESTAMPTZ          DEFAULT (NOW() AT TIME ZONE 'utc'),
  sale_price             NUMERIC,
  send_to_erp            BOOLEAN     NOT NULL DEFAULT false,
  current_sale_price     NUMERIC,
  current_loyalty_price  NUMERIC,
  erp_import_date        TIMESTAMPTZ,
  loyalty_price          NUMERIC,
  lock_price             BOOLEAN              DEFAULT false,
  price_discount_percent NUMERIC              DEFAULT 0.0,
  previous_cost          NUMERIC,
  cost_price             NUMERIC,
  warning_type           public.warning_promotional_flyer_product_type DEFAULT 'NO_COMPETITOR_PRICE',
  lock_competitor_prices BOOLEAN,
  additional_cost        NUMERIC,

  CONSTRAINT supplier_flyer_products_pkey
    PRIMARY KEY (supplier_flyer_id, product_id, company_id)
);
