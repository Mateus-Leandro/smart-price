import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('A Função espera um método do tipo POST', { status: 405 });
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

    const companyId = user.app_metadata.company_id;
    if (!companyId) {
      return new Response('Empresa não vinculada ao usuário', { status: 403 });
    }

    const { competitorId, brancheIds } = await req.json();
    if (!competitorId) {
      return new Response('Necessário informar competitorId', { status: 400 });
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

    return new Response(
      JSON.stringify({ message: 'Filiais vinculadas ao concorrente:', data: resultData }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro ao vincular filiais ao concorrente!' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});
