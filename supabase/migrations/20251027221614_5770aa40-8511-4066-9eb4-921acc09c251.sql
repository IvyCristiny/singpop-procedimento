-- Trigger para atribuir role padrão "supervisor" a novos usuários
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir role padrão "supervisor" para novo usuário
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela profiles
DROP TRIGGER IF EXISTS assign_default_role_trigger ON public.profiles;
CREATE TRIGGER assign_default_role_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.assign_default_role();

-- Atribuir role "supervisor" aos usuários existentes que não têm role
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'supervisor'::app_role
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
)
ON CONFLICT (user_id, role) DO NOTHING;