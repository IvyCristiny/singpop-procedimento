-- Migração para corrigir estrutura do catálogo
-- Remove dados antigos e permite reinicialização com estrutura correta

-- Deletar todos os registros antigos do catálogo
DELETE FROM public.catalog;

-- Comentário: O catálogo será reinicializado automaticamente pelo
-- hook useCatalog.tsx usando os dados corretos de src/data/catalog.ts
-- na próxima carga da aplicação, garantindo estrutura JSON compatível
-- com o schema TypeScript definido em src/types/schema.ts