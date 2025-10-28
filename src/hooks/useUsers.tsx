import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserWithDetails, AppRole, ProfileWithZona } from "@/types/auth";
import { toast } from "sonner";

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          zona:zonas_operativas(*)
        `)
        .order("full_name");

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const usersWithDetails: UserWithDetails[] = (profiles as any[]).map(profile => ({
        id: profile.id,
        profile: {
          ...profile,
          zona: profile.zona
        } as ProfileWithZona,
        roles: roles
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole)
      }));

      setUsers(usersWithDetails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // PROTEÇÃO 1: Impedir que usuário altere sua própria role
      if (user?.id === userId) {
        toast.error("Você não pode alterar sua própria role");
        return { error: new Error("Cannot change own role") };
      }
      
      // PROTEÇÃO 2: Verificar role do usuário alvo antes de deletar
      const { data: currentRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      
      const hasGerenteGeral = currentRoles?.some(r => r.role === "gerente_geral");
      
      // PROTEÇÃO 3: Impedir downgrade de gerente_geral sem confirmação dupla
      if (hasGerenteGeral && newRole !== "gerente_geral") {
        toast.error("⚠️ Não é permitido rebaixar Gerente Geral. Confirme a ação novamente se tiver certeza.");
        return { error: new Error("Cannot downgrade gerente_geral without confirmation") };
      }

      // PROTEÇÃO 4: Verificar se gerente_zona tem zona atribuída
      if (newRole === "gerente_zona") {
        const targetUser = users.find(u => u.id === userId);
        if (!targetUser?.profile.zona_id) {
          toast.error("❌ Gerente de Zona deve ter uma zona operativa atribuída!");
          return { error: new Error("Gerente zona requires zona_id") };
        }
      }
      
      // Usar função SQL atômica para garantir consistência
      const { error } = await supabase.rpc('update_user_role_safe', {
        p_user_id: userId,
        p_new_role: newRole
      });

      if (error) throw error;
      
      toast.success("✅ Role atualizada com sucesso");
      await fetchUsers();
      return { error: null };
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error("Erro ao atualizar role");
      return { error };
    }
  };

  const updateUserZona = async (userId: string, zonaId: string | null) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ zona_id: zonaId })
        .eq("id", userId);

      if (error) throw error;
      toast.success("Zona atualizada com sucesso");
      await fetchUsers();
      return { error: null };
    } catch (error: any) {
      console.error("Error updating zona:", error);
      toast.error("Erro ao atualizar zona");
      return { error };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // PROTEÇÃO 1: Impedir auto-exclusão
      if (user?.id === userId) {
        toast.error("Você não pode excluir seu próprio usuário");
        return { error: new Error("Cannot delete own user") };
      }
      
      // Usar função SQL segura
      const { error } = await supabase.rpc('delete_user_safe', {
        p_user_id: userId
      });

      if (error) throw error;
      
      toast.success("Usuário excluído com sucesso");
      await fetchUsers();
      return { error: null };
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Erro ao excluir usuário");
      return { error };
    }
  };

  return {
    users,
    loading,
    updateUserRole,
    updateUserZona,
    deleteUser,
    refetch: fetchUsers
  };
};
