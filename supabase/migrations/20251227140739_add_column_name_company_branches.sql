-- Adiciona a coluna name à tabela company_branches
ALTER TABLE public.company_branches 
ADD COLUMN name text NOT NULL;