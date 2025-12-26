import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  try {
    let errorMessage = '';

    if (req.method !== 'POST') {
      errorMessage = 'A Função espera um método do tipo POST';
      console.error(errorMessage);
      return new Response(errorMessage, { status: 405 });
    }

    let promotional_flyer_id: number | null = null;

    const body = await req.json();
    const payload = Array.isArray(body) ? body[0] : body;

    if (payload?.promotional_flyer_id) {
      console.log(`Buscando preços do encarte: ${payload.promotional_flyer_id}.`);
      promotional_flyer_id = Number(payload.promotional_flyer_id);
    } else {
      console.log(`Buscando preços de todos os encartes.`);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')!,
          },
        },
      },
    );

    let query = supabase
      .from('promotional_flyer_products')
      .select('id, promotional_flyer_id, product_id, sale_price')
      .not('sale_price', 'is', null)
      .gt('sale_price', 0)
      .eq('send_to_erp', true);

    if (promotional_flyer_id) {
      query = query.eq('promotional_flyer_id', promotional_flyer_id);
    }

    const { data, error } = await query;

    if (error) {
      errorMessage = JSON.stringify({ error });
      console.error(errorMessage);
      return new Response(`Error ao buscar produtos para atualização de preços: ${errorMessage}`, {
        status: 500,
      });
    }

    if (!data || data.length === 0) {
      console.log('Não encontrado nenhum produto para atualização de preços.');
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const ids = data.map((r) => r.id);

    const { error: updError } = await supabase
      .from('promotional_flyer_products')
      .update({ send_to_erp: false })
      .in('id', ids);

    if (updError) {
      errorMessage = JSON.stringify({ error: updError });
      return new Response(errorMessage, { status: 500 });
    }

    console.log(`Preços buscados com sucesso!`);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
});
