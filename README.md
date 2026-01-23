# Smart Price

## 💡 Origem e Motivo

O projeto surgiu a partir da necessidade de um cliente em integrar seu **ERP COBOL** e otimizar seu processo de precificação. Antes desta solução, o trabalho era realizado de forma manual através de planilhas de Excel, o que tornava o processo lento e passível de erros. A ferramenta foi desenvolvida para automatizar essa gestão e garantir a integridade dos dados entre a análise de mercado e o ERP.

## 📄 Descrição

O projeto tem o objetivo de consolidar informações externas para auxiliar na precificação de produtos, utilizando como base dados relacionados a cotação, frete, margem definida por produto, preço dos concorrentes, entre outros. Após a precificação na plataforma, existe a possibilidade de marcar os produtos para serem obtidos via API e utilizar os preços definidos para alteração no ERP integrado.

## 🛠️ Tecnologias

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Deno](https://img.shields.io/badge/Deno-white?style=for-the-badge&logo=deno&logoColor=black)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## 📦 Dependências e Pré-requisitos

- 🧩 [Angular](https://angular.dev/installation) (Framework Frontend)
- ⚡ [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=npm) (Interface de linha de comando)
- 🟢 [NodeJS](https://nodejs.org/en/download/current) (Ambiente de execução)
- 🦕 [Deno](https://deno.com/) (Runtime para Edge Functions/Backend)
- ▲ [Vercel](https://vercel.com/) (Hospedagem e Deployment)

## ⚙️ Configuração de Ambiente

Para rodar o projeto localmente, siga os passos de configuração abaixo:

1. Na raiz do projeto, navegue até a pasta de configurações de ambiente:
   `src/environments/`

2. Crie o arquivo **`environment.ts`** utilizando o arquivo de exemplo como base:

   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

3. Abra o arquivo src/environments/environment.ts e preencha as variáveis com as credenciais obtidas no painel do Vercel:

**# NEXT_PUBLIC_SUPABASE_URL:** URL do projeto no Supabase.

**# NEXT_PUBLIC_SUPABASE_ANON_KEY:** Chave anônima (public) do Supabase.

## 👤 Este projeto foi desenvolvido e mantido por:

- **Mateus Leandro**  
  🔗 GitHub: https://github.com/Mateus-Leandro  
  🔗 LinkedIn: https://www.linkedin.com/in/mateus-chagas/
