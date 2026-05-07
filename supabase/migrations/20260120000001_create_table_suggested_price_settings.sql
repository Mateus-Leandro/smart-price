CREATE TABLE IF NOT EXISTS public.suggested_price_settings (
  id               UUID        NOT NULL DEFAULT gen_random_uuid(),
  company_id       BIGINT      NOT NULL,
  margin_min       NUMERIC     NOT NULL,
  margin_max       NUMERIC     NOT NULL,
  discount_percent INTEGER     NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),

  CONSTRAINT suggested_price_settings_pkey PRIMARY KEY (id)
);
