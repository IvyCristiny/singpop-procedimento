-- ============================================
-- TRIGGERS PARA AUTOMAÇÃO E AUDITORIA
-- (Recriando apenas os que faltam)
-- ============================================

-- Drop e recriar trigger de auditoria (caso não exista)
DROP TRIGGER IF EXISTS on_user_role_change ON public.user_roles;
CREATE TRIGGER on_user_role_change
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW 
  EXECUTE FUNCTION public.audit_user_role_change();

-- Drop e recriar trigger de updated_at em zonas (caso não exista)  
DROP TRIGGER IF EXISTS update_zonas_operativas_updated_at ON public.zonas_operativas;
CREATE TRIGGER update_zonas_operativas_updated_at
  BEFORE UPDATE ON public.zonas_operativas
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();