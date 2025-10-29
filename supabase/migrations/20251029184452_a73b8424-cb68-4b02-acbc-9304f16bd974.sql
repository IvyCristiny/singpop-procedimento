-- ============================================
-- CORREÇÃO DEFINITIVA: Eliminar TODA recursão RLS
-- ============================================

-- 1️⃣ REMOVER TODAS as políticas recursivas de user_roles
DROP POLICY IF EXISTS "Only existing gerente_geral can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- 2️⃣ CRIAR POLÍTICAS SIMPLES SEM NENHUMA RECURSÃO

-- ✅ SELECT: Qualquer autenticado pode ver TODAS as roles
-- (necessário para has_role() funcionar e para hierarquia funcionar)
CREATE POLICY "Allow authenticated to view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- ✅ INSERT: Apenas service_role pode inserir roles diretamente
-- (usuários normais não devem inserir roles, apenas via RPC update_user_role_safe)
CREATE POLICY "Only service role can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);  -- Bloqueia todos, apenas RPC com security definer pode inserir

-- ✅ UPDATE: Ninguém pode atualizar roles diretamente
-- (apenas via RPC update_user_role_safe)
CREATE POLICY "No direct updates to user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

-- ✅ DELETE: Ninguém pode deletar roles diretamente
-- (apenas via RPC update_user_role_safe ou delete_user_safe)
CREATE POLICY "No direct deletes of user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);

-- 3️⃣ GARANTIR que as funções RPC continuam funcionando
-- (elas usam SECURITY DEFINER então bypassam RLS)
COMMENT ON FUNCTION public.update_user_role_safe IS 'Bypassa RLS para atualizar roles com segurança';
COMMENT ON FUNCTION public.delete_user_safe IS 'Bypassa RLS para deletar usuários com segurança';