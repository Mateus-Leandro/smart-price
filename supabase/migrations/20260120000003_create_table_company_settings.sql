CREATE TABLE IF NOT EXISTS public.company_settings (
  company_id             BIGINT  NOT NULL,
  increase_price_percent NUMERIC,

  CONSTRAINT company_settings_pkey PRIMARY KEY (company_id)
);
