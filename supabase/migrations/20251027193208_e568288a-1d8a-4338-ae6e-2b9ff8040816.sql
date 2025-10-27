-- Create cronogramas table
CREATE TABLE public.cronogramas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  zona_id UUID REFERENCES public.zonas_operativas(id),
  
  -- Identificação
  titulo TEXT NOT NULL,
  condominio_nome TEXT NOT NULL,
  codigo TEXT NOT NULL,
  versao TEXT NOT NULL DEFAULT '1',
  
  -- Dados gerais
  turno TEXT NOT NULL,
  periodicidade TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  supervisao TEXT,
  
  -- POPs associadas (múltiplas)
  pop_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Rotinas (estruturas complexas)
  rotina_diaria JSONB NOT NULL DEFAULT '[]'::jsonb,
  rotina_semanal JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Revisão
  responsavel_revisao TEXT,
  data_revisao DATE,
  
  -- Observações gerais
  observacoes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comentários
COMMENT ON TABLE public.cronogramas IS 'Cronogramas de atividades diárias e semanais vinculados a POPs';
COMMENT ON COLUMN public.cronogramas.pop_ids IS 'Array de IDs dos POPs incluídos no cronograma';
COMMENT ON COLUMN public.cronogramas.rotina_diaria IS 'Array de objetos com horário, ambiente, detalhamento e responsável';
COMMENT ON COLUMN public.cronogramas.rotina_semanal IS 'Array de objetos com dia_semana, atividade e observações';

-- Índices para performance
CREATE INDEX idx_cronogramas_user_id ON public.cronogramas(user_id);
CREATE INDEX idx_cronogramas_zona_id ON public.cronogramas(zona_id);
CREATE INDEX idx_cronogramas_condominio ON public.cronogramas(condominio_nome);

-- Trigger para updated_at
CREATE TRIGGER update_cronogramas_updated_at
  BEFORE UPDATE ON public.cronogramas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.cronogramas ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create cronogramas
CREATE POLICY "Authenticated users can create cronogramas"
  ON public.cronogramas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Supervisors can view their own cronogramas
CREATE POLICY "Supervisors can view their own cronogramas"
  ON public.cronogramas FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND public.has_role(auth.uid(), 'supervisor'::public.app_role)
  );

-- Gerente zona can view cronogramas from their zone
CREATE POLICY "Gerente zona can view cronogramas from their zone"
  ON public.cronogramas FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'gerente_zona'::public.app_role)
    AND zona_id = public.get_user_zona_id(auth.uid())
  );

-- Gerente geral can view all cronogramas
CREATE POLICY "Gerente geral can view all cronogramas"
  ON public.cronogramas FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'::public.app_role));

-- Users can update their own cronogramas
CREATE POLICY "Users can update their own cronogramas"
  ON public.cronogramas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Gerente geral can update any cronograma
CREATE POLICY "Gerente geral can update any cronograma"
  ON public.cronogramas FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'::public.app_role));

-- Users can delete their own cronogramas
CREATE POLICY "Users can delete their own cronogramas"
  ON public.cronogramas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Gerente geral can delete any cronograma
CREATE POLICY "Gerente geral can delete any cronograma"
  ON public.cronogramas FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'gerente_geral'::public.app_role));