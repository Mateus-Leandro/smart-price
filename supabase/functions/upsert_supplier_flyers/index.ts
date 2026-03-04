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
      const { id, id_integral, name, supplier_id, supplier_name, supplier_cnpj, branche_id } = item;

      if (!id_integral || !supplier_id || !branche_id) {
        return fail('Campos obrigatórios ausentes', 400);
      }

      const { data, upsertSupplierError } = await supabase
        .from('suppliers')
        .upsert(
          {
            id: supplier_id,
            company_id: company_id,
            name: supplier_name,
            cnpj: supplier_cnpj,
          },
          {
            onConflict: 'id, company_id',
          },
        )
        .select()
        .single();

      if (upsertSupplierError) {
        return new fail(
          `Erro ao realizar upsert do fornecedor ${supplier_id}: ${upsertSupplierError}`,
          500,
        );
      }

      const { data: supplierFlyer, error: flyerError } = await supabase
        .from('supplier_flyers')
        .upsert(
          {
            id: id,
            name: name,
            branche_id: branche_id,
            company_id: company_id,
            supplier_id: supplier_id,
            id_integral: id_integral,
          },
          {
            onConflict: 'id,company_id',
          },
        )
        .select()
        .single();

      if (flyerError) {
        return fail('Erro ao realizar upsert da tabela de fornecedor', 500);
      }

      results.push({
        id: supplierFlyer.id,
      });
    }

    return success(results);
  } catch (err) {
    return fail(`Erro ao atualizar produtos da tabela de fornecedor: ${err.message}`, 500);
  }
});
