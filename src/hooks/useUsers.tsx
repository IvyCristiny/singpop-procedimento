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
      // Remove all existing roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Add new role
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;
      toast.success("Role atualizada com sucesso");
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

  return {
    users,
    loading,
    updateUserRole,
    updateUserZona,
    refetch: fetchUsers
  };
};
