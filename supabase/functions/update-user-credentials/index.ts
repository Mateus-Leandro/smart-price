import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { success, fail, handleCORS } from '../shared/responses.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    const body = await req.json();
    const { userId, email, password } = body;

    if (!userId) {
      return fail('userId é obrigatório', 400);
    }

    if (!email && !password) {
      return fail('Informe email ou password para atualizar', 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return fail('Não autenticado', 401);
    }

    const company_id = user.app_metadata.company_id;

    if (!company_id) {
      return fail('Empresa não vinculada ao usuário', 403);
    }

    const { data: permission, error: permissionError } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('company_id', company_id)
      .eq('user_id', user.id)
      .single();

    if (permissionError) {
      return fail(permissionError.message, 500);
    }

    if (!permission?.is_admin) {
      return fail('Usuário não possui permissão de administrador', 403);
    }

    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email,
        password,
      },
    );

    if (updateError) {
      return fail(updateError.message, 500);
    }

    return success(updatedUser.user);
  } catch (err) {
    return fail(err.message, 500);
  }
});
