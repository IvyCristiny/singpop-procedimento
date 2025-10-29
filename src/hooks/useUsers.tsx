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
      // Usar a função segura do banco
      const { error } = await supabase.rpc('update_user_role_safe', {
        p_user_id: userId,
        p_new_role: newRole
      });

      if (error) throw error;
      toast.success("Role atualizada com sucesso");
      await fetchUsers();
      return { error: null };
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Erro ao atualizar role");
      return { error };
    }
  };

  const updateUserZona = async (userId: string, zonaId: string | null) => {
    try {
      if (zonaId) {
        // Usar a função segura do banco
        const { error } = await supabase.rpc('assign_zona_to_user', {
          p_user_id: userId,
          p_zona_id: zonaId
        });

        if (error) throw error;
      } else {
        // Se zona_id for null, atualizar diretamente (apenas Gerente Geral pode)
        const { error } = await supabase
          .from("profiles")
          .update({ zona_id: null })
          .eq("id", userId);

        if (error) throw error;
      }

      toast.success("Zona atualizada com sucesso");
      await fetchUsers();
      return { error: null };
    } catch (error: any) {
      console.error("Error updating zona:", error);
      toast.error(error.message || "Erro ao atualizar zona");
      return { error };
    }
  };

  return {
    users,
    loading,
    updateUserRole,
    updateUserZona,
    refetch: fetchUsers
  };
};
