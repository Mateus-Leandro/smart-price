DO $$ BEGIN
    CREATE TYPE public.delivery_type_enum AS ENUM ('PAID', 'FREE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.suppliers 
ADD COLUMN delivery_type public.delivery_type_enum NOT NULL DEFAULT 'FREE';


COMMENT ON COLUMN public.suppliers.delivery_type IS 'Define o tipo de entrega do fornecedor: PAID para pago ou FREE para gratuito';