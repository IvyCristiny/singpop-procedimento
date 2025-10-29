-- PARTE 1: REMOVER TABELAS DESNECESSÁRIAS
DROP TABLE IF EXISTS public.user_roles_audit CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.catalog_history CASCADE;
DROP TABLE IF EXISTS public.pops_history CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.zonas_operativas CASCADE;

-- Remover enum de roles
DROP TYPE IF EXISTS public.app_role CASCADE;

-- PARTE 2: REMOVER FUNÇÕES DE SEGURANÇA
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_zona_id(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.update_user_role_safe(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.assign_zona_to_user(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.delete_user_safe(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.audit_user_role_change() CASCADE;
DROP FUNCTION IF EXISTS public.check_supervisor_zona() CASCADE;
DROP FUNCTION IF EXISTS public.check_user_has_role() CASCADE;

-- PARTE 3: SIMPLIFICAR TABELA POPS
-- Remover colunas de autenticação
ALTER TABLE public.pops 
  DROP COLUMN IF EXISTS user_id CASCADE,
  DROP COLUMN IF EXISTS zona_id CASCADE;

-- Remover todas as RLS policies antigas
DROP POLICY IF EXISTS "Gerente geral can view all POPs" ON public.pops;
DROP POLICY IF EXISTS "Users can update their own POPs" ON public.pops;
DROP POLICY IF EXISTS "Gerente geral can update any POP" ON public.pops;
DROP POLICY IF EXISTS "Users can delete their own POPs" ON public.pops;
DROP POLICY IF EXISTS "Gerente geral can delete any POP" ON public.pops;
DROP POLICY IF EXISTS "Users can view their own POPs" ON public.pops;
DROP POLICY IF EXISTS "Authenticated users can create POPs" ON public.pops;
DROP POLICY IF EXISTS "Gerente zona can view POPs from their zone by zona_id" ON public.pops;

-- Criar policy pública (acesso total)
CREATE POLICY "Public can do everything"
  ON public.pops
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- PARTE 4: SIMPLIFICAR TABELA CRONOGRAMAS
-- Remover colunas de autenticação
ALTER TABLE public.cronogramas 
  DROP COLUMN IF EXISTS user_id CASCADE,
  DROP COLUMN IF EXISTS zona_id CASCADE;

-- Remover todas as RLS policies antigas
DROP POLICY IF EXISTS "Users can update their own cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Gerente geral can update any cronograma" ON public.cronogramas;
DROP POLICY IF EXISTS "Users can delete their own cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Gerente geral can delete any cronograma" ON public.cronogramas;
DROP POLICY IF EXISTS "Users can view their own cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Authenticated users can create cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Gerente zona can view cronogramas from their zone" ON public.cronogramas;
DROP POLICY IF EXISTS "Gerente geral can view all cronogramas" ON public.cronogramas;

-- Criar policy pública
CREATE POLICY "Public can do everything"
  ON public.cronogramas
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- PARTE 5: SIMPLIFICAR TABELA CATALOG
-- Remover coluna last_modified_by
ALTER TABLE public.catalog 
  DROP COLUMN IF EXISTS last_modified_by CASCADE;

-- Remover RLS policies antigas
DROP POLICY IF EXISTS "All authenticated users can view catalog" ON public.catalog;
DROP POLICY IF EXISTS "Only gerente geral can insert catalog" ON public.catalog;
DROP POLICY IF EXISTS "Gerente geral can update catalog" ON public.catalog;
DROP POLICY IF EXISTS "Gerente zona can update catalog" ON public.catalog;

-- Criar policy pública
CREATE POLICY "Public can do everything"
  ON public.catalog
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);