import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('A Função espera um método do tipo POST', { status: 405 });
    }

    const payload = await req.json();
    if (!Array.isArray(payload)) {
      return new Response(JSON.stringify({ error: 'Payload enviado não é um array!' }), {
        status: 400,
      });
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
      return new Response('Não encontrado empresa vinculada ao usuário!', { status: 400 });
    }

    const results: any[] = [];

    for (const item of payload) {
      const { promotional_flyer_id, product_id, product_name } = item;

      if (!promotional_flyer_id || (!product_id && !product_name)) {
        return new Response(JSON.stringify({ error: 'Campos obrigatórios ausentes', item }), {
          status: 400,
        });
      }

      // 1️⃣ Verifica se o produto existe NESTA empresa (Chave Composta)
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', product_id)
        .eq('company_id', company_id)
        .maybeSingle();

      // 2️⃣ Cria produto se não existir para esta empresa
      if (!existingProduct) {
        const { error: productError } = await supabase.from('products').insert({
          id: product_id,
          name: product_name,
          company_id: company_id,
        });

        if (productError) {
          console.error('Erro ao criar produto:', productError);
          return new Response(JSON.stringify({ error: 'Erro ao criar produto', productError }), {
            status: 500,
          });
        }
      }

      // 3️⃣ Upsert flyer x product
      const { data: flyerProduct, error: flyerError } = await supabase
        .from('promotional_flyer_products')
        .upsert(
          {
            promotional_flyer_id,
            product_id,
            company_id,
          },
          {
            onConflict: 'promotional_flyer_id,product_id,company_id',
          },
        )
        .select()
        .single();

      if (flyerError) {
        console.error('Erro no vínculo:', flyerError);
        return new Response(JSON.stringify({ error: 'Erro ao vincular produto', flyerError }), {
          status: 500,
        });
      }

      results.push({
        promotional_flyer_id,
        product_id,
        flyer_product_id: flyerProduct.id,
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
