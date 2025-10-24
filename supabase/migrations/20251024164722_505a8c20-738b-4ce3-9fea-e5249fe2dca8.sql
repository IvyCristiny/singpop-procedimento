-- Criar tabela de zonas operativas
CREATE TABLE public.zonas_operativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inserir as 7 zonas iniciais
INSERT INTO public.zonas_operativas (nome) VALUES
  ('Zona Operativa 1'),
  ('Zona Operativa 2'),
  ('Zona Operativa 3'),
  ('Zona Operativa 4'),
  ('Select'),
  ('Empresarial'),
  ('Vigilância');

-- Enable RLS
ALTER TABLE public.zonas_operativas ENABLE ROW LEVEL SECURITY;

-- Policies para zonas_operativas
CREATE POLICY "Everyone can view zonas"
  ON public.zonas_operativas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gerente geral can manage zonas"
  ON public.zonas_operativas
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'gerente_geral'::app_role))
  WITH CHECK (has_role(auth.uid(), 'gerente_geral'::app_role));

-- REMOVER POLICIES ANTIGAS ANTES DE DROPAR COLUNAS
DROP POLICY IF EXISTS "Gerente zona can view POPs from their zone" ON public.pops;

-- Agora podemos dropar as colunas zona
ALTER TABLE public.profiles DROP COLUMN IF EXISTS zona;
ALTER TABLE public.pops DROP COLUMN IF EXISTS zona;

-- Adicionar novas colunas zona_id
ALTER TABLE public.profiles 
  ADD COLUMN zona_id UUID REFERENCES public.zonas_operativas(id);

ALTER TABLE public.pops 
  ADD COLUMN zona_id UUID REFERENCES public.zonas_operativas(id);

-- Criar índices
CREATE INDEX idx_profiles_zona_id ON public.profiles(zona_id);
CREATE INDEX idx_pops_zona_id ON public.pops(zona_id);

-- Atualizar trigger handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
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
    (NEW.raw_user_meta_data->>'zona_id')::uuid
  );
  
  -- Default role: supervisor
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor');
  
  RETURN NEW;
END;
$$;

-- Policy: Gerente de zona pode visualizar perfis dos supervisores da sua zona
CREATE POLICY "Gerente zona can view supervisors in their zone"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = (SELECT zona_id FROM profiles WHERE id = auth.uid())
  );

-- Policy: Gerente de zona pode atualizar perfis dos supervisores da sua zona
CREATE POLICY "Gerente zona can update supervisors in their zone"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = (SELECT zona_id FROM profiles WHERE id = auth.uid())
    AND id IN (
      SELECT user_id FROM user_roles WHERE role = 'supervisor'::app_role
    )
  )
  WITH CHECK (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = (SELECT zona_id FROM profiles WHERE id = auth.uid())
  );

-- Policy: Gerente geral pode atualizar qualquer perfil
CREATE POLICY "Gerente geral can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'gerente_geral'::app_role))
  WITH CHECK (has_role(auth.uid(), 'gerente_geral'::app_role));

-- Nova policy de POPs usando zona_id
CREATE POLICY "Gerente zona can view POPs from their zone by zona_id"
  ON public.pops
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'gerente_zona'::app_role) 
    AND zona_id = (SELECT zona_id FROM profiles WHERE id = auth.uid())
  );

-- Trigger para atualizar updated_at em zonas_operativas
CREATE TRIGGER update_zonas_operativas_updated_at
  BEFORE UPDATE ON public.zonas_operativas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();