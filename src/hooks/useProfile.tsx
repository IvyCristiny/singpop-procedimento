import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

export const useProfile = (initialProfile: Profile | null) => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: { full_name?: string; report_name?: string }) => {
    if (!initialProfile) {
      toast({
        title: "Erro",
        description: "Nenhum perfil encontrado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", initialProfile.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
  };
};
