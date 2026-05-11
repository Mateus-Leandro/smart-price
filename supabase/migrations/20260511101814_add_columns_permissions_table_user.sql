DO $$ BEGIN
  CREATE TYPE status AS ENUM ('inactive', 'active');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS status status NOT NULL DEFAULT 'active';

ALTER TABLE public.user_permissions
ADD COLUMN IF NOT EXISTS view_margin BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS view_cost BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS view_suggested_price_on_margin BOOLEAN NOT NULL DEFAULT false;
