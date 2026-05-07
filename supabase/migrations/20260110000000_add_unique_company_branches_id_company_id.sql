DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'company_branches_id_company_id_key'
  ) THEN
    ALTER TABLE public.company_branches
    ADD CONSTRAINT company_branches_id_company_id_key UNIQUE (id, company_id);
  END IF;
END $$;
