-- ============================================
-- CORREÇÃO: Eliminar Recursão RLS em user_roles
-- ============================================
-- Problema: Políticas RLS que chamam has_role() na tabela user_roles
-- criam recursão infinita, bloqueando acesso do Gerente Geral

-- 1️⃣ REMOVER POLÍTICAS RECURSIVAS
DROP POLICY IF EXISTS "Gerente geral can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Gerente geral can manage roles" ON public.user_roles;

-- 2️⃣ CRIAR POLÍTICAS SEM RECURSÃO

-- ✅ Permitir qualquer autenticado ver todas as roles
-- (necessário para has_role() funcionar sem bloqueios)
CREATE POLICY "Authenticated users can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- ✅ Apenas quem JÁ É gerente_geral pode modificar roles
-- (usa verificação direta SEM chamar has_role() para evitar recursão)
CREATE POLICY "Only existing gerente_geral can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'gerente_geral'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'gerente_geral'::app_role
  )
);