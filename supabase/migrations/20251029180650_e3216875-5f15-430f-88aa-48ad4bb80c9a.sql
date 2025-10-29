-- Corrigir política RLS da tabela pops para usar auth.uid() diretamente
-- Isso resolve o erro 42501 (violação de RLS) na criação de POPs

-- Remover política problemática que usa get_current_user_id()
DROP POLICY IF EXISTS "Authenticated users can create POPs" ON public.pops;

-- Criar política simplificada usando auth.uid() diretamente (igual à tabela cronogramas)
CREATE POLICY "Authenticated users can create POPs"
ON public.pops
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Remover função desnecessária (não é mais usada após correção)
DROP FUNCTION IF EXISTS public.get_current_user_id();