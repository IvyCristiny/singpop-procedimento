-- Adicionar campos para múltiplas atividades e imagens anexas
ALTER TABLE public.pops 
ADD COLUMN activity_ids JSONB,
ADD COLUMN attached_images JSONB;