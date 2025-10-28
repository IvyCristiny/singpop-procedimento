-- Permitir NULL em changed_by para registros de signup automático
ALTER TABLE public.user_roles_audit 
  ALTER COLUMN changed_by DROP NOT NULL;

-- Atualizar função de auditoria para lidar com signup
CREATE OR REPLACE FUNCTION public.audit_user_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.user_roles_audit (user_id, old_role, new_role, changed_by)
    VALUES (
      OLD.user_id, 
      OLD.role, 
      NULL, 
      auth.uid()
    );
    RETURN OLD;
    
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_roles_audit (user_id, old_role, new_role, changed_by)
    VALUES (
      NEW.user_id, 
      NULL, 
      NEW.role, 
      COALESCE(auth.uid(), NEW.user_id)
    );
    RETURN NEW;
  END IF;
END;
$$;