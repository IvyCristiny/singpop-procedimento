-- Promover usuários específicos para Gerente Geral
-- Remover role de supervisor dos usuários Ivy
DELETE FROM public.user_roles 
WHERE user_id IN (
  '4be103cf-0c80-4045-942c-219a8c0611bc',
  '58fafc66-3a24-4c43-9a91-29686d21756d'
)
AND role = 'supervisor';

-- Adicionar role de gerente_geral para os usuários Ivy
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('4be103cf-0c80-4045-942c-219a8c0611bc', 'gerente_geral'),
  ('58fafc66-3a24-4c43-9a91-29686d21756d', 'gerente_geral')
ON CONFLICT (user_id, role) DO NOTHING;

-- Remover zona_id já que gerente geral tem acesso a todas as zonas
UPDATE public.profiles
SET zona_id = NULL
WHERE id IN (
  '4be103cf-0c80-4045-942c-219a8c0611bc',
  '58fafc66-3a24-4c43-9a91-29686d21756d'
);