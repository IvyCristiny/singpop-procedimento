-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('supervisor', 'gerente_zona', 'gerente_geral');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  zona TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- Create pops table
CREATE TABLE public.pops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condominio_nome TEXT NOT NULL,
  function_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  codigo_pop TEXT NOT NULL,
  versao TEXT NOT NULL,
  data_revisao DATE,
  responsavel_elaboracao TEXT,
  nome_colaborador TEXT,
  data_apresentacao DATE,
  observacoes TEXT,
  custom_steps JSONB DEFAULT '[]'::jsonb,
  zona TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on pops
ALTER TABLE public.pops ENABLE ROW LEVEL SECURITY;

-- Create catalog table (single row, global)
CREATE TABLE public.catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  version TEXT DEFAULT '1.0',
  last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on catalog
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email
  );
  
  -- Create default role as supervisor
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Gerente geral can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Gerente geral can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

CREATE POLICY "Gerente geral can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

-- RLS Policies for pops
CREATE POLICY "Supervisors can view their own POPs"
  ON public.pops
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Gerente zona can view POPs from their zone"
  ON public.pops
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'gerente_zona') AND
    zona = (SELECT zona FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Gerente geral can view all POPs"
  ON public.pops
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

CREATE POLICY "Authenticated users can create POPs"
  ON public.pops
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own POPs"
  ON public.pops
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Gerente geral can update any POP"
  ON public.pops
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

CREATE POLICY "Users can delete their own POPs"
  ON public.pops
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Gerente geral can delete any POP"
  ON public.pops
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

-- RLS Policies for catalog
CREATE POLICY "All authenticated users can view catalog"
  ON public.catalog
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gerente zona can update catalog"
  ON public.catalog
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_zona'));

CREATE POLICY "Gerente geral can update catalog"
  ON public.catalog
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'));

CREATE POLICY "Gerente geral can insert catalog"
  ON public.catalog
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'gerente_geral'));

-- Create function to update pops updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to update pops updated_at
CREATE TRIGGER update_pops_updated_at
  BEFORE UPDATE ON public.pops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();