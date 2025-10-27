-- Adicionar coluna para nome usado em relatórios
ALTER TABLE public.profiles ADD COLUMN report_name TEXT;

-- Comentário explicativo
COMMENT ON COLUMN public.profiles.report_name IS 'Nome simplificado usado em relatórios e exportações PDF/Excel';