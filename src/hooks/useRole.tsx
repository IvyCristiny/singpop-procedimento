import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🎭 [useRole] Iniciando para user:", user?.email);
    
    if (!user) {
      console.log("🎭 [useRole] Sem usuário, resetando roles");
      setRoles([]);
      setLoading(false);
      return;
    }

    fetchRoles();
  }, [user]);

  const fetchRoles = async () => {
    if (!user) return;

    console.log("🎭 [useRole] Buscando roles para:", user.email);
    
    const rolesTimeout = setTimeout(() => {
      console.warn("⏰ [useRole] TIMEOUT: Roles demoraram +5s");
      setLoading(false);
    }, 5000);

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      clearTimeout(rolesTimeout);

      if (error) throw error;
      
      const fetchedRoles = data?.map(r => r.role as AppRole) || [];
      console.log("✅ [useRole] Roles carregadas:", fetchedRoles);
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("❌ [useRole] Erro ao buscar roles:", error);
      clearTimeout(rolesTimeout);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole) => roles.includes(role);
  
  const primaryRole = roles.includes("gerente_geral") 
    ? "gerente_geral" 
    : roles.includes("gerente_zona") 
    ? "gerente_zona" 
    : "supervisor";

  return {
    roles,
    hasRole,
    primaryRole,
    loading,
    isSupervisor: hasRole("supervisor"),
    isGerenteZona: hasRole("gerente_zona"),
    isGerenteGeral: hasRole("gerente_geral")
  };
};
