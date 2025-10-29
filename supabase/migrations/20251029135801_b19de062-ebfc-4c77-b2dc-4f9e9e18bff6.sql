-- Atualizar função handle_new_user para extrair e salvar zona_id dos metadados
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_zona_id UUID;
BEGIN
  -- Extrair zona_id do raw_user_meta_data
  v_zona_id := (NEW.raw_user_meta_data->>'zona_id')::UUID;
  
  -- Inserir perfil com zona já atribuída
  INSERT INTO public.profiles (id, full_name, email, zona_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    v_zona_id
  );
  
  -- Role padrão: supervisor
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor');
  
  RETURN NEW;
END;
$$;