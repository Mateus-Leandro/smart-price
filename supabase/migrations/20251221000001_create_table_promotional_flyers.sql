CREATE TABLE IF NOT EXISTS public.promotional_flyers (
  id                            BIGINT                    NOT NULL,
  name                          TEXT                      NOT NULL,
  company_id                    BIGINT                    NOT NULL,
  id_integral                   BIGINT                    NOT NULL,
  branche_id                    INTEGER                   NOT NULL,
  finished                      BOOLEAN                            DEFAULT false,
  created_at                    TIMESTAMPTZ                        DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at                    TIMESTAMPTZ                        DEFAULT (NOW() AT TIME ZONE 'utc'),
  executed_suggested_price_date TIMESTAMPTZ,

  CONSTRAINT promotional_flyers_pkey PRIMARY KEY (id)
);
