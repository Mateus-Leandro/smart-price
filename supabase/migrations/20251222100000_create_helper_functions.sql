CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() AT TIME ZONE 'utc';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_company_id_from_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.company_id = ((auth.jwt() -> 'app_metadata') ->> 'company_id')::bigint;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
