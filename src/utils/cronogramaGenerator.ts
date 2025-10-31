import { POP } from "@/types/pop";
import { Catalog, Activity } from "@/types/schema";
import { RotinaHorario } from "@/types/cronograma";

interface GeneratedRotina {
  rotinaDiaria: RotinaHorario[];
  sugestoes: {
    responsavel: string;
    condominio: string;
    periodicidade: string;
  };
}

/**
 * Gera rotina diária automaticamente a partir dos POPs selecionados
 */
export const generateRotinaFromPOPs = (
  popIds: string[],
  allPOPs: POP[],
  catalog: Catalog,
  horarioInicio: string = "07:00"
): GeneratedRotina => {
  const selectedPOPs = allPOPs.filter((pop) => popIds.includes(pop.id));

  if (selectedPOPs.length === 0) {
    throw new Error("Nenhum POP selecionado");
  }

  const rotinaDiaria: RotinaHorario[] = [];
  let ordem = 1;
  let currentTime = parseTime(horarioInicio);

  // Pegar sugestões do primeiro POP
  const firstPOP = selectedPOPs[0];
  const sugestoes = {
    responsavel: firstPOP.responsavelElaboracao || firstPOP.nomeColaborador || "",
    condominio: firstPOP.condominioNome || "",
    periodicidade: inferPeriodicidade(selectedPOPs, catalog),
  };

  // Processar cada POP
  for (const pop of selectedPOPs) {
    // Buscar a função e atividade no catálogo
    const funcao = catalog.functions.find((f) => f.id === pop.functionId);
    if (!funcao) continue;

    const activity = funcao.activities.find((a) => a.id === pop.activityId);
    if (!activity) continue;

    // Usar customSteps se existir, senão usar steps do catálogo
    const steps = pop.customSteps && pop.customSteps.length > 0 
      ? pop.customSteps 
      : activity.procedure.steps;

    // Calcular tempo total da atividade
    const tempoTotal = steps.reduce((sum, step) => sum + (step.time_estimate_min || 0), 0);

    // Criar detalhamento com os principais passos
    const detalhamento = steps
      .slice(0, 3) // Pegar os 3 primeiros passos
      .map((step) => `• ${step.title}`)
      .join("\n");

    // Calcular horário fim
    const horarioFim = addMinutes(currentTime, tempoTotal);

    // Criar entrada na rotina
    rotinaDiaria.push({
      id: `rotina-${ordem}`,
      horario_inicio: formatTime(currentTime),
      horario_fim: formatTime(horarioFim),
      ambiente_atividade: `${funcao.name} - ${activity.name}`,
      detalhamento: detalhamento + (steps.length > 3 ? `\n... e mais ${steps.length - 3} passos` : ""),
      responsavel: pop.nomeColaborador || pop.responsavelElaboracao || sugestoes.responsavel,
      ordem,
    });

    // Atualizar tempo atual (adicionar 5 minutos de pausa entre atividades)
    currentTime = addMinutes(horarioFim, 5);
    ordem++;
  }

  return {
    rotinaDiaria,
    sugestoes,
  };
};

/**
 * Infere periodicidade com base nos POPs e atividades
 */
const inferPeriodicidade = (pops: POP[], catalog: Catalog): string => {
  const activityTypes = new Set<string>();

  for (const pop of pops) {
    const funcao = catalog.functions.find((f) => f.id === pop.functionId);
    if (funcao) {
      const activity = funcao.activities.find((a) => a.id === pop.activityId);
      if (activity) {
        activityTypes.add(funcao.id);
      }
    }
  }

  // Heurísticas simples
  if (activityTypes.has("LIMP") || activityTypes.has("PORT")) {
    return "Diária";
  }
  if (activityTypes.has("JARD")) {
    return "Semanal";
  }
  if (activityTypes.has("PISC")) {
    return "Diária";
  }

  return "Diária"; // Default
};

/**
 * Parse time string "HH:MM" to minutes since midnight
 */
const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Add minutes to a time value
 */
const addMinutes = (time: number, minutes: number): number => {
  return time + minutes;
};

/**
 * Format minutes since midnight to "HH:MM"
 */
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};
