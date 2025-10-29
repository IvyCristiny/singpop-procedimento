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
    if (!user) {
      console.log('👤 [useRole] Sem usuário, pulando fetchRoles');
      return;
    }

    console.log('🎭 [useRole] Iniciando fetchRoles para userId:', user.id);
    
    const timeoutId = setTimeout(() => {
      console.error('⚠️ [useRole] Timeout de 5s atingido no fetchRoles');
      setLoading(false);
    }, 5000);

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error('❌ [useRole] Erro ao buscar roles:', error);
        throw error;
      }
      
      console.log('✅ [useRole] Roles carregadas com sucesso:', data);
      setRoles(data?.map(r => r.role as AppRole) || []);
    } catch (error) {
      console.error("❌ [useRole] Error fetching roles:", error);
    } finally {
      clearTimeout(timeoutId);
      console.log('🏁 [useRole] fetchRoles finalizado, setLoading(false)');
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
