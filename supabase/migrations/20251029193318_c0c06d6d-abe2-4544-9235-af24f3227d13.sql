-- Remover política restritiva atual de pops_history
DROP POLICY IF EXISTS "Authenticated users can insert pops history" ON public.pops_history;

-- Criar nova política mais permissiva para inserção de histórico
-- Qualquer usuário autenticado pode inserir no histórico (é apenas auditoria)
CREATE POLICY "Authenticated users can insert pops history v2"
ON public.pops_history
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');