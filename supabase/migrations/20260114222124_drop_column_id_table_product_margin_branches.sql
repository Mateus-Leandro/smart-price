ALTER TABLE public.product_margin_branches 
DROP CONSTRAINT product_margin_branches_pkey,
DROP COLUMN id,
ADD CONSTRAINT product_margin_branches_pkey PRIMARY KEY (product_id, branche_id, company_id);