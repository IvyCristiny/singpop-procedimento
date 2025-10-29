import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

// ✅ Cache global compartilhado entre todas as instâncias do hook
let globalRolesCache: {
  userId: string;
  roles: AppRole[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 60000; // 1 minuto

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

    const now = Date.now();
    
    // Verificar cache global (mesmo userId e ainda válido)
    if (
      globalRolesCache && 
      globalRolesCache.userId === user.id &&
      (now - globalRolesCache.timestamp) < CACHE_TTL
    ) {
      console.log("✅ Usando roles do cache global");
      setRoles(globalRolesCache.roles);
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
      
      // Atualizar cache global
      globalRolesCache = {
        userId: user.id,
        roles: fetchedRoles,
        timestamp: now
      };
      
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("❌ Erro ao carregar roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole) => roles.includes(role);
  
  const primaryRole: AppRole | null = loading || roles.length === 0
    ? null 
    : roles.includes("gerente_geral") 
      ? "gerente_geral" 
      : roles.includes("gerente_zona") 
      ? "gerente_zona" 
      : "supervisor";

  // Função para invalidar cache manualmente
  const invalidateRoleCache = () => {
    console.log("🔄 Invalidando cache de roles manualmente");
    globalRolesCache = null;
    fetchRoles();
  };

  return {
    roles,
    hasRole,
    primaryRole,
    loading,
    invalidateCache: invalidateRoleCache,
    isSupervisor: hasRole("supervisor"),
    isGerenteZona: hasRole("gerente_zona"),
    isGerenteGeral: hasRole("gerente_geral")
  };
};
