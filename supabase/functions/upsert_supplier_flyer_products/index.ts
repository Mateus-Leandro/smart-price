import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { success, fail, handleCORS } from '../shared/responses.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    if (req.method !== 'POST') {
      return fail('Método não permitido', 405);
    }

    const payload = await req.json();
    if (!Array.isArray(payload)) {
      return fail('Payload enviado não é um array!', 400);
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
      return fail('Não encontrado empresa vinculada ao usuário!', 400);
    }

    const results: any[] = [];

    for (const item of payload) {
      const {
        product_id,
        product_name,
        supplier_flyer_id,
        current_sale_price,
        current_loyalty_price,
        cost_price,
      } = item;

      if (!supplier_flyer_id || !product_id || !product_name) {
        return fail('Campos obrigatórios ausentes', 400);
      }

      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', product_id)
        .eq('company_id', company_id)
        .maybeSingle();

      if (!existingProduct) {
        const { error: productError } = await supabase.from('products').insert({
          id: product_id,
          name: product_name,
          company_id: company_id,
        });

        if (productError) {
          return fail('Erro ao criar produto', 500);
        }
      }

      const { data: supplierFlyerProduct, error: flyerError } = await supabase
        .from('supplier_flyer_products')
        .upsert(
          {
            supplier_flyer_id,
            product_id,
            company_id,
            current_sale_price,
            cost_price,
            current_loyalty_price,
          },
          {
            onConflict: 'supplier_flyer_id,product_id,company_id',
          },
        )
        .select()
        .single();

      if (flyerError) {
        return fail('Erro ao vincular produto', 500);
      }

      results.push({
        supplier_flyer_id,
        product_id,
        flyer_product_id: supplierFlyerProduct.id,
      });
    }

    return success(results);
  } catch (err) {
    return fail(`Erro ao atualizar produtos da tabela de fornecedor: ${err.message}`, 500);
  }
});
