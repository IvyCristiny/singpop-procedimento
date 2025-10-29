-- Fase 6: Garantir integridade do sistema de roles

-- 1. Função para verificar se usuário tem pelo menos uma role
CREATE OR REPLACE FUNCTION public.check_user_has_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o novo usuário criado não tem role
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.id
  ) THEN
    -- Auto-atribuir supervisor se não tiver role (já é feito no handle_new_user, mas isso é uma garantia extra)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'supervisor'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Role supervisor atribuída automaticamente para usuário %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2. Trigger para verificar roles após criação do perfil
DROP TRIGGER IF EXISTS ensure_user_has_role ON public.profiles;
CREATE TRIGGER ensure_user_has_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_user_has_role();

-- 3. Garantir que todos os usuários existentes tenham pelo menos uma role
-- (Apenas para usuários que já existem mas não têm role)
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'supervisor'::app_role
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
)
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Comentários para documentação
COMMENT ON FUNCTION public.check_user_has_role() IS 
  'Garante que todo usuário criado tenha pelo menos uma role (supervisor por padrão)';
COMMENT ON TRIGGER ensure_user_has_role ON public.profiles IS 
  'Trigger que executa check_user_has_role após inserção de perfil';
