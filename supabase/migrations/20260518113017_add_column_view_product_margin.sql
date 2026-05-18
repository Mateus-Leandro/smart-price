ALTER TABLE public.user_permissions
ADD COLUMN IF NOT EXISTS view_product_margin BOOLEAN NOT NULL DEFAULT false;