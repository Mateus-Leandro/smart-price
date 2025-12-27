-- Adiciona a coluna store_number à tabela company_branches
ALTER TABLE public.company_branches 
ADD COLUMN store_number int4 NOT NULL;