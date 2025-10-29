import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";

/**
 * Verifica se o usuário autenticado tem roles atribuídas
 * Se não tiver, tenta buscar diretamente do banco
 */
export const verifyUserRoles = async (): Promise<{
  hasRoles: boolean;
  roles: AppRole[];
  error?: string;
}> => {
  try {
    // Verificar se há usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        hasRoles: false,
        roles: [],
        error: "Usuário não autenticado"
      };
    }

    console.log('🔍 Verificando roles para user:', user.id);

    // Buscar roles diretamente do banco
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (error) {
      console.error("❌ Erro ao verificar roles:", error);
      return {
        hasRoles: false,
        roles: [],
        error: error.message
      };
    }

    const roles = data?.map(r => r.role as AppRole) || [];
    
    if (roles.length === 0) {
      console.warn("⚠️ Usuário sem roles atribuídas:", user.email);
      return {
        hasRoles: false,
        roles: [],
        error: "Nenhuma role atribuída. Entre em contato com o administrador."
      };
    }

    console.log('✅ Roles verificadas:', roles);
    return {
      hasRoles: true,
      roles
    };

  } catch (error) {
    console.error("❌ Erro na verificação de roles:", error);
    return {
      hasRoles: false,
      roles: [],
      error: "Erro ao verificar permissões"
    };
  }
};

/**
 * Verifica se o usuário tem uma role específica
 */
export const hasRole = async (role: AppRole): Promise<boolean> => {
  const { roles } = await verifyUserRoles();
  return roles.includes(role);
};

/**
 * Retorna a role principal do usuário (hierarquia: gerente_geral > gerente_zona > supervisor)
 */
export const getPrimaryRole = async (): Promise<AppRole | null> => {
  const { roles } = await verifyUserRoles();
  
  if (roles.includes("gerente_geral")) return "gerente_geral";
  if (roles.includes("gerente_zona")) return "gerente_zona";
  if (roles.includes("supervisor")) return "supervisor";
  
  return null;
};
