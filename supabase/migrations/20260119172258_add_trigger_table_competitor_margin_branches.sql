CREATE OR REPLACE FUNCTION public.fn_sync_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        UPDATE public.products
        SET updated_at = NOW()
        WHERE id = OLD.product_id 
          AND company_id = OLD.company_id;
        RETURN OLD;
    ELSE
        UPDATE public.products
        SET updated_at = NOW()
        WHERE id = NEW.product_id 
          AND company_id = NEW.company_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_margin_sync_to_products
AFTER INSERT OR UPDATE OR DELETE ON public.product_margin_branches
FOR EACH ROW
EXECUTE FUNCTION public.fn_sync_product_updated_at();