-- 1. Removemos a trigger anterior
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- 2. Recriamos com a inclusão da senha
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (
    OLD.email IS DISTINCT FROM NEW.email OR 
    OLD.raw_user_meta_data->>'name' IS DISTINCT FROM NEW.raw_user_meta_data->>'name' OR
    OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password 
  )
  EXECUTE PROCEDURE public.handle_auth_user_update();