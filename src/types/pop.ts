import { ProcedureStep } from "./schema";

export interface POP {
  id: string;
  userId?: string;
  condominioNome: string;
  functionId: string;
  activityId: string;
  activityIds?: string[]; // Para múltiplas atividades
  codigoPOP: string;
  versao: string;
  dataRevisao: string;
  responsavelElaboracao: string;
  nomeColaborador: string;
  dataApresentacao: string;
  observacoes?: string;
  customSteps?: ProcedureStep[];
  attachedImages?: string[]; // Imagens em base64
  createdAt: string;
  
  // Manter compatibilidade temporária
  tipoPOP?: string;
}

export interface POPTemplate {
  objetivo: string;
  aplicacao: string;
  responsabilidades: string[];
  procedimentos: {
    [fase: string]: string[];
  };
  equipamentos: string[];
  registros: string[];
  treinamento: string[];
  indicadores: string[];
}

export const tiposPOP = [
  { value: "portaria24h", label: "Portaria 24h (inclui Rondantes)", icon: "ShieldCheck" },
  { value: "ronda", label: "Ronda Noturna 12h", icon: "Eye" },
  { value: "limpeza", label: "ASG / Zeladoria / AOSD", icon: "Sparkles" },
  { value: "vigilancia", label: "Vigilância (Armada e Desarmada)", icon: "Shield" },
  { value: "jardinagem", label: "Jardinagem", icon: "Trees" },
  { value: "piscineiro", label: "Piscineiro", icon: "Waves" },
  { value: "manutencao", label: "Auxiliar de Manutenção", icon: "Wrench" },
  { value: "concierge", label: "Concierge", icon: "UserCheck" },
  { value: "administrador", label: "Administrador Dedicado", icon: "Briefcase" },
] as const;

export const turnosDisponiveis = [
  { value: "24h", label: "24 horas" },
  { value: "12h-diurno", label: "12 horas diurno (06h-18h)" },
  { value: "12h-noturno", label: "12 horas noturno (18h-06h)" },
  { value: "8h-comercial", label: "8 horas comercial" },
  { value: "nao-aplicavel", label: "Não aplicável" },
] as const;

export const popTemplates: Record<string, POPTemplate> = {
  portaria24h: {
    objetivo: "Garantir controle rigoroso de acesso, atendimento cordial e resposta rápida a ocorrências, 24/7.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários da portaria e controle de acesso do condomínio, incluindo rondantes.",
    responsabilidades: [
      "Controle de pedestres e veículos",
      "Monitoramento de áreas e sistemas (CFTV, interfones, alarmes)",
      "Registro e comunicação de ocorrências",
      "Atendimento a moradores e prestadores com postura profissional"
    ],
    procedimentos: {
      "Abertura de turno": [
        "Registrar horário de entrada e revisar ocorrências anteriores",
        "Testar interfone, rádio e câmeras",
        "Conferir lista de visitantes e prestadores esperados",
        "Verificar chaves, crachás e planilhas de controle"
      ],
      "Controle de pedestres": [
        "Cumprimentar e solicitar identificação com documento com foto",
        "Confirmar autorização de entrada antes de liberar acesso",
        "Registrar dados de visitante (nome, documento, horário)",
        "Liberar entrada somente após confirmação com morador ou administração"
      ],
      "Controle de veículos": [
        "Conferir placa e autorização do condutor",
        "Registrar informações de entrada e saída",
        "Orientar sobre estacionamento",
        "Bloquear acesso não autorizado e comunicar supervisão"
      ],
      "Prestadores e obras": [
        "Conferir ordem de serviço, EPI e ferramentas",
        "Registrar dados e liberar com crachá de prestador",
        "Informar zeladoria/síndico sobre início e término",
        "Recolher crachá e verificar saída ao final"
      ],
      "Correspondências e encomendas": [
        "Conferir destinatário e unidade",
        "Registrar recebimento e armazenar com segurança",
        "Notificar destinatário via interfone ou aplicativo",
        "Registrar entrega mediante assinatura"
      ],
      "Ocorrências e emergências": [
        "Manter calma e seguir protocolos de emergência",
        "Registrar data, hora e fato ocorrido",
        "Acionar autoridades ou supervisão conforme necessidade",
        "Jamais abandonar o posto"
      ],
      "Encerramento de turno": [
        "Atualizar registros e entregar turno ao próximo colaborador",
        "Sinalizar pendências à supervisão"
      ]
    },
    equipamentos: [
      "Uniforme e crachá",
      "Rádio comunicador",
      "Livro de ocorrências ou sistema digital",
      "Lanterna e apito (para rondantes)",
      "Telefone/interfone",
      "Computador ou tablet",
      "Crachás de identificação para visitantes"
    ],
    registros: [
      "Livro de ocorrências diário",
      "Registro de entrada e saída de visitantes",
      "Relatório de passagem de turno"
    ],
    treinamento: [
      "Atendimento e comunicação profissional",
      "Controle de acesso e vigilância preventiva",
      "Operação de sistemas CFTV e interfones",
      "Conduta ética e LGPD"
    ],
    indicadores: [
      "Registros completos e pontuais",
      "Cumprimento de rondas e autorizações",
      "Tempo médio de liberação de acesso",
      "Feedback do síndico e moradores"
    ]
  },
  ronda: {
    objetivo: "Executar vigilância preventiva em áreas internas e externas durante o período noturno.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários responsáveis pela ronda noturna do condomínio.",
    responsabilidades: [
      "Realizar rondas regulares conforme roteiro estabelecido",
      "Verificar portões, iluminação e áreas críticas",
      "Registrar ocorrências e comunicar anormalidades"
    ],
    procedimentos: {
      "Início do turno": [
        "Retirar roteiro e equipamentos",
        "Verificar funcionamento de rádios e lanternas"
      ],
      "Ronda": [
        "Cumprir circuito a cada 90-120 minutos",
        "Inspecionar portões, sensores e iluminação",
        "Observar movimentações suspeitas e manter postura atenta",
        "Comunicar irregularidades à portaria ou supervisão"
      ],
      "Finalização": [
        "Consolidar relatório de ronda com pontos verificados e ocorrências",
        "Registrar dados no sistema ou planilha"
      ]
    },
    equipamentos: [
      "Uniforme noturno",
      "Lanterna tática",
      "Rádio comunicador",
      "Check-list ou aplicativo de ronda",
      "EPI (bota e capa de chuva)"
    ],
    registros: [
      "Relatório de ronda",
      "Check-list de pontos verificados",
      "Registro de ocorrências"
    ],
    treinamento: [
      "Segurança patrimonial",
      "Comunicação via rádio",
      "Primeiros socorros e resposta a emergências"
    ],
    indicadores: [
      "Cumprimento do roteiro de ronda",
      "Número de ocorrências detectadas e resolvidas",
      "Tempo médio de resposta"
    ]
  },
  limpeza: {
    objetivo: "Garantir limpeza e conservação das áreas comuns do condomínio.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários responsáveis pela limpeza e conservação do condomínio.",
    responsabilidades: [
      "Executar limpeza diária e periódica conforme cronograma",
      "Manejo correto de produtos químicos e EPIs",
      "Coleta e descarte de resíduos",
      "Comunicação de irregularidades"
    ],
    procedimentos: {
      "Preparação": [
        "Vestir EPIs e verificar diluições corretas dos produtos",
        "Organizar carrinho funcional e definir setores de trabalho"
      ],
      "Rotina diária": [
        "Limpar halls, elevadores, escadas e corredores conforme cronograma",
        "Utilizar produtos adequados para cada tipo de superfície",
        "Higienizar banheiros e repor insumos",
        "Realizar varrição e limpeza de garagem e áreas externas"
      ],
      "Finalização": [
        "Repor materiais de limpeza e guardar equipamentos",
        "Preencher check-list diário e comunicar irregularidades"
      ]
    },
    equipamentos: [
      "Luvas, botas e óculos de proteção",
      "Mop, vassouras, rodos e panos de microfibra",
      "Produtos de limpeza diluídos corretamente",
      "Carrinho funcional"
    ],
    registros: [
      "Check-list diário de limpeza",
      "Controle de consumo de materiais",
      "Relatório de ocorrências e necessidades de manutenção"
    ],
    treinamento: [
      "Técnicas de limpeza profissional",
      "Segurança no uso de produtos químicos",
      "Organização e 5S"
    ],
    indicadores: [
      "Checklists concluídos",
      "Avaliação quinzenal de qualidade",
      "Controle de consumo de materiais"
    ]
  },
  vigilancia: {
    objetivo: "Proteger pessoas e patrimônio do condomínio, atuando de forma preventiva.",
    aplicacao: "Este procedimento aplica-se a todos os vigilantes (armados e desarmados) do condomínio.",
    responsabilidades: [
      "Cumprir instruções de posto",
      "Realizar rondas e manter postura atenta",
      "Registrar e comunicar ocorrências",
      "Acionar forças de segurança quando necessário"
    ],
    procedimentos: {
      "Início do turno": [
        "Assumir posto e revisar informações do plantão anterior",
        "Verificar rádios, alarmes e equipamentos de segurança"
      ],
      "Durante o turno": [
        "Executar rondas estratégicas e observar movimentações suspeitas",
        "Manter presença ostensiva e postura profissional",
        "Acionar protocolo em situações de emergência"
      ],
      "Encerramento": [
        "Registrar ocorrências com hora, fato e providência",
        "Entregar posto com relatório completo"
      ]
    },
    equipamentos: [
      "Uniforme tático",
      "Rádio comunicador",
      "Lanterna",
      "Colete balístico e arma (para vigilantes armados)"
    ],
    registros: [
      "Livro de ocorrências",
      "Relatório de turno",
      "Registro de rondas"
    ],
    treinamento: [
      "Legislação da segurança privada",
      "Procedimentos de emergência",
      "Uso progressivo da força"
    ],
    indicadores: [
      "Tempo médio de resposta a ocorrências",
      "Cumprimento de rondas",
      "Relatórios completos e auditáveis"
    ]
  },
  jardinagem: {
    objetivo: "Manter e preservar as áreas verdes e paisagismo do condomínio.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários responsáveis pela jardinagem do condomínio.",
    responsabilidades: [
      "Realizar podas, irrigação e adubação",
      "Controlar pragas e doenças",
      "Manter equipamentos em bom estado"
    ],
    procedimentos: {
      "Rotina semanal": [
        "Planejar zonas de poda e irrigação",
        "Efetuar corte de grama e recolher aparas",
        "Realizar adubação conforme cronograma",
        "Remover ervas daninhas e resíduos vegetais"
      ],
      "Finalização": [
        "Limpar área trabalhada e guardar ferramentas",
        "Registrar atividades executadas"
      ]
    },
    equipamentos: [
      "Tesouras, roçadeira, soprador, enxada e pá",
      "Luvas, botas e protetor auricular",
      "Adubos e fertilizantes"
    ],
    registros: [
      "Cronograma mensal de jardinagem",
      "Controle de adubação e tratamentos",
      "Registro de serviços realizados"
    ],
    treinamento: [
      "Técnicas de poda e irrigação",
      "Operação segura de equipamentos",
      "Controle de pragas"
    ],
    indicadores: [
      "Condição visual das áreas verdes",
      "Cumprimento de cronograma",
      "Fotos comparativas (antes e depois)"
    ]
  },
  piscineiro: {
    objetivo: "Manter a piscina limpa, tratada e segura para uso.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários responsáveis pela manutenção de piscinas do condomínio.",
    responsabilidades: [
      "Verificar pH e cloro diariamente",
      "Controlar produtos químicos e dosagens",
      "Limpar e aspirar a piscina conforme cronograma"
    ],
    procedimentos: {
      "Diário": [
        "Medir pH e cloro livre e ajustar dosagens",
        "Limpar bordas e peneirar superfície",
        "Aspirar fundo e verificar filtros",
        "Registrar parâmetros e produtos usados"
      ],
      "Semanal": [
        "Realizar backwash e inspeção da bomba",
        "Verificar vazamentos e funcionamento geral"
      ]
    },
    equipamentos: [
      "Kit de teste de pH e cloro",
      "Aspirador, escova e peneira",
      "Produtos químicos (cloro, algicida, clarificante)",
      "EPIs (luvas, máscara, óculos)"
    ],
    registros: [
      "Planilha de parâmetros diários",
      "Controle de produtos químicos",
      "Relatório semanal de manutenção"
    ],
    treinamento: [
      "Balanceamento químico da água",
      "Segurança química",
      "Manutenção do sistema hidráulico"
    ],
    indicadores: [
      "Parâmetros dentro da faixa ideal",
      "Registros diários completos",
      "Zero reclamações por água turva"
    ]
  },
  manutencao: {
    objetivo: "Executar reparos simples e apoiar inspeções de manutenção predial.",
    aplicacao: "Este procedimento aplica-se a todos os profissionais envolvidos na manutenção predial do condomínio.",
    responsabilidades: [
      "Realizar reparos elétricos e hidráulicos de baixa complexidade",
      "Apoiar inspeções preventivas",
      "Reportar falhas e riscos à gestão"
    ],
    procedimentos: {
      "Elétrica": [
        "Desligar circuito e testar ausência de tensão",
        "Substituir lâmpadas e tomadas",
        "Religar e testar funcionamento"
      ],
      "Hidráulica": [
        "Fechar registro e corrigir vazamentos simples",
        "Trocar vedações e sifões"
      ],
      "Preventiva": [
        "Executar checklist semanal de iluminação, bombas e tomadas",
        "Comunicar anomalias e solicitar técnico especializado se necessário"
      ]
    },
    equipamentos: [
      "Ferramentas manuais e elétricas",
      "Multímetro",
      "EPIs (luvas, óculos)",
      "Materiais de reposição (lâmpadas, tomadas, vedações)"
    ],
    registros: [
      "Cronograma de manutenção preventiva",
      "Relatório de manutenções realizadas",
      "Controle de materiais e peças utilizadas"
    ],
    treinamento: [
      "NR-10 básica",
      "Noções de elétrica e hidráulica",
      "Segurança no uso de ferramentas"
    ],
    indicadores: [
      "Taxa de resolução de falhas simples",
      "Checklists 100% preenchidos",
      "Zero acidentes"
    ]
  },
  concierge: {
    objetivo: "Oferecer atendimento personalizado aos moradores e visitantes do condomínio.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários de concierge do condomínio.",
    responsabilidades: [
      "Gerenciar reservas de espaços e atendimento de solicitações",
      "Atender moradores presencialmente e via telefone",
      "Registrar e acompanhar demandas até a resolução"
    ],
    procedimentos: {
      "Atendimento": [
        "Cumprimentar e identificar a solicitação",
        "Registrar no sistema (solicitante, assunto, prazo)",
        "Encaminhar demanda ao setor responsável",
        "Retornar com solução ou status atualizado"
      ],
      "Reservas": [
        "Verificar disponibilidade de espaço",
        "Confirmar e registrar agendamento conforme regras internas"
      ]
    },
    equipamentos: [
      "Computador ou tablet",
      "Telefone ou interfone",
      "Sistema de reservas e atendimento"
    ],
    registros: [
      "Sistema de gestão de solicitações",
      "Agenda de reservas",
      "Relatório de atendimentos"
    ],
    treinamento: [
      "Atendimento e etiqueta corporativa",
      "Comunicação escrita e verbal",
      "Gestão de sistemas condominiais"
    ],
    indicadores: [
      "Tempo médio de atendimento",
      "Satisfação dos moradores",
      "Cumprimento das regras de reservas"
    ]
  },
  administrador: {
    objetivo: "Gerir processos administrativos, financeiros e contratuais do condomínio com eficiência e transparência.",
    aplicacao: "Este procedimento aplica-se ao administrador dedicado do condomínio.",
    responsabilidades: [
      "Elaborar relatórios mensais e controlar orçamento",
      "Supervisionar fornecedores e contratos",
      "Atuar como elo entre síndico e empresa"
    ],
    procedimentos: {
      "Ciclo mensal": [
        "Consolidar receitas e despesas",
        "Atualizar previsão orçamentária e fluxo de caixa",
        "Emitir relatório financeiro e prestação de contas",
        "Revisar contratos e fornecedores",
        "Preparar pauta de assembleias e comunicações"
      ]
    },
    equipamentos: [
      "Computador e acesso a sistema administrativo",
      "Planilhas e documentos fiscais",
      "Repositório de arquivos digitais"
    ],
    registros: [
      "Relatórios financeiros mensais",
      "Atas de reuniões",
      "Controle de contratos"
    ],
    treinamento: [
      "Gestão financeira condominial",
      "Legislação e compliance",
      "Comunicação executiva"
    ],
    indicadores: [
      "Aderência ao orçamento",
      "Pontualidade na prestação de contas",
      "Feedback do síndico e da diretoria"
    ]
  }
};
