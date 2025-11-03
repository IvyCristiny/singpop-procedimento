import { POP } from "@/types/pop";
import { Catalog, Activity } from "@/types/schema";
import { RotinaHorario, RotinaConfig } from "@/types/cronograma";

interface GeneratedRotina {
  rotinaDiaria: RotinaHorario[];
  sugestoes: {
    responsavel: string;
    condominio: string;
    periodicidade: string;
  };
}

interface TurnoInfo {
  inicio: number; // minutos desde meia-noite
  fim: number;
  almocoInicio?: number;
  almocoFim?: number;
  duracaoTotal: number; // minutos úteis
}

interface AtividadeComTempo {
  pop: POP;
  funcao: any;
  activity: Activity;
  tempo: number;
}

/**
 * Gera rotina diária automaticamente a partir dos POPs selecionados
 */
export const generateRotinaFromPOPs = (
  popIds: string[],
  allPOPs: POP[],
  catalog: Catalog,
  config: RotinaConfig
): GeneratedRotina => {
  const selectedPOPs = allPOPs.filter((pop) => popIds.includes(pop.id));

  if (selectedPOPs.length === 0) {
    throw new Error("Nenhum POP selecionado");
  }

  // Validar condomínio único
  const condominios = new Set(selectedPOPs.map((p) => p.condominioNome));
  if (condominios.size > 1) {
    throw new Error(
      `POPs de múltiplos condomínios selecionados: ${Array.from(condominios).join(", ")}. ` +
        `Apenas POPs do mesmo condomínio podem ser usados em um cronograma.`
    );
  }

  // Parse turno
  const turnoInfo = parseTurno(config);

  // Priorizar POPs
  const priorizedPOPs = priorizarPOPs(selectedPOPs, catalog, config.priorizacao);

  // Extrair atividades com tempo
  const atividades: AtividadeComTempo[] = [];
  for (const pop of priorizedPOPs) {
    const funcao = catalog.functions.find((f) => f.id === pop.functionId);
    if (!funcao) continue;

    // Suportar múltiplas atividades (activityIds) ou atividade única (activityId)
    const activityIdsToProcess = pop.activityIds && pop.activityIds.length > 0 
      ? pop.activityIds 
      : [pop.activityId];

    // Expandir cada atividade em uma entrada separada
    for (const activityId of activityIdsToProcess) {
      const activity = funcao.activities.find((a) => a.id === activityId);
      if (!activity) continue;

      const steps =
        pop.customSteps && pop.customSteps.length > 0
          ? pop.customSteps
          : activity.procedure.steps;

      const tempo = steps.reduce((sum, step) => sum + (step.time_estimate_min || 0), 0);

      atividades.push({ pop, funcao, activity, tempo });
    }
  }

  // Validar tempo total
  validarTempoTotal(atividades, turnoInfo);

  // Distribuir atividades
  const rotinaDiaria = distribuirAtividades(atividades, turnoInfo, config);

  // Pegar sugestões do primeiro POP
  const firstPOP = selectedPOPs[0];
  const sugestoes = {
    responsavel: firstPOP.responsavelElaboracao || firstPOP.nomeColaborador || "",
    condominio: firstPOP.condominioNome || "",
    periodicidade: inferPeriodicidade(selectedPOPs, catalog),
  };

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

/**
 * Parse turno e extrair informações de horário
 */
const parseTurno = (config: RotinaConfig): TurnoInfo => {
  const inicio = parseTime(config.horarioInicio);
  const fim = parseTime(config.horarioFim);
  const almocoInicio = config.almocoInicio ? parseTime(config.almocoInicio) : undefined;
  const almocoFim = config.almocoFim ? parseTime(config.almocoFim) : undefined;

  let duracaoTotal = fim - inicio;

  // Subtrair tempo de almoço
  if (almocoInicio !== undefined && almocoFim !== undefined) {
    duracaoTotal -= almocoFim - almocoInicio;
  }

  return {
    inicio,
    fim,
    almocoInicio,
    almocoFim,
    duracaoTotal,
  };
};

/**
 * Priorizar POPs conforme estratégia
 */
const priorizarPOPs = (
  pops: POP[],
  catalog: Catalog,
  tipo: "sequencial" | "tempo" | "funcao"
): POP[] => {
  if (tipo === "sequencial") {
    return pops;
  }

  const popsComTempo = pops.map((pop) => {
    const funcao = catalog.functions.find((f) => f.id === pop.functionId);
    const activity = funcao?.activities.find((a) => a.id === pop.activityId);
    const steps =
      pop.customSteps && pop.customSteps.length > 0
        ? pop.customSteps
        : activity?.procedure.steps || [];
    const tempo = steps.reduce((sum, step) => sum + (step.time_estimate_min || 0), 0);
    return { pop, tempo };
  });

  if (tipo === "tempo") {
    // Ordenar por tempo (crescente)
    return popsComTempo.sort((a, b) => a.tempo - b.tempo).map((p) => p.pop);
  }

  if (tipo === "funcao") {
    // Agrupar por função
    return pops.sort((a, b) => a.functionId.localeCompare(b.functionId));
  }

  return pops;
};

/**
 * Validar se tempo total cabe no turno
 */
const validarTempoTotal = (atividades: AtividadeComTempo[], turnoInfo: TurnoInfo): void => {
  const tempoTotalAtividades = atividades.reduce((sum, a) => sum + a.tempo, 0);

  if (tempoTotalAtividades > turnoInfo.duracaoTotal) {
    throw new Error(
      `As atividades selecionadas somam ${formatMinutos(tempoTotalAtividades)}, ` +
        `mas o turno tem apenas ${formatMinutos(turnoInfo.duracaoTotal)} disponíveis. ` +
        `Reduza as atividades ou escolha um turno maior.`
    );
  }
};

/**
 * Formatar minutos para string legível
 */
const formatMinutos = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  if (horas > 0 && mins > 0) {
    return `${horas}h${mins}min`;
  } else if (horas > 0) {
    return `${horas}h`;
  } else {
    return `${mins}min`;
  }
};

/**
 * Distribuir atividades no turno
 */
const distribuirAtividades = (
  atividades: AtividadeComTempo[],
  turnoInfo: TurnoInfo,
  config: RotinaConfig
): RotinaHorario[] => {
  if (config.distribuicao === "compacta") {
    return distribuicaoCompacta(atividades, turnoInfo, config);
  } else {
    return distribuicaoEspacada(atividades, turnoInfo, config);
  }
};

/**
 * Distribuição compacta - atividades seguidas com pausas mínimas
 */
const distribuicaoCompacta = (
  atividades: AtividadeComTempo[],
  turnoInfo: TurnoInfo,
  config: RotinaConfig
): RotinaHorario[] => {
  const rotina: RotinaHorario[] = [];
  let currentTime = turnoInfo.inicio;
  let ordem = 1;

  for (const atividade of atividades) {
    // Se estiver no horário de almoço, pular para depois
    if (
      turnoInfo.almocoInicio !== undefined &&
      turnoInfo.almocoFim !== undefined &&
      currentTime >= turnoInfo.almocoInicio &&
      currentTime < turnoInfo.almocoFim
    ) {
      currentTime = turnoInfo.almocoFim;
    }

    // Se atividade ultrapassar almoço, parar antes e retomar depois
    const horarioFim = currentTime + atividade.tempo;
    if (
      turnoInfo.almocoInicio !== undefined &&
      turnoInfo.almocoFim !== undefined &&
      currentTime < turnoInfo.almocoInicio &&
      horarioFim > turnoInfo.almocoInicio
    ) {
      // Reagendar após almoço
      currentTime = turnoInfo.almocoFim;
    }

    const steps =
      atividade.pop.customSteps && atividade.pop.customSteps.length > 0
        ? atividade.pop.customSteps
        : atividade.activity.procedure.steps;

    const detalhamento = steps
      .map((step, idx) => `${idx + 1}. ${step.title}`)
      .join("\n");

    rotina.push({
      id: `rotina-${ordem}`,
      horario_inicio: formatTime(currentTime),
      horario_fim: formatTime(currentTime + atividade.tempo),
      ambiente_atividade: `${atividade.funcao.name} - ${atividade.activity.name}`,
      detalhamento: detalhamento,
      responsavel:
        atividade.pop.nomeColaborador || atividade.pop.responsavelElaboracao || "",
      ordem,
      tipo_horario: 'fixo',
    });

    currentTime += atividade.tempo + config.pausaEntre;
    ordem++;
  }

  return rotina;
};

/**
 * Distribuição espaçada - distribui uniformemente no turno
 */
const distribuicaoEspacada = (
  atividades: AtividadeComTempo[],
  turnoInfo: TurnoInfo,
  config: RotinaConfig
): RotinaHorario[] => {
  const rotina: RotinaHorario[] = [];
  const tempoTotalAtividades = atividades.reduce((sum, a) => sum + a.tempo, 0);
  const tempoDisponivel = turnoInfo.duracaoTotal - tempoTotalAtividades;
  const espacoEntre = Math.max(
    config.pausaEntre,
    Math.floor(tempoDisponivel / Math.max(1, atividades.length - 1))
  );

  let currentTime = turnoInfo.inicio;
  let ordem = 1;

  for (const atividade of atividades) {
    // Se estiver no horário de almoço, pular para depois
    if (
      turnoInfo.almocoInicio !== undefined &&
      turnoInfo.almocoFim !== undefined &&
      currentTime >= turnoInfo.almocoInicio &&
      currentTime < turnoInfo.almocoFim
    ) {
      currentTime = turnoInfo.almocoFim;
    }

    const horarioFim = currentTime + atividade.tempo;
    if (
      turnoInfo.almocoInicio !== undefined &&
      turnoInfo.almocoFim !== undefined &&
      currentTime < turnoInfo.almocoInicio &&
      horarioFim > turnoInfo.almocoInicio
    ) {
      currentTime = turnoInfo.almocoFim;
    }

    const steps =
      atividade.pop.customSteps && atividade.pop.customSteps.length > 0
        ? atividade.pop.customSteps
        : atividade.activity.procedure.steps;

    const detalhamento = steps
      .map((step, idx) => `${idx + 1}. ${step.title}`)
      .join("\n");

    rotina.push({
      id: `rotina-${ordem}`,
      horario_inicio: formatTime(currentTime),
      horario_fim: formatTime(currentTime + atividade.tempo),
      ambiente_atividade: `${atividade.funcao.name} - ${atividade.activity.name}`,
      detalhamento: detalhamento,
      responsavel:
        atividade.pop.nomeColaborador || atividade.pop.responsavelElaboracao || "",
      ordem,
      tipo_horario: 'fixo',
    });

    currentTime += atividade.tempo + espacoEntre;
    ordem++;
  }

  return rotina;
};
