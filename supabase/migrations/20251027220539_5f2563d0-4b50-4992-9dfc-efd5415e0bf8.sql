-- Função para atualizar role de forma atômica e segura
CREATE OR REPLACE FUNCTION public.update_user_role_safe(
  p_user_id uuid,
  p_new_role app_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Deletar role antiga
  DELETE FROM public.user_roles WHERE user_id = p_user_id;
  
  -- Inserir nova role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_new_role);
END;
$$;

-- Criar tabela de auditoria para mudanças de role
CREATE TABLE IF NOT EXISTS public.user_roles_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  old_role app_role,
  new_role app_role NOT NULL,
  changed_by uuid NOT NULL,
  changed_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.user_roles_audit ENABLE ROW LEVEL SECURITY;

-- Policy para gerente geral ver auditoria
CREATE POLICY "Gerente geral can view audit logs"
ON public.user_roles_audit
FOR SELECT
USING (has_role(auth.uid(), 'gerente_geral'));

-- Função de trigger para registrar mudanças
CREATE OR REPLACE FUNCTION public.audit_user_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.user_roles_audit (user_id, old_role, new_role, changed_by)
    VALUES (OLD.user_id, OLD.role, NULL, auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_roles_audit (user_id, old_role, new_role, changed_by)
    VALUES (NEW.user_id, NULL, NEW.role, auth.uid());
    RETURN NEW;
  END IF;
END;
$$;

-- Criar trigger para auditoria
DROP TRIGGER IF EXISTS user_roles_audit_trigger ON public.user_roles;
CREATE TRIGGER user_roles_audit_trigger
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.audit_user_role_change();