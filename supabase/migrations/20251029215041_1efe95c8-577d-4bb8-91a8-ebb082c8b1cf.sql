-- ============================================
-- ETAPA 2, 3, 4: REESTRUTURAÇÃO COMPLETA DO BACKEND (v2)
-- ============================================

-- ============================================
-- PARTE 1: ATUALIZAR TABELA DE AUDITORIA (se já existe)
-- ============================================

-- Dropar policy existente se houver
DROP POLICY IF EXISTS "Gerente geral can view audit logs" ON public.user_roles_audit;

-- Recriar policy
CREATE POLICY "Gerente geral can view audit logs"
ON public.user_roles_audit
FOR SELECT
USING (has_role(auth.uid(), 'gerente_geral'::app_role));

-- ============================================
-- PARTE 2: ATUALIZAR/CRIAR FUNÇÕES DE SEGURANÇA
-- ============================================

-- Função: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função: get_user_zona_id
CREATE OR REPLACE FUNCTION public.get_user_zona_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT zona_id FROM public.profiles WHERE id = _user_id
$$;

-- Função: update_user_role_safe
CREATE OR REPLACE FUNCTION public.update_user_role_safe(p_user_id uuid, p_new_role app_role)
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

-- Função: assign_zona_to_user (NOVA)
CREATE OR REPLACE FUNCTION public.assign_zona_to_user(p_user_id uuid, p_zona_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apenas Gerente Geral pode atribuir zona
  IF NOT has_role(auth.uid(), 'gerente_geral'::app_role) THEN
    RAISE EXCEPTION 'Apenas Gerente Geral pode atribuir zonas';
  END IF;
  
  -- Atualizar zona do usuário
  UPDATE public.profiles
  SET zona_id = p_zona_id
  WHERE id = p_user_id;
END;
$$;

-- Função: delete_user_safe
CREATE OR REPLACE FUNCTION public.delete_user_safe(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'gerente_geral'::app_role) THEN
    RAISE EXCEPTION 'Apenas Gerente Geral pode excluir usuários';
  END IF;
  
  IF auth.uid() = p_user_id THEN
    RAISE EXCEPTION 'Não é possível excluir seu próprio usuário';
  END IF;
  
  INSERT INTO public.user_roles_audit (user_id, old_role, new_role, changed_by)
  SELECT p_user_id, role, NULL, auth.uid()
  FROM public.user_roles
  WHERE user_id = p_user_id;
  
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;

-- ============================================
-- PARTE 3: CRIAR/ATUALIZAR TRIGGERS
-- ============================================

-- Trigger: handle_new_user (SEM zona obrigatória)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, zona_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    NULL
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: audit_user_role_change
CREATE OR REPLACE FUNCTION public.audit_user_role_change()
RETURNS trigger
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
    VALUES (NEW.user_id, NULL, NEW.role, COALESCE(auth.uid(), NEW.user_id));
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS audit_user_role_changes ON public.user_roles;
CREATE TRIGGER audit_user_role_changes
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_user_role_change();

-- Trigger: check_supervisor_zona (WARNING apenas)
CREATE OR REPLACE FUNCTION public.check_supervisor_zona()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.zona_id IS NULL THEN
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

DROP TRIGGER IF EXISTS check_supervisor_zona_trigger ON public.profiles;
CREATE TRIGGER check_supervisor_zona_trigger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_supervisor_zona();

-- Trigger: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_cronogramas_updated_at ON public.cronogramas;
CREATE TRIGGER update_cronogramas_updated_at
  BEFORE UPDATE ON public.cronogramas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pops_updated_at ON public.pops;
CREATE TRIGGER update_pops_updated_at
  BEFORE UPDATE ON public.pops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_zonas_updated_at ON public.zonas_operativas;
CREATE TRIGGER update_zonas_updated_at
  BEFORE UPDATE ON public.zonas_operativas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: check_user_has_role
CREATE OR REPLACE FUNCTION public.check_user_has_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.id
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'supervisor'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Role supervisor atribuída automaticamente para usuário %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_user_has_role_trigger ON public.profiles;
CREATE TRIGGER check_user_has_role_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_user_has_role();

-- ============================================
-- PARTE 4: ATUALIZAR RLS POLICIES
-- ============================================

-- PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Gerente geral can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Gerente geral can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Gerente zona can view supervisors in their zone" ON public.profiles;
DROP POLICY IF EXISTS "Gerente zona can update supervisors in their zone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Gerente geral can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'gerente_geral'::app_role));

CREATE POLICY "Gerente zona can view supervisors in their zone"
ON public.profiles FOR SELECT
USING (
  has_role(auth.uid(), 'gerente_zona'::app_role) 
  AND zona_id = get_user_zona_id(auth.uid())
);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Gerente geral can update any profile"
ON public.profiles FOR UPDATE
USING (has_role(auth.uid(), 'gerente_geral'::app_role))
WITH CHECK (has_role(auth.uid(), 'gerente_geral'::app_role));

CREATE POLICY "Gerente zona can update supervisors in their zone"
ON public.profiles FOR UPDATE
USING (
  has_role(auth.uid(), 'gerente_zona'::app_role)
  AND zona_id = get_user_zona_id(auth.uid())
  AND id IN (SELECT user_id FROM user_roles WHERE role = 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'gerente_zona'::app_role)
  AND zona_id = get_user_zona_id(auth.uid())
);

-- USER_ROLES
DROP POLICY IF EXISTS "Allow authenticated to view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only service role can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "No direct updates to user roles" ON public.user_roles;
DROP POLICY IF EXISTS "No direct deletes of user roles" ON public.user_roles;

CREATE POLICY "Allow authenticated to view all user roles"
ON public.user_roles FOR SELECT USING (true);

CREATE POLICY "Only service role can insert user roles"
ON public.user_roles FOR INSERT WITH CHECK (false);

CREATE POLICY "No direct updates to user roles"
ON public.user_roles FOR UPDATE USING (false);

CREATE POLICY "No direct deletes of user roles"
ON public.user_roles FOR DELETE USING (false);