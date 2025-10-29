-- Criar tabela de perfis
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Usuário pode ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Função que cria profile quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário')
  );
  RETURN NEW;
END;
$$;

-- Trigger executa após inserção em auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Adicionar coluna user_id em pops
ALTER TABLE public.pops 
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Adicionar coluna user_id em cronogramas
ALTER TABLE public.cronogramas 
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Adicionar trigger para atualizar updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Remover policies públicas antigas e adicionar novas para pops
DROP POLICY IF EXISTS "Public can do everything" ON public.pops;

CREATE POLICY "Authenticated users can view all pops"
  ON public.pops
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create pops"
  ON public.pops
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pops"
  ON public.pops
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pops"
  ON public.pops
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Remover policies públicas antigas e adicionar novas para cronogramas
DROP POLICY IF EXISTS "Public can do everything" ON public.cronogramas;

CREATE POLICY "Authenticated users can view all cronogramas"
  ON public.cronogramas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create cronogramas"
  ON public.cronogramas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cronogramas"
  ON public.cronogramas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cronogramas"
  ON public.cronogramas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Remover policies públicas antigas e adicionar novas para catalog
DROP POLICY IF EXISTS "Public can do everything" ON public.catalog;

CREATE POLICY "Authenticated users can view catalog"
  ON public.catalog
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update catalog"
  ON public.catalog
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);