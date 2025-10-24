-- Update handle_new_user function to not insert zona_id during signup
-- Zona will be assigned later by managers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, zona_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    NULL  -- zona_id will be set later by managers
  );
  
  -- Default role: supervisor
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'supervisor');
  
  RETURN NEW;
END;
$$;