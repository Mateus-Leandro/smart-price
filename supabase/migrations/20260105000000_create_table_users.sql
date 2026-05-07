CREATE TABLE IF NOT EXISTS public.users (
  id         UUID        NOT NULL,
  name       TEXT,
  email      TEXT,
  company_id BIGINT,

  CONSTRAINT users_pkey PRIMARY KEY (id)
);
