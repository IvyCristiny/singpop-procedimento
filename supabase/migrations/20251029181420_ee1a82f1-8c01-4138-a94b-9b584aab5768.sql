-- Simplificar política SELECT para permitir todos os usuários autenticados
-- verem seus próprios POPs (sem verificação de role)

-- Remover política restritiva que exige role de supervisor
DROP POLICY IF EXISTS "Supervisors can view their own POPs" ON public.pops;

-- Criar política permissiva para qualquer usuário autenticado
CREATE POLICY "Users can view their own POPs"
ON public.pops
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- As políticas para Gerente Zona e Gerente Geral permanecem inalteradas
-- para manter a hierarquia adequada