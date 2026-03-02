CREATE OR REPLACE FUNCTION handle_cost_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Se for um UPDATE (Upsert atingiu um registro existente)
  IF (TG_OP = 'UPDATE') THEN
    -- Move o custo que estava no banco para a coluna de anterior
    IF NEW.cost_price IS DISTINCT FROM OLD.cost_price THEN
      NEW.previous_cost = OLD.cost_price;
    END IF;
  END IF;

  -- Se for um INSERT (Novo registro)
  IF (TG_OP = 'INSERT') THEN
    NEW.previous_cost = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_cost_history ON supplier_flyer_products;

CREATE TRIGGER trg_update_cost_history
BEFORE INSERT OR UPDATE ON supplier_flyer_products
FOR EACH ROW
EXECUTE FUNCTION handle_cost_history();