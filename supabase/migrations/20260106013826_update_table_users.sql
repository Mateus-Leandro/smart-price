-- 1. Criar a função que atualizará a tabela pública
CREATE OR REPLACE FUNCTION public.handle_auth_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza o campo updated_at da tabela pública onde o ID coincide
  UPDATE public.users
  SET updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
-- SECURITY DEFINER é necessário para que a função tenha permissão de editar 
-- a tabela public.users mesmo sendo disparada pelo schema auth.

-- 2. Criar a Trigger na tabela auth.users
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_auth_user_update();