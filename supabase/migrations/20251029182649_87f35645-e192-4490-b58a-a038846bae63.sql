-- 1. Corrigir handle_new_user() para atribuir role "supervisor" automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil SEM zona obrigatória (zona_id pode ser NULL)
  INSERT INTO public.profiles (id, full_name, email, zona_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    NULL  -- Zona é opcional, pode ser atribuída depois
  );
  
  -- ✅ ATRIBUIR ROLE "supervisor" AUTOMATICAMENTE ao cadastrar
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 2. Remover trigger e função assign_default_role (não mais necessários)
DROP TRIGGER IF EXISTS assign_default_role_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.assign_default_role();

-- 3. Simplificar política RLS de SELECT para cronogramas
DROP POLICY IF EXISTS "Supervisors can view their own cronogramas" ON public.cronogramas;

CREATE POLICY "Users can view their own cronogramas"
ON public.cronogramas
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);