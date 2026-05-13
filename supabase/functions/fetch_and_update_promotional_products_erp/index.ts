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

    const update_prices = payload?.update_prices || false;

    let id_integral: number | null = null;
    let linkedCompetitorIds: number[] | null = null;
    if (promotional_flyer_id) {
      const { data: flyerData, error: flyerError } = await supabase
        .from('promotional_flyers')
        .select('id_integral, branche_id')
        .eq('id', promotional_flyer_id)
        .eq('company_id', company_id)
        .single();

      if (flyerError) {
        return fail('Erro ao buscar flyer: ' + flyerError.message, 500);
      }
      id_integral = flyerData?.id_integral ?? null;

      const branche_id = flyerData?.branche_id ?? null;
      if (branche_id) {
        const { data: branchData, error: branchError } = await supabase
          .from('competitor_branches')
          .select('competitor_id')
          .eq('branche_id', branche_id)
          .eq('company_id', company_id);

        if (branchError) {
          return fail('Erro ao buscar concorrentes vinculados: ' + branchError.message, 500);
        }
        linkedCompetitorIds = (branchData ?? []).map((cb: any) => cb.competitor_id);
      }
    }

    let query = supabase
      .from('promotional_flyer_products')
      .select(
        `promotional_flyer_id, product_id, current_sale_price, sale_price, current_loyalty_price, loyalty_price, price_discount_percent, warning_type, quote_cost, additional_cost, quote_supplier_id,
        product:products!inner (
          competitorPrices:competitor_price_flyer_products (
            price,
            integral_flyer_id,
            competitor:competitors (id, name)
          )
        )`,
      )
      .eq('company_id', company_id)
      .eq('send_to_erp', true)
      .or('sale_price.gt.0,loyalty_price.gt.0');

    if (promotional_flyer_id) {
      query = query.eq('promotional_flyer_id', promotional_flyer_id);
    }

    const { data, error } = await query;

    if (error) {
      return fail('Erro ao buscar produtos: ' + error.message, 500);
    }

    if (!data || data.length === 0) {
      return success([]);
    }

    const productIds = data.map((r: any) => r.product_id);

    const { data: shippingData, error: shippingError } = await supabase
      .from('supplier_shipping_price')
      .select('product_id, supplier_id, shipping_price')
      .eq('company_id', company_id)
      .in('product_id', productIds);

    if (shippingError) {
      return fail('Erro ao buscar frete: ' + shippingError.message, 500);
    }

    const shippingByKey = new Map<string, number>();
    for (const s of shippingData ?? []) {
      shippingByKey.set(`${s.product_id}_${s.supplier_id}`, Number(s.shipping_price) || 0);
    }

    if (update_prices) {
      const { error: updError } = await supabase
        .from('promotional_flyer_products')
        .update({
          send_to_erp: false,
          erp_import_date: new Date().toISOString(),
        })
        .in('product_id', productIds)
        .eq('company_id', company_id);

      if (updError) {
        return fail('Erro ao setar data de importação: ' + updError.message, 500);
      }
    }

    const mappedData = data.map((item: any) => {
      const allCompetitorPrices: any[] = item.product?.competitorPrices ?? [];
      let flyerPrices = id_integral
        ? allCompetitorPrices.filter((cp) => cp.integral_flyer_id === id_integral)
        : allCompetitorPrices;
      if (linkedCompetitorIds !== null) {
        flyerPrices = flyerPrices.filter((cp) =>
          linkedCompetitorIds!.includes(cp.competitor?.id),
        );
      }
      const validPrices = flyerPrices.filter((cp) => Number(cp.price) > 0);
      const min =
        validPrices.length > 0
          ? validPrices.reduce((a: any, b: any) => (Number(a.price) <= Number(b.price) ? a : b))
          : null;

      const { product: _product, quote_supplier_id, ...rest } = item;
      const shipping_price =
        shippingByKey.get(`${item.product_id}_${quote_supplier_id}`) ?? 0;
      return {
        ...rest,
        shipping_price,
        min_competitor_price: min?.price ?? 0,
        min_competitor_name: min?.competitor?.name ?? '',
      };
    });

    return success(mappedData);
  } catch (error) {
    console.error(error);
    return fail(error instanceof Error ? error.message : 'Internal Server Error', 500);
  }
});
