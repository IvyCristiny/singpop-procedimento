import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { POP } from "@/types/pop";

export const usePOPs = () => {
  const { user, profile } = useAuth();
  const { isGerenteGeral, isGerenteZona, isSupervisor } = useRole();
  const [pops, setPops] = useState<POP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPOPs = async () => {
    if (!user) {
      setPops([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from("pops").select("*");

      // Aplicar filtros baseados na role
      if (isSupervisor) {
        // Supervisor vê apenas seus próprios POPs
        query = query.eq("user_id", user.id);
      } else if (isGerenteZona && profile?.zona_id) {
        // Gerente de Zona vê POPs da sua zona
        query = query.eq("zona_id", profile.zona_id);
      }
      // Gerente Geral não tem filtros (vê todos os POPs)

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      // Transformar dados do Supabase para o formato POP
      const transformedPOPs: POP[] = (data || []).map((item: any) => ({
        id: item.id,
        condominioNome: item.condominio_nome,
        functionId: item.function_id,
        activityId: item.activity_id,
        activityIds: item.activity_ids ? (item.activity_ids as string[]) : undefined,
        codigoPOP: item.codigo_pop,
        versao: item.versao,
        dataRevisao: item.data_revisao,
        responsavelElaboracao: item.responsavel_elaboracao || "",
        nomeColaborador: item.nome_colaborador || "",
        dataApresentacao: item.data_apresentacao,
        observacoes: item.observacoes || "",
        customSteps: item.custom_steps as any,
        attachedImages: item.attached_images ? (item.attached_images as string[]) : undefined,
        createdAt: item.created_at,
      }));

      setPops(transformedPOPs);
    } catch (error) {
      console.error("Error fetching POPs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOPs();
  }, [user, profile, isGerenteGeral, isGerenteZona, isSupervisor]);

  const savePOP = async (pop: Omit<POP, "id" | "createdAt">) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const popData: any = {
      user_id: user.id,
      zona_id: profile?.zona_id || null,
      condominio_nome: pop.condominioNome,
      function_id: pop.functionId,
      activity_id: pop.activityId,
      activity_ids: pop.activityIds || null,
      codigo_pop: pop.codigoPOP,
      versao: pop.versao,
      data_revisao: pop.dataRevisao,
      responsavel_elaboracao: pop.responsavelElaboracao,
      nome_colaborador: pop.nomeColaborador,
      data_apresentacao: pop.dataApresentacao,
      observacoes: pop.observacoes,
      custom_steps: pop.customSteps || null,
      attached_images: pop.attachedImages || null,
    };

    const { error } = await supabase.from("pops").insert([popData]);

    if (error) throw error;

    await fetchPOPs();
  };

  const deletePOP = async (id: string) => {
    const { error } = await supabase.from("pops").delete().eq("id", id);

    if (error) throw error;

    await fetchPOPs();
  };

  return {
    pops,
    loading,
    savePOP,
    deletePOP,
    refetch: fetchPOPs,
  };
};
