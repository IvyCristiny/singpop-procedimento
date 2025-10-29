import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

const ROLES_CACHE_KEY = 'user_roles_cache';

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      // Limpar cache quando usuário faz logout
      sessionStorage.removeItem(ROLES_CACHE_KEY);
      return;
    }

    fetchRoles();
  }, [user]);

  const fetchRoles = useCallback(async () => {
    if (!user) return;

    try {
      console.log('🔍 Buscando roles para user:', user.id);
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      
      const userRoles = data?.map(r => r.role as AppRole) || [];
      console.log('✅ Roles carregadas:', userRoles);
      
      // Salvar no cache
      if (userRoles.length > 0) {
        sessionStorage.setItem(ROLES_CACHE_KEY, JSON.stringify(userRoles));
      }
      
      setRoles(userRoles);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("❌ Error fetching roles:", error);
      
      // Tentar carregar do cache
      const cachedRoles = sessionStorage.getItem(ROLES_CACHE_KEY);
      if (cachedRoles) {
        console.log('📦 Carregando roles do cache');
        setRoles(JSON.parse(cachedRoles));
      } else if (retryCount < 3) {
        // Retry com exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`🔄 Tentando novamente em ${delay}ms (tentativa ${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchRoles();
        }, delay);
      } else {
        console.error('❌ Falha ao carregar roles após 3 tentativas');
      }
    } finally {
      setLoading(false);
    }
  }, [user, retryCount]);

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
