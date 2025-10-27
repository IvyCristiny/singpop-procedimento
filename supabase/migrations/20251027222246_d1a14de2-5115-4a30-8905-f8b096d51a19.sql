-- Função auxiliar para garantir user_id consistente
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid()
$$;

-- Atualizar política RLS da tabela pops para usar a função auxiliar
DROP POLICY IF EXISTS "Authenticated users can create POPs" ON public.pops;
CREATE POLICY "Authenticated users can create POPs"
ON public.pops
FOR INSERT
TO authenticated
WITH CHECK (user_id = get_current_user_id() AND get_current_user_id() IS NOT NULL);

-- Função segura para excluir usuários (apenas gerente_geral)
CREATE OR REPLACE FUNCTION public.delete_user_safe(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se quem está executando é gerente_geral
  IF NOT has_role(auth.uid(), 'gerente_geral'::app_role) THEN
    RAISE EXCEPTION 'Apenas Gerente Geral pode excluir usuários';
  END IF;
  
  -- Impedir auto-exclusão
  IF auth.uid() = p_user_id THEN
    RAISE EXCEPTION 'Não é possível excluir seu próprio usuário';
  END IF;
  
  -- Registrar na auditoria antes de excluir
  INSERT INTO public.user_roles_audit (user_id, old_role, new_role, changed_by)
  SELECT p_user_id, role, NULL, auth.uid()
  FROM public.user_roles
  WHERE user_id = p_user_id;
  
  -- Deletar das tabelas (cascade vai cuidar do resto)
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;