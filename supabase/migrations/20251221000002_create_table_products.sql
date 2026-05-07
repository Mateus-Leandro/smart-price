CREATE TABLE IF NOT EXISTS public.products (
  id         BIGINT      NOT NULL,
  name       TEXT        NOT NULL,
  company_id BIGINT      NOT NULL,
  id_text    TEXT,
  created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'utc'),

  CONSTRAINT products_pkey PRIMARY KEY (id)
);
