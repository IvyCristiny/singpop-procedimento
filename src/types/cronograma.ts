export interface RotinaHorario {
  id: string;
  horario_inicio: string; // "07:00"
  horario_fim: string; // "08:00"
  ambiente_atividade: string;
  detalhamento: string;
  responsavel: string;
  ordem: number;
}

export interface RotinaSemanal {
  id: string;
  dia_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  atividade: string;
  observacoes?: string;
  ordem: number;
}

export interface Cronograma {
  id: string;
  
  // Identificação
  titulo: string;
  condominio_nome: string;
  codigo: string;
  versao: string;
  
  // Dados gerais
  turno: string;
  periodicidade: string;
  responsavel: string;
  supervisao?: string;
  
  // POPs associadas
  pop_ids: string[];
  
  // Rotinas
  rotina_diaria: RotinaHorario[];
  rotina_semanal: RotinaSemanal[];
  
  // Revisão
  responsavel_revisao?: string;
  data_revisao?: string;
  
  observacoes?: string;
  
  created_at: string;
  updated_at: string;
}

export const diasSemana = [
  { value: 'segunda', label: 'Segunda-feira', ordem: 1 },
  { value: 'terca', label: 'Terça-feira', ordem: 2 },
  { value: 'quarta', label: 'Quarta-feira', ordem: 3 },
  { value: 'quinta', label: 'Quinta-feira', ordem: 4 },
  { value: 'sexta', label: 'Sexta-feira', ordem: 5 },
  { value: 'sabado', label: 'Sábado', ordem: 6 },
  { value: 'domingo', label: 'Domingo', ordem: 7 },
] as const;

export const turnosDisponiveis = [
  { value: "07:00-17:00", label: "07h00 às 17h00 (2h de almoço - 11h00 às 13h00)" },
  { value: "08:00-18:00", label: "08h00 às 18h00 (2h de almoço - 12h00 às 14h00)" },
  { value: "06:00-14:00", label: "06h00 às 14h00 (1h de almoço)" },
  { value: "14:00-22:00", label: "14h00 às 22h00 (1h de almoço)" },
  { value: "22:00-06:00", label: "22h00 às 06h00 (noturno)" },
  { value: "custom", label: "Turno personalizado" },
] as const;

export interface RotinaConfig {
  horarioInicio: string;
  horarioFim: string;
  almocoInicio?: string;
  almocoFim?: string;
  pausaEntre: number; // minutos
  priorizacao: 'sequencial' | 'tempo' | 'funcao';
  distribuicao: 'compacta' | 'espacada';
  expandirAtividades?: 'expandir' | 'agrupar';
}
