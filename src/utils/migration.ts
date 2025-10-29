import { POP } from "@/types/pop";
import { supabase } from "@/integrations/supabase/client";

// Mapeamento de tipos antigos para novo formato (functionId + activityId)
const typeMapping: Record<string, { functionId: string; activityId: string }> = {
  "portaria24h": { functionId: "PORT", activityId: "PORT_PED" },
  "ronda": { functionId: "PORT", activityId: "PORT_PED" },
  "limpeza": { functionId: "ASG", activityId: "ASG_HALL" },
  "vigilancia": { functionId: "PORT", activityId: "PORT_PED" },
  "jardinagem": { functionId: "JARD", activityId: "JARD_PODA" },
  "piscineiro": { functionId: "JARD", activityId: "JARD_PODA" },
  "manutencao": { functionId: "ASG", activityId: "ASG_HALL" },
  "concierge": { functionId: "PORT", activityId: "PORT_PED" },
  "administrador": { functionId: "PORT", activityId: "PORT_PED" }
};

export const isOldFormatPOP = (pop: any): boolean => {
  return pop.tipoPOP !== undefined && pop.functionId === undefined;
};

export const migrateOldPOP = (oldPOP: any): POP => {
  const mapping = typeMapping[oldPOP.tipoPOP] || { functionId: "PORT", activityId: "PORT_PED" };
  
  return {
    ...oldPOP,
    functionId: mapping.functionId,
    activityId: mapping.activityId,
    // Remove o campo antigo tipoPOP
    tipoPOP: undefined
  };
};

export const migrateAllPOPs = (pops: any[]): POP[] => {
  return pops.map(pop => {
    if (isOldFormatPOP(pop)) {
      console.log(`Migrando POP antigo: ${pop.codigoPOP}`);
      return migrateOldPOP(pop);
    }
    return pop;
  });
};

// Nova função: Migrar POPs do localStorage para Supabase
const MIGRATION_KEY = "singpop_migration_completed";
const STORAGE_KEY = "singpop_pops";

export const migrateLocalStorageToSupabase = async (userId: string, zonaId: string | null, userName: string) => {
  // Verificar se migração já foi feita
  const migrationCompleted = localStorage.getItem(MIGRATION_KEY);
  if (migrationCompleted === "true") {
    console.log("Migração já foi realizada anteriormente");
    return { success: true, message: "Migração já realizada", count: 0 };
  }

  try {
    // Buscar POPs do localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log("Nenhum POP encontrado no localStorage");
      localStorage.setItem(MIGRATION_KEY, "true");
      return { success: true, message: "Nenhum POP para migrar", count: 0 };
    }

    const localPOPs = JSON.parse(stored);
    if (!Array.isArray(localPOPs) || localPOPs.length === 0) {
      console.log("LocalStorage vazio ou inválido");
      localStorage.setItem(MIGRATION_KEY, "true");
      return { success: true, message: "Nenhum POP válido para migrar", count: 0 };
    }

    console.log(`Encontrados ${localPOPs.length} POPs no localStorage para migrar`);

    // Preparar POPs para inserção no Supabase
    const popsToInsert = localPOPs.map((pop: any) => ({
      condominio_nome: pop.condominioNome,
      function_id: pop.functionId,
      activity_id: pop.activityId,
      activity_ids: pop.activityIds || null,
      codigo_pop: pop.codigoPOP,
      versao: pop.versao,
      data_revisao: pop.dataRevisao || null,
      data_apresentacao: pop.dataApresentacao || null,
      responsavel_elaboracao: pop.responsavelElaboracao || null,
      nome_colaborador: pop.nomeColaborador || null,
      observacoes: pop.observacoes || null,
      custom_steps: pop.customSteps || [],
      attached_images: pop.attachedImages || null,
      user_id: userId,
      zona_id: zonaId,
      created_at: pop.createdAt || new Date().toISOString(),
    }));

    // Inserir no Supabase
    const { data, error } = await supabase
      .from("pops")
      .insert(popsToInsert)
      .select();

    if (error) {
      console.error("Erro ao migrar POPs:", error);
      throw error;
    }

    console.log(`${data?.length || 0} POPs migrados com sucesso`);

    // Registrar migração no histórico
    if (data && data.length > 0) {
      await supabase.from("pops_history").insert({
        pop_id: data[0].id,
        user_id: userId,
        user_name: userName,
        action_type: "create",
        changes: { migrated_from_localStorage: true, count: data.length },
      });
    }

    // Marcar migração como completa
    localStorage.setItem(MIGRATION_KEY, "true");
    
    // Opcional: Limpar localStorage após migração bem-sucedida
    // localStorage.removeItem(STORAGE_KEY);

    return { 
      success: true, 
      message: `${data?.length || 0} POPs migrados com sucesso`, 
      count: data?.length || 0 
    };
  } catch (error: any) {
    console.error("Erro durante migração:", error);
    return { 
      success: false, 
      message: `Erro ao migrar: ${error.message}`, 
      count: 0 
    };
  }
};
