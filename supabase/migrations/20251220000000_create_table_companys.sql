CREATE TABLE IF NOT EXISTS public.companys (
  id         BIGINT      NOT NULL,
  name       TEXT        NOT NULL,
  cnpj       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMPTZ          DEFAULT (NOW() AT TIME ZONE 'utc'),

  CONSTRAINT companys_pkey PRIMARY KEY (id)
);
