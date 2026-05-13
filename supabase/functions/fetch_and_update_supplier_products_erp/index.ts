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
    const supplier_flyer_id = payload?.supplier_flyer_id ? Number(payload.supplier_flyer_id) : null;

    const update_prices = payload?.update_prices || false;

    let query = supabase
      .from('supplier_flyer_products')
      .select(
        'supplier_flyer_id, product_id, current_sale_price, sale_price, current_loyalty_price, loyalty_price, price_discount_percent, warning_type, cost_price, previous_cost, additional_cost',
      )
      .eq('company_id', company_id)
      .eq('send_to_erp', true)
      .or('sale_price.gt.0,loyalty_price.gt.0');

    if (supplier_flyer_id) {
      query = query.eq('supplier_flyer_id', supplier_flyer_id);
    }

    const { data, error } = await query;

    if (error) {
      return fail('Erro ao buscar produtos: ' + error.message, 500);
    }

    if (!data || data.length === 0) {
      return success([]);
    }

    const productIds = data.map((r) => r.product_id);

    let id_integral: number | null = null;
    let linkedCompetitorIds: number[] | null = null;
    if (supplier_flyer_id) {
      const { data: flyerData, error: flyerError } = await supabase
        .from('supplier_flyers')
        .select('id_integral, branche_id')
        .eq('id', supplier_flyer_id)
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

    let competitorQuery = supabase
      .from('competitor_price_supplier_flyer_products')
      .select('product_id, price, competitor_id, competitor:competitors(id, name)')
      .eq('company_id', company_id)
      .in('product_id', productIds);

    if (id_integral) {
      competitorQuery = competitorQuery.eq('integral_flyer_id', id_integral);
    }

    const { data: competitorData, error: competitorError } = await competitorQuery;

    if (competitorError) {
      return fail('Erro ao buscar preços de concorrentes: ' + competitorError.message, 500);
    }

    type CompetitorEntry = { price: number; name: string };
    const competitorsByProduct = new Map<number, CompetitorEntry[]>();

    for (const cp of competitorData ?? []) {
      const price = Number(cp.price);
      if (price <= 0) continue;
      if (linkedCompetitorIds !== null && !linkedCompetitorIds.includes(cp.competitor_id)) continue;
      const list = competitorsByProduct.get(cp.product_id) ?? [];
      list.push({ price, name: (cp.competitor as any)?.name ?? '' });
      competitorsByProduct.set(cp.product_id, list);
    }

    if (update_prices) {
      const { error: updError } = await supabase
        .from('supplier_flyer_products')
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
      const entries = competitorsByProduct.get(item.product_id) ?? [];
      const min =
        entries.length > 0 ? entries.reduce((a, b) => (a.price <= b.price ? a : b)) : null;
      const { previous_cost, cost_price, ...rest } = item;
      return {
        ...rest,
        previous_cost: Number(previous_cost) || 0,
        cost_price: Number(cost_price) || 0,
        min_competitor_price: min?.price ?? 0,
        min_competitor_name: min?.name ?? '',
      };
    });

    return success(mappedData);
  } catch (error) {
    console.error(error);
    return fail(error instanceof Error ? error.message : 'Internal Server Error', 500);
  }
});
