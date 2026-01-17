import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../shared/cors.ts';
import { success, fail, handleCORS } from '../shared/responses.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    const body = await req.json();

    if (!body.company || !body.user) {
      return fail('Payload inválido. Envie { company, user }.');
    }

    const { company, user } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let finalCompanyId = company?.id ?? null;
    let createdCompany: any = null;

    if (!finalCompanyId) {
      const { data: companyExists, error: checkErr } = await supabase
        .from('companys')
        .select('id, name, cnpj')
        .eq('cnpj', company.cnpj)
        .maybeSingle();

      if (checkErr) {
        return fail('Erro ao verificar CNPJ. ' + checkErr);
      }

      if (companyExists) {
        return fail('Já existe uma empresa cadastrada com este CNPJ.');
      }

      const { data: createdCompanyData, error: empresaErr } = await supabase
        .from('companys')
        .insert({
          name: company.name,
          cnpj: company.cnpj,
        })
        .select()
        .single();

      if (empresaErr) {
        return fail('Erro ao criar empresa: ' + empresaErr.message);
      }

      finalCompanyId = createdCompanyData.id;
      createdCompany = createdCompanyData;
    } else {
      const { data: existingCompany, error: existingErr } = await supabase
        .from('companys')
        .select('id, name, cnpj')
        .eq('id', finalCompanyId)
        .single();

      if (existingErr) {
        return fail('Erro ao recuperar dados da empresa.' + existingErr);
      }

      createdCompany = existingCompany;
    }

    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authErr) {
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

    const { error: updateUserErr } = await supabase
      .from('users')
      .update({
        company_id: finalCompanyId,
        name: user.name,
        email: user.email,
      })
      .eq('id', createdUserId);

    if (updateUserErr) {
      return fail('Usuário criado, mas falhou ao vincular empresa: ' + updateUserErr.message);
    }

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
    return fail('Erro inesperado: ' + err.message, 500);
  }
});
