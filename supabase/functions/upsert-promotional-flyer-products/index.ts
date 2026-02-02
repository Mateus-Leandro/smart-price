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
        promotional_flyer_id,
        product_id,
        product_name,
        current_sale_price,
        average_cost_quote,
        quote_cost,
        current_loyalty_price,
        quote_supplier_id,
        quote_supplier_name,
        quote_supplier_cnpj,
      } = item;

      if (!promotional_flyer_id || (!product_id && !product_name)) {
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

      const { data, upsertSupplierError } = await supabase
        .from('suppliers')
        .upsert(
          {
            id: quote_supplier_id,
            company_id: company_id,
            name: quote_supplier_name,
            cnpj: quote_supplier_cnpj,
          },
          {
            onConflict: 'id, company_id',
          },
        )
        .select()
        .single();

      if (upsertSupplierError) {
        return new fail(
          `Erro ao realizar upsert do fornecedor ${quote_supplier_id}: ${upsertSupplierError}`,
          500,
        );
      }

      const { data: flyerProduct, error: flyerError } = await supabase
        .from('promotional_flyer_products')
        .upsert(
          {
            promotional_flyer_id,
            product_id,
            company_id,
            current_sale_price,
            average_cost_quote,
            quote_cost,
            current_loyalty_price,
            quote_supplier_id,
          },
          {
            onConflict: 'promotional_flyer_id,product_id,company_id',
          },
        )
        .select()
        .single();

      if (flyerError) {
        return fail('Erro ao vincular produto', 500);
      }

      results.push({
        promotional_flyer_id,
        product_id,
        flyer_product_id: flyerProduct.id,
      });
    }

    return success(results);
  } catch (err) {
    return fail(`Erro ao atualizar produtos do encarte: ${err.message}`, 500);
  }
});
