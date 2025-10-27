-- Create catalog_history table for audit trail
CREATE TABLE public.catalog_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id UUID REFERENCES public.catalog(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('function', 'activity')),
  entity_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_catalog_history_catalog_id ON public.catalog_history(catalog_id);
CREATE INDEX idx_catalog_history_user_id ON public.catalog_history(user_id);
CREATE INDEX idx_catalog_history_created_at ON public.catalog_history(created_at DESC);

-- Enable RLS on catalog_history
ALTER TABLE public.catalog_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for catalog_history
-- Gerente geral can view all history
CREATE POLICY "Gerente geral can view catalog history"
ON public.catalog_history
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'gerente_geral'));

-- System can insert history (all authenticated users can insert for audit purposes)
CREATE POLICY "Authenticated users can insert catalog history"
ON public.catalog_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Initialize catalog with default data if empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.catalog LIMIT 1) THEN
    INSERT INTO public.catalog (catalog_data, version, last_modified_by)
    VALUES (
      '{
        "functions": [
          {
            "id": "limpeza",
            "name": "Limpeza e Conservação",
            "description": "Procedimentos de limpeza e manutenção predial",
            "icon": "Sparkles",
            "tags": ["limpeza", "conservação", "manutenção"],
            "activities": []
          },
          {
            "id": "portaria",
            "name": "Portaria e Controle de Acesso",
            "description": "Gestão de entrada e saída, controle de visitantes",
            "icon": "Shield",
            "tags": ["segurança", "acesso", "portaria"],
            "activities": []
          }
        ]
      }'::jsonb,
      '1.0',
      NULL
    );
  END IF;
END $$;