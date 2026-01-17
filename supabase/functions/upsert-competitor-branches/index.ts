import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { success, fail, handleCORS } from '../shared/responses.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    if (req.method !== 'POST') {
      return fail('Método não permitido', 405);
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

    const companyId = user.app_metadata.company_id;
    if (!companyId) {
      return fail('Empresa não vinculada', 403);
    }

    const { competitorId, brancheIds } = await req.json();
    if (!competitorId) {
      return fail('competitorId obrigatório', 400);
    }

    const { error: deleteError } = await supabase
      .from('competitor_branches')
      .delete()
      .eq('competitor_id', competitorId)
      .eq('company_id', companyId);

    if (deleteError) throw deleteError;

    let resultData = [];
    if (brancheIds && brancheIds.length > 0) {
      const branchesToInsert = brancheIds.map((brancheId: any) => ({
        competitor_id: competitorId,
        branche_id: brancheId,
        company_id: companyId,
      }));

      const { data, error: insertError } = await supabase
        .from('competitor_branches')
        .insert(branchesToInsert)
        .select();

      if (insertError) throw insertError;
      resultData = data;
    }

    return success(resultData);
  } catch (error) {
    return fail(error.message);
  }
});
