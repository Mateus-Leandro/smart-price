ALTER TABLE public.competitor_branches 
DROP CONSTRAINT competitor_branches_pkey,
DROP COLUMN id,                          
ADD CONSTRAINT competitor_branches_pkey PRIMARY KEY (competitor_id, branche_id);