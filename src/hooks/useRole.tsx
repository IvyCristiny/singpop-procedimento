import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    fetchRoles();
  }, [user]);

  const fetchRoles = async () => {
    if (!user) return;

    console.log("🔐 Carregando roles para usuário:", user.id);

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      
      const fetchedRoles = data?.map(r => r.role as AppRole) || [];
      console.log("✅ Roles carregadas:", fetchedRoles);
      
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("❌ Erro ao carregar roles:", error);
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
