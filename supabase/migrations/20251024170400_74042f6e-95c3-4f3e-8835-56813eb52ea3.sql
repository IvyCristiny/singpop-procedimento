-- PARTE 1: Correção da Recursão Infinita nas Policies RLS

-- 1.1 Criar função helper get_user_zona_id (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_zona_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT zona_id FROM public.profiles WHERE id = _user_id
$$;

-- 1.2 Dropar policies problemáticas
DROP POLICY IF EXISTS "Gerente zona can view supervisors in their zone" ON public.profiles;
DROP POLICY IF EXISTS "Gerente zona can update supervisors in their zone" ON public.profiles;
DROP POLICY IF EXISTS "Gerente zona can view POPs from their zone by zona_id" ON public.pops;

-- 1.3 Criar policy crítica para usuários verem seu próprio perfil (DEVE VIR PRIMEIRO!)
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 1.4 Recriar policies para Gerente de Zona usando a função helper
CREATE POLICY "Gerente zona can view supervisors in their zone"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = get_user_zona_id(auth.uid())
  );

CREATE POLICY "Gerente zona can update supervisors in their zone"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = get_user_zona_id(auth.uid())
    AND id IN (
      SELECT user_id FROM user_roles WHERE role = 'supervisor'::app_role
    )
  )
  WITH CHECK (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = get_user_zona_id(auth.uid())
  );

CREATE POLICY "Gerente zona can view POPs from their zone by zona_id"
  ON public.pops
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = get_user_zona_id(auth.uid())
  );