import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    let errorMessage;
    if (req.method !== 'POST') {
      errorMessage = 'A Função espera um método do tipo POST';
      console.error(errorMessage);
      return new Response(errorMessage, { status: 405 });
    }

    const payload = await req.json();

    if (!Array.isArray(payload)) {
      errorMessage = 'Payload enviado não é um array!';
      console.error(errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
      });
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

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      errorMessage = 'Não autenticado';
      console.error(errorMessage);
      return new Response(errorMessage, { status: 401 });
    }

    const company_id = user.app_metadata.company_id;
    if (!company_id) {
      errorMessage = 'Não encontrado empresa vinculada ao usuário!';
      console.error(errorMessage);
      return new Response(errorMessage, { status: 400 });
    }

    const results: any[] = [];

    for (const item of payload) {
      const { promotional_flyer_id, product_id, product_name } = item;

      if (!promotional_flyer_id || (!product_id && !product_name)) {
        errorMessage = JSON.stringify({
          error:
            "Payload Inválido! Campos esperados: 'promotional_flyer_id', 'product_id' e 'product_name'",
          item,
        });
        console.error(errorMessage);
        return new Response(errorMessage, { status: 400 });
      }

      // 1️⃣ Verifica se o produto existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', product_id)
        .maybeSingle();

      // 2️⃣ Cria produto se não existir
      if (!existingProduct) {
        const { error: productError } = await supabase
          .from('products')
          .insert({
            id: product_id,
            name: product_name,
            company_id: company_id,
          })
          .select('id')
          .single();

        if (productError) {
          errorMessage = JSON.stringify({
            error: 'Erro ao criar produto',
            productError,
          });
          console.error(errorMessage);
          return new Response(errorMessage, { status: 500 });
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
            onConflict: 'promotional_flyer_id,product_id',
          },
        )
        .select()
        .single();

      if (flyerError) {
        errorMessage = JSON.stringify({
          error: 'Erro ao vincular produto no encarte',
          flyerError,
        });
        console.error(errorMessage);
        return new Response(errorMessage, { status: 500 });
      }

      results.push({
        promotional_flyer_id,
        product_id,
        flyer_product_id: flyerProduct.id,
      });
    }

    console.log('Upsert de produtos do encarte realizado com sucesso!');
    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erro ao adicionar produtos no encarte:', err);
    return new Response(
      JSON.stringify({
        error: err?.message ?? err,
        stack: err?.stack,
      }),
      { status: 500 },
    );
  }
});
