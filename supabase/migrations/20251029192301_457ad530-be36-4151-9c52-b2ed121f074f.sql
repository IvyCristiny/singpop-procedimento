-- Criar tabela de histórico de POPs para auditoria
CREATE TABLE IF NOT EXISTS public.pops_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_id uuid REFERENCES public.pops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('create', 'update', 'delete')),
  changes jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pops_history ENABLE ROW LEVEL SECURITY;

-- Policy: Gerente geral pode ver histórico
CREATE POLICY "Gerente geral can view pops history"
ON public.pops_history
FOR SELECT
USING (public.has_role(auth.uid(), 'gerente_geral'::app_role));

-- Policy: Gerente zona pode ver histórico da sua zona
CREATE POLICY "Gerente zona can view pops history from their zone"
ON public.pops_history
FOR SELECT
USING (
  public.has_role(auth.uid(), 'gerente_zona'::app_role) 
  AND pop_id IN (
    SELECT id FROM public.pops 
    WHERE zona_id = public.get_user_zona_id(auth.uid())
  )
);

-- Policy: Todos autenticados podem inserir histórico
CREATE POLICY "Authenticated users can insert pops history"
ON public.pops_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Habilitar realtime para tabela pops
ALTER PUBLICATION supabase_realtime ADD TABLE public.pops;