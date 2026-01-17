import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { success, fail, handleCORS } from '../shared/responses.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    if (req.method !== 'POST') {
      return fail('A Função espera um método do tipo POST', 405);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return fail('Não autenticado', 401);
    }

    const company_id = user.app_metadata.company_id;
    if (!company_id) {
      return fail('Empresa não vinculada ao usuário', 403);
    }

    const body = await req.json();
    const payload = Array.isArray(body) ? body[0] : body;
    const promotional_flyer_id = payload?.promotional_flyer_id
      ? Number(payload.promotional_flyer_id)
      : null;

    let query = supabase
      .from('promotional_flyer_products')
      .select('id, promotional_flyer_id, product_id, sale_price')
      .eq('company_id', company_id)
      .not('sale_price', 'is', null)
      .gt('sale_price', 0)
      .eq('send_to_erp', true);

    if (promotional_flyer_id) {
      query = query.eq('promotional_flyer_id', promotional_flyer_id);
    }

    const { data, error } = await query;

    if (error) {
      return fail('Erro ao buscar produtos: ' + error.message, 500);
    }

    if (!data || data.length === 0) {
      return sucess([]);
    }

    const ids = data.map((r) => r.id);
    const { error: updError } = await supabase
      .from('promotional_flyer_products')
      .update({
        send_to_erp: false,
        erp_import_date: new Date().toISOString(),
      })
      .in('id', ids)
      .eq('company_id', company_id);

    if (updError) {
      return fail('Erro ao setar data de importação: ' + updError.message, 500);
    }

    return success(data);
  } catch (error) {
    return fail('Internal Server Error', 500);
  }
});
