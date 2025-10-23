import { POP } from "@/types/pop";

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
