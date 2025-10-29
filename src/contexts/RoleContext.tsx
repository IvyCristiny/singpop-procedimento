import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface RoleContextType {
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  primaryRole: AppRole;
  loading: boolean;
  isSupervisor: boolean;
  isGerenteZona: boolean;
  isGerenteGeral: boolean;
  refetchRoles: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchRoles = useCallback(async (force = false) => {
    if (!user) {
      console.log("🎭 [RoleContext] Sem usuário, resetando roles");
      setRoles([]);
      setLoading(false);
      return;
    }

    // Cache: só buscar se passou >30s ou force=true
    const now = Date.now();
    if (!force && now - lastFetch < 30000 && roles.length > 0) {
      console.log("🎭 [RoleContext] Usando cache de roles");
      return;
    }

    // Evitar múltiplas chamadas simultâneas
    if (isFetching) {
      console.log("🎭 [RoleContext] Já está buscando roles, ignorando");
      return;
    }

    console.log("🎭 [RoleContext] Buscando roles para:", user.email);
    setIsFetching(true);
    
    const startTime = Date.now();
    const rolesTimeout = setTimeout(() => {
      console.warn("⏰ [RoleContext] ALERTA: Roles demoraram +3s");
      toast({
        title: "Carregando permissões",
        description: "Aguarde, verificando suas permissões...",
        variant: "default",
      });
    }, 3000);

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      clearTimeout(rolesTimeout);
      const duration = Date.now() - startTime;

      if (error) throw error;
      
      const fetchedRoles = data?.map(r => r.role as AppRole) || [];
      console.log(`✅ [RoleContext] Roles carregadas em ${duration}ms:`, fetchedRoles);

      // Verificar mudanças inesperadas
      const storedRoles = sessionStorage.getItem('user_roles');
      if (storedRoles && JSON.stringify(fetchedRoles) !== storedRoles && roles.length > 0) {
        console.warn("⚠️ [RoleContext] ALERTA: Roles mudaram inesperadamente!");
        toast({
          title: "Permissões alteradas",
          description: "Suas permissões foram atualizadas. Verifique com o administrador.",
          variant: "default",
        });
      }
      
      sessionStorage.setItem('user_roles', JSON.stringify(fetchedRoles));
      setRoles(fetchedRoles);
      setLastFetch(now);
    } catch (error) {
      console.error("❌ [RoleContext] Erro ao buscar roles:", error);
      clearTimeout(rolesTimeout);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [user, roles, lastFetch, isFetching]);

  useEffect(() => {
    if (user) {
      fetchRoles();
    } else {
      setRoles([]);
      setLoading(false);
    }
  }, [user?.id]); // Só reage quando o user.id muda

  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);
  
  const primaryRole = roles.includes("gerente_geral") 
    ? "gerente_geral" 
    : roles.includes("gerente_zona") 
    ? "gerente_zona" 
    : "supervisor";

  return (
    <RoleContext.Provider value={{
      roles,
      hasRole,
      primaryRole,
      loading,
      isSupervisor: hasRole("supervisor"),
      isGerenteZona: hasRole("gerente_zona"),
      isGerenteGeral: hasRole("gerente_geral"),
      refetchRoles: () => fetchRoles(true)
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
