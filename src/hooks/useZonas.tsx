import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ZonaOperativa } from "@/types/auth";
import { toast } from "sonner";

export const useZonas = () => {
  const [zonas, setZonas] = useState<ZonaOperativa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = async () => {
    try {
      const { data, error } = await supabase
        .from("zonas_operativas")
        .select("*")
        .order("nome");

      if (error) throw error;
      setZonas(data || []);
    } catch (error) {
      console.error("Error fetching zonas:", error);
      toast.error("Erro ao carregar zonas operativas");
    } finally {
      setLoading(false);
    }
  };

  const createZona = async (nome: string, descricao?: string) => {
    try {
      const { error } = await supabase
        .from("zonas_operativas")
        .insert({ nome, descricao });
      
      if (error) throw error;
      toast.success("Zona criada com sucesso");
      await fetchZonas();
      return { error: null };
    } catch (error: any) {
      console.error("Error creating zona:", error);
      toast.error("Erro ao criar zona");
      return { error };
    }
  };

  const updateZona = async (id: string, nome: string, descricao?: string) => {
    try {
      const { error } = await supabase
        .from("zonas_operativas")
        .update({ nome, descricao, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Zona atualizada com sucesso");
      await fetchZonas();
      return { error: null };
    } catch (error: any) {
      console.error("Error updating zona:", error);
      toast.error("Erro ao atualizar zona");
      return { error };
    }
  };

  const deleteZona = async (id: string) => {
    try {
      const { error } = await supabase
        .from("zonas_operativas")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Zona excluída com sucesso");
      await fetchZonas();
      return { error: null };
    } catch (error: any) {
      console.error("Error deleting zona:", error);
      toast.error("Erro ao excluir zona");
      return { error };
    }
  };

  return {
    zonas,
    loading,
    createZona,
    updateZona,
    deleteZona,
    refetch: fetchZonas
  };
};
