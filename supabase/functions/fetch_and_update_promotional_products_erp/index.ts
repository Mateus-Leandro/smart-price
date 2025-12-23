import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization')!,
      },
    },
  });

  // 1️⃣ Busca itens marcados para envio ao ERP
  const { data, error } = await supabase
    .from('promotional_flyer_products')
    .select('id, product_id, sale_price')
    .not('sale_price', 'is', null)
    .gt('sale_price', 0)
    .eq('send_to_erp', true);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  if (!data || data.length === 0) {
    return new Response('[]', { status: 200 });
  }

  const ids = data.map((r) => r.id);

  // 2️⃣ Atualiza o marcador de envio
  const { error: updError } = await supabase
    .from('promotional_flyer_products')
    .update({ send_to_erp: false })
    .in('id', ids);

  if (updError) {
    return new Response(JSON.stringify({ error: updError }), { status: 500 });
  }

  // 3️⃣ Retorna os dados para o ERP
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
