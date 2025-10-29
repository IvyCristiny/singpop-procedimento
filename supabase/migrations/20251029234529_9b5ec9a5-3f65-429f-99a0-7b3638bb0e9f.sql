-- Remover todas as policies que exigem autenticação em pops
DROP POLICY IF EXISTS "Authenticated users can view all pops" ON public.pops;
DROP POLICY IF EXISTS "Authenticated users can create pops" ON public.pops;
DROP POLICY IF EXISTS "Users can update own pops" ON public.pops;
DROP POLICY IF EXISTS "Users can delete own pops" ON public.pops;

-- Remover todas as policies que exigem autenticação em cronogramas
DROP POLICY IF EXISTS "Authenticated users can view all cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Authenticated users can create cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Users can update own cronogramas" ON public.cronogramas;
DROP POLICY IF EXISTS "Users can delete own cronogramas" ON public.cronogramas;

-- Remover policies de catalog
DROP POLICY IF EXISTS "Authenticated users can view catalog" ON public.catalog;
DROP POLICY IF EXISTS "Authenticated users can update catalog" ON public.catalog;

-- Restaurar policy pública para pops (acesso total sem autenticação)
CREATE POLICY "Public can do everything"
  ON public.pops
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Restaurar policy pública para cronogramas
CREATE POLICY "Public can do everything"
  ON public.cronogramas
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Restaurar policy pública para catalog
CREATE POLICY "Public can do everything"
  ON public.catalog
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Remover coluna user_id de pops
ALTER TABLE public.pops 
  DROP COLUMN IF EXISTS user_id;

-- Remover coluna user_id de cronogramas
ALTER TABLE public.cronogramas 
  DROP COLUMN IF EXISTS user_id;

-- Remover trigger que cria profile ao cadastrar usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover função que cria profile
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remover trigger de updated_at em profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Remover policies da tabela profiles primeiro
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Remover a tabela profiles
DROP TABLE IF EXISTS public.profiles CASCADE;