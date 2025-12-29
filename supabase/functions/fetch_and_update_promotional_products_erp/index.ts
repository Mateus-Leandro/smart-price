import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('A Função espera um método do tipo POST', { status: 405 });
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
      return new Response('Não autenticado', { status: 401 });
    }

    const company_id = user.app_metadata.company_id;
    if (!company_id) {
      return new Response('Empresa não vinculada ao usuário', { status: 403 });
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
      console.error('Erro na busca:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
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
      return new Response(JSON.stringify({ error: updError.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
});
