#!/bin/bash

# Cria o diretório se não existir
mkdir -p src/environments

# Cria o arquivo base para o Angular não dar erro de import
echo "export const environment = { production: false, SUPABASE_URL: 'REPLACE_WITH_SUPABASE_URL', SUPABASE_KEY: 'REPLACE_WITH_SUPABASE_KEY' };" > src/environments/environment.ts

# Substitui os placeholders no arquivo de produção pelas variáveis da Vercel
sed -i "s|REPLACE_WITH_SUPABASE_URL|$NEXT_PUBLIC_SUPABASE_URL|g" src/environments/environment.ts
sed -i "s|REPLACE_WITH_SUPABASE_KEY|$NEXT_PUBLIC_SUPABASE_ANON_KEY|g" src/environments/environment.ts

echo "Ambiente configurado com sucesso!"