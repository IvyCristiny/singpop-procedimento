import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cache de roles com TTL de 5 minutos
  const [rolesCache, setRolesCache] = useState<{
    roles: AppRole[];
    timestamp: number;
  } | null>(null);

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

    // Verificar cache (5 minutos de TTL)
    const now = Date.now();
    if (rolesCache && (now - rolesCache.timestamp) < 300000) {
      console.log("✅ Usando roles do cache");
      setRoles(rolesCache.roles);
      setLoading(false);
      return;
    }

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
      setRolesCache({ roles: fetchedRoles, timestamp: now });
    } catch (error) {
      console.error("❌ Erro ao carregar roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole) => roles.includes(role);
  
  const primaryRole = loading 
    ? null 
    : roles.includes("gerente_geral") 
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
