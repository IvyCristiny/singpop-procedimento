import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { POP } from "@/types/pop";

export const usePOPs = () => {
  const { user, profile } = useAuth();
  const { isGerenteGeral, isGerenteZona, isSupervisor, loading: rolesLoading } = useRole();
  const [pops, setPops] = useState<POP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPOPs = async () => {
    if (!user) {
      setPops([]);
      setLoading(false);
      return;
    }

    // CRÍTICO: Aguardar roles carregarem completamente antes de buscar POPs
    if (rolesLoading) {
      console.log("⏳ Aguardando roles carregarem...");
      return;
    }

    console.log("🔍 Fetching POPs com roles:", { isGerenteGeral, isGerenteZona, isSupervisor });

    try {
      let query = supabase.from("pops").select("*");

      // Aplicar filtros baseados na role
      if (isSupervisor) {
        console.log("👤 Supervisor: filtrando por user_id");
        query = query.eq("user_id", user.id);
      } else if (isGerenteZona && profile?.zona_id) {
        console.log("🌍 Gerente Zona: filtrando por zona_id", profile.zona_id);
        query = query.eq("zona_id", profile.zona_id);
      } else if (isGerenteGeral) {
        console.log("🔓 Gerente Geral: SEM filtros (ver tudo)");
        // SEM FILTROS - ver tudo
      } else {
        console.warn("⚠️ Role indefinida, aplicando filtro padrão de supervisor");
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Erro ao buscar POPs:", error);
        throw error;
      }

      console.log(`✅ POPs carregadas: ${data?.length || 0}`);

      // Transformar dados do Supabase para o formato POP
      const transformedPOPs: POP[] = (data || []).map((item: any) => ({
        id: item.id,
        userId: item.user_id,
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
  }, [user, profile, isGerenteGeral, isGerenteZona, isSupervisor, rolesLoading]);

  const savePOP = async (pop: Omit<POP, "id" | "createdAt">) => {
    if (!user) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }

    // Verificar sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("❌ Sessão inválida ou expirada:", sessionError);
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    console.log("✅ Salvando POP com user_id:", user.id);

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

    if (error) {
      console.error("❌ Erro ao salvar POP:", error);
      
      // Mensagens de erro específicas
      if (error.code === '42501') {
        throw new Error("Erro de permissão. Faça logout e login novamente.");
      }
      
      throw error;
    }

    console.log("✅ POP salvo com sucesso");
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
