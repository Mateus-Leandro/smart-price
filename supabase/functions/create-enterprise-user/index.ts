import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

// ----------------------
// Headers CORS
// ----------------------
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ----------------------
// Respostas
// ----------------------
const success = (body: any) =>
  new Response(JSON.stringify({ success: true, ...body }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const fail = (msg: string, status = 400) =>
  new Response(JSON.stringify({ success: false, message: msg }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// ----------------------
// Edge Function
// ----------------------
Deno.serve(async (req) => {
  // 🔹 Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 🔹 Ler corpo JSON
    const textBody = await req.text();
    const body = JSON.parse(textBody);
    console.log('📥 Payload recebido:', body);

    if (!body.company || !body.user) {
      console.log('❌ Payload inválido');
      return fail('Payload inválido. Envie { company, user }.');
    }

    const { company, user } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    console.log('🔐 Supabase Client criado');

    let finalCompanyId = company?.id ?? null;
    let createdCompany: any = null;

    // ------------------------------------------------------------
    // 1️⃣ Criar empresa SE não tiver ID
    // ------------------------------------------------------------
    if (!finalCompanyId) {
      console.log('🔎 Verificando CNPJ:', company.cnpj);

      const { data: companyExists, error: checkErr } = await supabase
        .from('companys')
        .select('id, name, cnpj')
        .eq('cnpj', company.cnpj)
        .maybeSingle();

      if (checkErr) {
        console.log('❌ Erro ao consultar empresa:', checkErr);
        return fail('Erro ao verificar CNPJ.');
      }

      if (companyExists) {
        console.log('❌ CNPJ já cadastrado');
        return fail('Já existe uma empresa cadastrada com este CNPJ.');
      }

      console.log('🏗 Criando empresa...');

      const { data: createdCompanyData, error: empresaErr } = await supabase
        .from('companys')
        .insert({
          name: company.name,
          cnpj: company.cnpj,
        })
        .select()
        .single();

      if (empresaErr) {
        console.log('❌ Erro criando empresa:', empresaErr);
        return fail('Erro ao criar empresa: ' + empresaErr.message);
      }

      console.log('🏢 Empresa criada:', createdCompanyData);
      finalCompanyId = createdCompanyData.id;
      createdCompany = createdCompanyData;
    } else {
      // Se já existe um company_id, recuperar os dados da empresa
      const { data: existingCompany, error: existingErr } = await supabase
        .from('companys')
        .select('id, name, cnpj')
        .eq('id', finalCompanyId)
        .single();

      if (existingErr) {
        console.log('❌ Erro ao recuperar empresa existente:', existingErr);
        return fail('Erro ao recuperar dados da empresa.');
      }

      createdCompany = existingCompany;
    }

    // ------------------------------------------------------------
    // 2️⃣ Criar usuário auth
    // ------------------------------------------------------------
    console.log('👤 Criando usuário auth:', user.email);

    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authErr) {
      console.log('❌ Erro createUser:', authErr);
      console.log('❌ Mensagem erro:', authErr.message);
      console.log(JSON.stringify(user));
      if (authErr.message.includes('address has already been registered')) {
        return fail('O e-mail informado já está em uso.');
      }
      return fail('Erro ao criar usuário: ' + authErr.message);
    }

    const createdUserId = authUser.user.id;
    await supabase
      .from('users')
      .update({ name: user.name, company_id: finalCompanyId })
      .eq('id', createdUserId);

    await supabase.auth.admin.updateUserById(createdUserId, {
      app_metadata: {
        company_id: finalCompanyId,
      },
    });

    console.log('👤 Auth user criado, ID:', createdUserId);

    // ------------------------------------------------------------
    // 3️⃣ Atualizar tabela public.users
    // ------------------------------------------------------------
    console.log('🔗 Atualizando users.company_id');

    const { error: updateUserErr } = await supabase
      .from('users')
      .update({
        company_id: finalCompanyId,
        name: user.name,
        email: user.email,
      })
      .eq('id', createdUserId);

    if (updateUserErr) {
      console.log('❌ Erro update users:', updateUserErr);
      return fail('Usuário criado, mas falhou ao vincular empresa: ' + updateUserErr.message);
    }

    console.log('🎉 Cadastro completo!');

    // Retornar o objeto com user e company
    const createdUser = {
      id: createdUserId,
      email: user.email,
      name: user.name,
    };

    return success({
      user: createdUser,
      company: createdCompany,
    });
  } catch (err) {
    console.log('💥 Erro inesperado:', err);
    return fail('Erro inesperado: ' + err.message, 500);
  }
});
