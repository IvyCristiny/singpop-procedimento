export interface POP {
  id: string;
  condominioNome: string;
  tipoPOP: string;
  codigoPOP: string;
  versao: string;
  dataEmissao: string;
  responsavelElaboracao: string;
  aprovadoPor: string;
  createdAt: string;
}

export const tiposPOP = [
  { value: "portaria", label: "Portaria / Controle de Acesso" },
  { value: "limpeza", label: "Limpeza / Conservação" },
  { value: "zeladoria", label: "Zeladoria" },
  { value: "jardinagem", label: "Jardinagem" },
  { value: "manutencao", label: "Manutenção Predial" },
] as const;

export const popTemplates: Record<string, {
  objetivo: string;
  aplicacao: string;
  responsabilidades: string;
  procedimentos: string[];
  equipamentos: string[];
  registros: string[];
}> = {
  portaria: {
    objetivo: "Estabelecer diretrizes para o controle de acesso de pessoas e veículos, garantindo a segurança do condomínio e o registro adequado de todas as movimentações.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários da portaria e controle de acesso do condomínio.",
    responsabilidades: "Porteiro: Executar o controle de acesso conforme estabelecido.\nSupervisor: Garantir o cumprimento do procedimento e treinar os colaboradores.\nSíndico/Administração: Aprovar e revisar o procedimento periodicamente.",
    procedimentos: [
      "Identificar todas as pessoas que desejam entrar no condomínio",
      "Solicitar documento de identificação com foto",
      "Registrar nome, documento, horário de entrada e destino no livro de ocorrências ou sistema digital",
      "Contatar o morador por telefone para autorização de entrada de visitantes",
      "Fornecer crachá de visitante quando aplicável",
      "Registrar saída de visitantes e recolher crachás",
      "Anotar todas as ocorrências relevantes durante o turno",
      "Realizar rondas periódicas conforme escala estabelecida"
    ],
    equipamentos: [
      "Livro de registro de ocorrências ou sistema digital",
      "Telefone/interfone",
      "Crachás de identificação para visitantes",
      "Câmeras de segurança (quando disponíveis)"
    ],
    registros: [
      "Livro de ocorrências diário",
      "Registro de entrada e saída de visitantes",
      "Relatório de passagem de turno"
    ]
  },
  limpeza: {
    objetivo: "Estabelecer rotinas de limpeza e conservação das áreas comuns do condomínio, garantindo higiene, saúde e bem-estar dos moradores e funcionários.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários responsáveis pela limpeza e conservação do condomínio.",
    responsabilidades: "Auxiliar de Limpeza: Executar as tarefas de limpeza conforme programação.\nSupervisor: Verificar a qualidade da limpeza e o cumprimento das rotinas.\nZelador/Síndico: Aprovar o procedimento e disponibilizar recursos necessários.",
    procedimentos: [
      "Verificar a disponibilidade de todos os materiais e equipamentos necessários",
      "Iniciar a limpeza pelas áreas mais altas (tetos, luminárias) seguindo para as mais baixas",
      "Varrer todas as áreas comuns (halls, corredores, escadas)",
      "Limpar pisos com produtos adequados para cada tipo de superfície",
      "Limpar vidros, espelhos e superfícies de inox",
      "Limpar e desinfetar banheiros de uso comum",
      "Retirar lixo de todas as lixeiras e substituir sacos",
      "Organizar materiais e equipamentos após o uso",
      "Reportar ao supervisor qualquer dano ou necessidade de manutenção identificada"
    ],
    equipamentos: [
      "Vassouras, rodos, pás",
      "Baldes, esponjas e panos de limpeza",
      "Produtos de limpeza (multiuso, desinfetante, detergente)",
      "Luvas de proteção e uniformes",
      "Escadas ou equipamento para áreas altas",
      "Aspirador de pó (quando disponível)"
    ],
    registros: [
      "Check-list diário de limpeza",
      "Controle de consumo de materiais",
      "Relatório de ocorrências e necessidades de manutenção"
    ]
  },
  zeladoria: {
    objetivo: "Definir as atividades de zeladoria do condomínio, garantindo o bom funcionamento das instalações e a conservação do patrimônio.",
    aplicacao: "Este procedimento aplica-se ao zelador e demais funcionários envolvidos na manutenção básica do condomínio.",
    responsabilidades: "Zelador: Executar pequenos reparos e manutenções preventivas.\nSupervisor: Coordenar as atividades e priorizar demandas.\nSíndico/Administração: Aprovar manutenções e fornecer recursos necessários.",
    procedimentos: [
      "Realizar inspeção diária das áreas comuns e instalações",
      "Verificar funcionamento de equipamentos (bombas, portões, iluminação)",
      "Executar pequenos reparos (troca de lâmpadas, ajuste de fechaduras, etc.)",
      "Manter limpas e organizadas as áreas técnicas (casa de bombas, depósitos)",
      "Acompanhar prestadores de serviço durante manutenções especializadas",
      "Registrar todas as ocorrências e serviços realizados",
      "Comunicar ao supervisor necessidades de manutenção especializada",
      "Manter estoque básico de materiais para pequenos reparos"
    ],
    equipamentos: [
      "Ferramentas básicas (alicate, chave de fenda, martelo, etc.)",
      "Escada",
      "Lâmpadas de reposição",
      "Materiais elétricos e hidráulicos básicos",
      "EPIs (luvas, óculos de proteção, etc.)"
    ],
    registros: [
      "Livro de manutenções realizadas",
      "Check-list de inspeção diária",
      "Controle de materiais utilizados"
    ]
  },
  jardinagem: {
    objetivo: "Estabelecer rotinas de manutenção e conservação das áreas verdes do condomínio, garantindo um ambiente agradável e saudável.",
    aplicacao: "Este procedimento aplica-se a todos os funcionários responsáveis pela jardinagem do condomínio.",
    responsabilidades: "Jardineiro: Executar os serviços de jardinagem conforme programação.\nSupervisor: Verificar a execução e qualidade dos serviços.\nZelador/Síndico: Aprovar o procedimento e disponibilizar recursos.",
    procedimentos: [
      "Verificar condições climáticas e adequar atividades programadas",
      "Aparar grama regularmente, mantendo altura adequada",
      "Podar plantas, arbustos e cercas vivas conforme necessário",
      "Regar plantas e jardins nos horários adequados",
      "Remover folhas secas, galhos e ervas daninhas",
      "Adubar plantas e jardins conforme cronograma",
      "Realizar controle de pragas quando necessário",
      "Limpar e organizar ferramentas após o uso",
      "Reportar necessidade de replantio ou substituição de plantas"
    ],
    equipamentos: [
      "Cortador de grama",
      "Tesoura de poda e ferramentas de jardinagem",
      "Mangueiras e sistema de irrigação",
      "Rastelos, enxadas e pás",
      "Adubos e produtos para controle de pragas",
      "EPIs (luvas, botas, protetor solar)"
    ],
    registros: [
      "Cronograma mensal de jardinagem",
      "Controle de adubação e tratamentos",
      "Registro de serviços realizados"
    ]
  },
  manutencao: {
    objetivo: "Estabelecer procedimentos para manutenção predial preventiva e corretiva, garantindo o funcionamento adequado das instalações e segurança dos usuários.",
    aplicacao: "Este procedimento aplica-se a todos os profissionais envolvidos na manutenção predial do condomínio.",
    responsabilidades: "Técnico de Manutenção: Executar manutenções conforme programação.\nSupervisor: Coordenar as atividades e priorizar demandas.\nSíndico/Administração: Aprovar procedimento e fornecer recursos necessários.",
    procedimentos: [
      "Realizar inspeções periódicas em todas as instalações prediais",
      "Verificar funcionamento de sistemas elétricos, hidráulicos e de gás",
      "Executar manutenção preventiva conforme cronograma estabelecido",
      "Realizar reparos corretivos em sistemas e equipamentos",
      "Testar sistemas de segurança (alarmes, extintores, iluminação de emergência)",
      "Lubrificar equipamentos e componentes mecânicos",
      "Registrar todas as atividades realizadas",
      "Solicitar serviços especializados quando necessário",
      "Manter estoque de peças e materiais de reposição"
    ],
    equipamentos: [
      "Ferramentas elétricas e manuais",
      "Multímetro e equipamentos de medição",
      "Escadas e andaimes",
      "Materiais elétricos, hidráulicos e de construção",
      "EPIs completos (capacete, luvas, óculos, etc.)"
    ],
    registros: [
      "Cronograma de manutenção preventiva",
      "Relatório de manutenções realizadas",
      "Controle de materiais e peças utilizadas",
      "Registro de chamados e ocorrências"
    ]
  }
};
