-- Atualizar o catálogo com a biblioteca completa migrada dos templates POP
-- Esta migração expande o catálogo de 3 para 9 funções com 26 atividades detalhadas
-- O hook useCatalog vai inicializar automaticamente com o catálogo padrão expandido

UPDATE catalog
SET 
  version = '2.0',
  last_modified_at = NOW(),
  last_modified_by = NULL
WHERE id = (SELECT id FROM catalog LIMIT 1);

-- Comentário: A estrutura completa do catálogo está em src/data/catalog.ts
-- O sistema irá recarregar automaticamente do arquivo padrão na próxima inicialização