-- Permitir valores NULL na coluna new_role da tabela user_roles_audit
-- Isso é necessário para registrar corretamente quando roles são deletadas
ALTER TABLE public.user_roles_audit ALTER COLUMN new_role DROP NOT NULL;