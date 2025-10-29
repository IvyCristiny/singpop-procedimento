-- Modificar trigger para NÃO atribuir role automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil SEM zona (zona_id será NULL)
  INSERT INTO public.profiles (id, full_name, email, zona_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    NULL  -- Zona fica NULL, será atribuída manualmente pelo Gerente Geral
  );
  
  -- NÃO inserir role automaticamente
  -- Gerente Geral vai atribuir manualmente via painel Admin
  
  RETURN NEW;
END;
$$;