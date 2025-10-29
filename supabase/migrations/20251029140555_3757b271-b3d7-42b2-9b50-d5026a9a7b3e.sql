-- Trigger para alertar sobre supervisores sem zona atribuída
CREATE OR REPLACE FUNCTION public.check_supervisor_zona()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.zona_id IS NULL THEN
    -- Verificar se é supervisor
    IF EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = NEW.id AND role = 'supervisor'
    ) THEN
      RAISE WARNING 'Supervisor % sem zona atribuída', NEW.full_name;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger para monitorar inserts/updates
DROP TRIGGER IF EXISTS warn_supervisor_without_zona ON public.profiles;
CREATE TRIGGER warn_supervisor_without_zona
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_supervisor_zona();

-- Atualizar usuário PAULO SERGIO com uma zona padrão (ajustar zona_id conforme necessário)
-- Primeiro, vamos verificar se existe alguma zona disponível e atribuir
DO $$
DECLARE
  v_default_zona_id UUID;
BEGIN
  -- Pegar a primeira zona disponível
  SELECT id INTO v_default_zona_id FROM public.zonas_operativas LIMIT 1;
  
  IF v_default_zona_id IS NOT NULL THEN
    -- Atualizar PAULO SERGIO
    UPDATE public.profiles
    SET zona_id = v_default_zona_id
    WHERE email = 'paulosergion218@gmail.com' AND zona_id IS NULL;
    
    RAISE NOTICE 'Usuário PAULO SERGIO atualizado com zona_id: %', v_default_zona_id;
  ELSE
    RAISE WARNING 'Nenhuma zona disponível para atribuir';
  END IF;
END;
$$;