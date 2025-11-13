import { Catalog } from "@/types/schema";

export const catalog: Catalog = {
  functions: [
    {
      id: "PORT",
      name: "Portaria / Controle de Acesso",
      description: "Controle de acesso, vigilância e atendimento em portarias.",
      icon: "ShieldCheck",
      tags: ["segurança", "acesso", "portaria"],
      activities: [
        {
          id: "PORT_PED",
          name: "Controle de acesso de pedestres",
          objective: "Garantir o controle seguro e cordial da entrada e saída de pedestres, com registro completo e bloqueio de acessos não autorizados.",
          scope: "Portaria principal e secundárias, 24/7.",
          prerequisites: ["Sistema de cadastro ativo", "Lista de autorizados atualizada"],
          responsibilities: [
            "Identificar e registrar visitantes, prestadores e moradores",
            "Autorizar acesso só após confirmação com morador/administração",
            "Manter conduta profissional e vigilância constante"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Acolhimento e triagem",
                instruction: "Cumprimente e solicite documento com foto. Verifique se a pessoa é morador, visitante ou prestador.",
                why: "Definir o fluxo correto e reduzir riscos.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Mantenha distância segura e atenção ao entorno.",
                quality_check: "Registro do tipo de visitante no sistema.",
                evidence: "Linha criada no log com tipo e horário"
              },
              {
                id: "S2",
                title: "Validação de autorização",
                instruction: "Confirme com morador/responsável via interfone/app. Para prestadores, valide OS e período.",
                why: "Evitar acesso indevido.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Negar com cordialidade se não autorizado.",
                quality_check: "Campo 'autorizador' preenchido.",
                evidence: "Registro do autorizador (nome/unidade)"
              },
              {
                id: "S3",
                title: "Cadastro e crachá",
                instruction: "Registre nome, documento, unidade, horário. Entregue crachá e informe regras básicas.",
                why: "Rastreabilidade e disciplina.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Evitar aglomeração na portaria.",
                quality_check: "Crachá vinculado ao registro.",
                evidence: "Número do crachá associado no sistema"
              },
              {
                id: "S4",
                title: "Liberação de acesso",
                instruction: "Abra a porta/catraca somente após confirmação e cadastro. Oriente o trajeto autorizado.",
                why: "Fluxo seguro e organizado.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Nunca libere sem confirmação.",
                quality_check: "Log de 'acesso liberado' gerado.",
                evidence: "Timestamp de liberação"
              },
              {
                id: "S5",
                title: "Baixa de saída",
                instruction: "Na saída, recolha o crachá e registre o horário.",
                why: "Fechar o ciclo e manter dados corretos.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Atenção a devolução do crachá.",
                quality_check: "Entrada/saída casadas no sistema.",
                evidence: "Log de saída com mesmo ID"
              }
            ]
          },
          equipment: {
            epc: ["Balcão organizado", "Sinalização de fila"],
            epi: [],
            tools: ["Computador/tablet com sistema", "Telefone/Interfone"],
            consumables: ["Crachás de visitante", "Formulários (se papel)"]
          },
          training: {
            modules: [
              "Atendimento e comunicação profissional",
              "Controle de acesso e conduta ética",
              "Uso do sistema de registro"
            ],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Zero incidentes de acesso indevido",
              "% registros com entrada/saída casadas",
              "Tempo médio de liberação (min)"
            ],
            audit_frequency_days: 7,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "PORT_VEIC",
          name: "Controle de Acesso de Veículos",
          objective: "Definir o procedimento para entrada, permanência e saída de veículos, garantindo controle, segurança e rastreabilidade de todas as movimentações.",
          scope: "Aplica-se às portarias e áreas de controle de acesso do Residencial Praça da Luz que realizam o monitoramento de veículos.",
          prerequisites: ["Sistema de controle de veículos ativo", "Equipamentos de controle funcionando"],
          responsibilities: [
            "Porteiro: Controlar acessos conforme cadastro e autorização prévia",
            "Supervisor: Garantir o funcionamento dos equipamentos de controle e acompanhar o cumprimento dos registros"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Identificar condutor",
                instruction: "Identificar o condutor e confirmar autorização de acesso.",
                why: "Garantir que apenas veículos autorizados tenham acesso.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Manter visibilidade do veículo e postura segura.",
                quality_check: "Autorização confirmada antes de prosseguir.",
                evidence: "Registro de confirmação"
              },
              {
                id: "S2",
                title: "Conferir placa e destino",
                instruction: "Conferir placa, destino e horário previsto de permanência.",
                why: "Rastreabilidade completa das movimentações.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Posicionar-se em local seguro durante conferência.",
                quality_check: "Dados de placa, destino e horário registrados.",
                evidence: "Linha no sistema com placa, destino e timestamp"
              },
              {
                id: "S3",
                title: "Registrar dados",
                instruction: "Registrar dados no sistema ou planilha de controle.",
                why: "Manter histórico e rastreabilidade.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Campos obrigatórios preenchidos corretamente.",
                evidence: "Registro completo no sistema"
              },
              {
                id: "S4",
                title: "Abrir portão",
                instruction: "Abrir o portão apenas após confirmação da autorização.",
                why: "Evitar acesso não autorizado.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Sinalizar abertura do portão para segurança.",
                quality_check: "Portão aberto somente após autorização confirmada.",
                evidence: "Log de abertura do portão"
              },
              {
                id: "S5",
                title: "Fechar portão",
                instruction: "Garantir que o portão esteja totalmente fechado antes de liberar o próximo veículo.",
                why: "Segurança e controle de acesso.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Evitar abertura simultânea de portões.",
                quality_check: "Portão completamente fechado.",
                evidence: "Log de fechamento do portão"
              },
              {
                id: "S6",
                title: "Comunicar supervisão em dúvida",
                instruction: "Em caso de dúvida ou divergência, comunicar imediatamente a supervisão.",
                why: "Resolver situações atípicas com segurança.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Não liberar acesso em caso de dúvida.",
                quality_check: "Supervisão comunicada e orientação recebida.",
                evidence: "Registro de comunicação"
              }
            ]
          },
          equipment: {
            epc: ["Cancela automática", "Câmeras de segurança"],
            epi: [],
            tools: ["Rádio comunicador", "Sistema de controle de veículos", "Planilha de controle"],
            consumables: ["Etiquetas/crachás de estacionamento"]
          },
          training: {
            modules: ["Procedimentos de acesso veicular", "Comunicação e mediação", "Uso do sistema de controle"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Registros sem falha", "Tempo de resposta", "Zero veículos não autorizados"],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "02",
            last_review_date: "2025-10-27",
            changelog: ["Atualização com POP 02 - Controle de Acesso de Veículos"]
          }
        },
        {
          id: "PORT_CORRESP",
          name: "Recebimento de Correspondências e Encomendas",
          objective: "Garantir o correto recebimento, conferência, registro, armazenamento e entrega de correspondências e encomendas, evitando extravios e falhas no processo.",
          scope: "Aplica-se a todas as portarias e áreas responsáveis pelo recebimento e controle de entregas do Residencial Praça da Luz.",
          prerequisites: ["Local de armazenamento seguro e identificado", "Sistema de registro ativo"],
          responsibilities: [
            "Porteiro: Receber, conferir e armazenar os itens com segurança",
            "Supervisor: Verificar as condições de armazenamento e garantir o cumprimento dos registros"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Receber entregas identificadas",
                instruction: "Receber entregas apenas de entregadores devidamente identificados.",
                why: "Garantir segurança e evitar fraudes.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Verificar identificação do entregador.",
                quality_check: "Entregador identificado.",
                evidence: "Registro de identificação do entregador"
              },
              {
                id: "S2",
                title: "Conferir destinatário",
                instruction: "Conferir o nome e unidade do destinatário antes de aceitar o recebimento.",
                why: "Evitar recebimento de itens destinados a terceiros não identificados.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Verificar embalagem íntegra.",
                quality_check: "Nome e unidade conferidos e corretos.",
                evidence: "Dados do destinatário registrados"
              },
              {
                id: "S3",
                title: "Registrar recebimento",
                instruction: "Registrar data, hora, nome do entregador e destinatário.",
                why: "Rastreabilidade completa do processo.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Manter organização dos registros.",
                quality_check: "Registro completo no livro ou planilha.",
                evidence: "Linha no log de correspondências com todos os dados"
              },
              {
                id: "S4",
                title: "Armazenar com segurança",
                instruction: "Armazenar os itens em local seguro e identificado.",
                why: "Proteção contra extravios e danos.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Local limpo, organizado e de acesso restrito.",
                quality_check: "Item armazenado e identificado corretamente.",
                evidence: "Localização do item registrada"
              },
              {
                id: "S5",
                title: "Comunicar destinatário",
                instruction: "Comunicar o destinatário sobre a chegada da correspondência/encomenda.",
                why: "Agilizar a retirada e liberar espaço.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Destinatário notificado.",
                evidence: "Registro de notificação"
              },
              {
                id: "S6",
                title: "Entregar com assinatura",
                instruction: "Solicitar assinatura de retirada do destinatário mediante identificação.",
                why: "Confirmação de recebimento e encerramento do processo.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Validar identidade do recebedor.",
                quality_check: "Assinatura registrada.",
                evidence: "Protocolo de entrega assinado"
              }
            ]
          },
          equipment: {
            epc: ["Armário/estante identificado para armazenamento"],
            epi: [],
            tools: ["Sistema de registro", "Livro ou planilha de controle"],
            consumables: ["Formulários de retirada/protocolo"]
          },
          training: {
            modules: ["Recebimento seguro de entregas", "Organização e registro de correspondências", "Atendimento ao morador"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Zero divergências de entrega", "Zero extravios", "Tempo médio de notificação (horas)"],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "02",
            last_review_date: "2025-10-27",
            changelog: ["Atualização com POP 03 - Recebimento de Correspondências e Encomendas"]
          }
        },
        {
          id: "PORT_ROND",
          name: "Ronda diurna preventiva",
          objective: "Executar vigilância preventiva em áreas internas e externas durante o período diurno.",
          scope: "Todas as áreas comuns do condomínio.",
          responsibilities: [
            "Realizar rondas regulares conforme roteiro",
            "Verificar portões, iluminação e áreas críticas",
            "Registrar ocorrências e comunicar anormalidades"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Preparação",
                instruction: "Retirar roteiro e equipamentos (rádio, lanterna).",
                why: "Garantir que todo o equipamento está funcionando.",
                who: "Porteiro/Rondante",
                time_estimate_min: 2,
                safety: "Verificar funcionamento de rádios e lanternas.",
                quality_check: "Equipamentos funcionais.",
                evidence: "Checklist de equipamentos"
              },
              {
                id: "S2",
                title: "Execução da ronda",
                instruction: "Cumprir circuito a cada 90-120 minutos, inspecionar portões, sensores e iluminação.",
                why: "Prevenir incidentes e identificar anormalidades.",
                who: "Porteiro/Rondante",
                time_estimate_min: 20,
                safety: "Observar movimentações suspeitas.",
                quality_check: "Todos os pontos verificados.",
                evidence: "Registro de cada ponto visitado"
              },
              {
                id: "S3",
                title: "Registro",
                instruction: "Consolidar relatório de ronda com pontos verificados e ocorrências.",
                why: "Documentar e informar supervisão.",
                who: "Porteiro/Rondante",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Relatório completo.",
                evidence: "Relatório de ronda assinado"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Bota"],
            tools: ["Lanterna tática", "Rádio comunicador", "Check-list ou aplicativo de ronda"],
            consumables: []
          },
          training: {
            modules: [
              "Segurança patrimonial",
              "Comunicação via rádio",
              "Primeiros socorros e resposta a emergências"
            ],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Cumprimento do roteiro de ronda",
              "Número de ocorrências detectadas",
              "Tempo médio de resposta"
            ],
            audit_frequency_days: 7,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "PORT_ATEND",
          name: "Atendimento e Postura Profissional",
          objective: "Padronizar a conduta, apresentação pessoal e comunicação dos colaboradores da portaria, assegurando atendimento cordial, empático e imagem institucional positiva.",
          scope: "Aplica-se a todos os colaboradores que atuam na recepção, portaria e controle de acesso do Residencial Praça da Luz.",
          prerequisites: ["Uniforme completo e limpo", "Identificação funcional"],
          responsibilities: [
            "Porteiro: Cumprir as normas de conduta e apresentação",
            "Supervisor: Avaliar periodicamente o comportamento e postura dos colaboradores"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Apresentação pessoal",
                instruction: "Apresentar-se uniformizado, identificado e com boa higiene pessoal.",
                why: "Transmitir profissionalismo e credibilidade.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "N/A",
                quality_check: "Uniforme completo, limpo e crachá visível.",
                evidence: "Inspeção visual diária"
              },
              {
                id: "S2",
                title: "Postura e linguagem",
                instruction: "Manter postura ereta, linguagem formal e tom de voz adequado.",
                why: "Demonstrar respeito e seriedade no atendimento.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "N/A",
                quality_check: "Comunicação clara e respeitosa.",
                evidence: "Avaliação comportamental"
              },
              {
                id: "S3",
                title: "Cumprimentar moradores e visitantes",
                instruction: "Cumprimentar todos os moradores e visitantes de forma cordial.",
                why: "Criar ambiente acolhedor e profissional.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "N/A",
                quality_check: "Todos são cumprimentados adequadamente.",
                evidence: "Feedback dos moradores"
              },
              {
                id: "S4",
                title: "Evitar distrações",
                instruction: "Evitar conversas paralelas e uso de celular durante o expediente.",
                why: "Manter foco e prontidão para atendimento.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "N/A",
                quality_check: "Colaborador atento e disponível.",
                evidence: "Observação da supervisão"
              },
              {
                id: "S5",
                title: "Respeito e sigilo",
                instruction: "Tratar todos com respeito e manter sigilo sobre informações internas.",
                why: "Preservar privacidade e confiança dos moradores.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "N/A",
                quality_check: "Nenhuma reclamação sobre vazamento de informações.",
                evidence: "Ausência de ocorrências"
              },
              {
                id: "S6",
                title: "Comunicar conflitos",
                instruction: "Comunicar imediatamente à supervisão qualquer situação de conflito ou comportamento suspeito.",
                why: "Resolver situações delicadas com respaldo da liderança.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Não confrontar diretamente em situações de risco.",
                quality_check: "Supervisão notificada em tempo hábil.",
                evidence: "Registro de comunicação"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Uniforme completo", "Crachá de identificação"],
            consumables: []
          },
          training: {
            modules: [
              "Atendimento ao cliente e comunicação assertiva",
              "Ética profissional e conduta no trabalho",
              "Resolução de conflitos"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Zero reclamações sobre atendimento",
              "% de conformidade com normas de apresentação",
              "Índice de satisfação dos moradores"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Criação baseada no POP 04 - Atendimento e Postura Profissional"]
          }
        },
        {
          id: "PORT_EMERG",
          name: "Ocorrências e Situações de Emergência",
          objective: "Definir os procedimentos a serem adotados em casos de incidentes, emergências e situações atípicas, garantindo resposta rápida, segura e coordenada.",
          scope: "Aplica-se a todos os postos de portaria e controle de acesso sob responsabilidade da Singular Serviços no Residencial Praça da Luz.",
          prerequisites: ["Rotas de fuga conhecidas", "Contatos de emergência atualizados", "Pontos de encontro definidos"],
          responsibilities: [
            "Porteiro: Agir conforme o protocolo, manter a calma e comunicar imediatamente a supervisão",
            "Supervisor: Coordenar o atendimento e registrar todas as providências adotadas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Identificar tipo de ocorrência",
                instruction: "Identificar o tipo de ocorrência (acidente, incêndio, invasão, falha elétrica etc.).",
                why: "Definir o protocolo correto de resposta.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Avaliar risco pessoal antes de agir.",
                quality_check: "Tipo de ocorrência identificado corretamente.",
                evidence: "Registro inicial da ocorrência"
              },
              {
                id: "S2",
                title: "Manter calma e segurança",
                instruction: "Manter a calma e garantir a segurança de todos os envolvidos.",
                why: "Evitar pânico e decisões precipitadas.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Priorizar vidas humanas.",
                quality_check: "Pessoas em local seguro.",
                evidence: "Relato de ações tomadas"
              },
              {
                id: "S3",
                title: "Comunicar supervisão/síndico",
                instruction: "Comunicar imediatamente a supervisão e/ou o síndico.",
                why: "Acionar cadeia de comando e suporte.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Usar meios de comunicação disponíveis (rádio, telefone).",
                quality_check: "Supervisão/síndico comunicados.",
                evidence: "Registro de comunicação"
              },
              {
                id: "S4",
                title: "Acionar órgãos competentes",
                instruction: "Acionar os órgãos competentes (bombeiros, polícia, SAMU) conforme a gravidade.",
                why: "Garantir resposta especializada.",
                who: "Porteiro",
                time_estimate_min: 3,
                safety: "Informar localização exata e natureza da emergência.",
                quality_check: "Órgãos acionados conforme necessidade.",
                evidence: "Registro de chamados realizados"
              },
              {
                id: "S5",
                title: "Registrar o fato",
                instruction: "Registrar o fato com data, hora, descrição e nomes dos envolvidos.",
                why: "Documentar para análise e auditoria.",
                who: "Porteiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Registro completo e detalhado.",
                evidence: "Relatório de incidente"
              },
              {
                id: "S6",
                title: "Acompanhar desdobramento",
                instruction: "Acompanhar o desdobramento da ocorrência até o encerramento.",
                why: "Garantir que todas as providências foram tomadas.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "N/A",
                quality_check: "Ocorrência encerrada formalmente.",
                evidence: "Relatório de encerramento"
              }
            ]
          },
          equipment: {
            epc: ["Rotas de fuga sinalizadas", "Pontos de encontro identificados"],
            epi: [],
            tools: ["Rádio comunicador", "Telefone", "Lista de contatos de emergência", "Livro de ocorrências"],
            consumables: []
          },
          training: {
            modules: [
              "Primeiros socorros básicos",
              "Combate a princípios de incêndio",
              "Procedimentos de evacuação",
              "Comunicação em situações de crise"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Tempo de resposta inicial (minutos)",
              "% de ocorrências registradas corretamente",
              "Efetividade das ações tomadas"
            ],
            audit_frequency_days: 7,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Criação baseada no POP 05 - Ocorrências e Situações de Emergência"]
          }
        },
        {
          id: "PORT_LIVRO_OCOR",
          name: "Registro de Ocorrências no Livro",
          objective: "Padronizar o registro de todos os eventos relevantes no livro de ocorrências, garantindo rastreabilidade, documentação completa e histórico confiável para auditorias.",
          scope: "Todos os postos de portaria que devem manter livro de ocorrências, 24/7. O livro deve ser armazenado na sala de segurança e arquivado por 5 anos após preenchimento completo.",
          prerequisites: [
            "Livro de ocorrências identificado e disponível",
            "Caneta permanente em boas condições",
            "Conhecimento dos tipos de ocorrências registráveis"
          ],
          responsibilities: [
            "Porteiro em serviço: Preencher o livro sempre que houver evento relevante",
            "Supervisor: Revisar registros semanalmente e arquivar livros completos",
            "Zelar pela legibilidade, veracidade e completude dos registros"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Identificar tipo de ocorrência",
                instruction: "Determine se o evento é registrável: incidente, manutenção, falha de equipamento, situação anormal, solicitação especial ou observação importante.",
                why: "Filtrar eventos relevantes e evitar registros desnecessários.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Evento é relevante para o histórico operacional.",
                evidence: "Decisão documentada"
              },
              {
                id: "S2",
                title: "Registrar data e horário exatos",
                instruction: "Escrever data (DD/MM/AAAA) e horário (HH:MM) no formato padrão, no início da linha.",
                why: "Precisão temporal para investigações e relatórios.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "N/A",
                quality_check: "Data e horário legíveis e corretos.",
                evidence: "Timestamp registrado"
              },
              {
                id: "S3",
                title: "Descrever a ocorrência detalhadamente",
                instruction: "Detalhar o evento: quem, o quê, onde, quando, como. Usar linguagem clara e objetiva. Incluir nomes, unidades e informações específicas.",
                why: "Documentação precisa permite análise posterior e tomada de decisão.",
                who: "Porteiro",
                time_estimate_min: 3,
                safety: "N/A",
                quality_check: "Descrição completa e compreensível por terceiros.",
                evidence: "Texto com todas as informações essenciais"
              },
              {
                id: "S4",
                title: "Registrar medidas tomadas",
                instruction: "Descrever todas as ações realizadas em resposta à ocorrência: acionamento de supervisão, contato com terceiros, orientações dadas, etc.",
                why: "Demonstrar resposta adequada e permitir avaliação de eficácia.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Ações registradas de forma cronológica e clara.",
                evidence: "Lista de medidas adotadas"
              },
              {
                id: "S5",
                title: "Identificar e assinar",
                instruction: "Registrar nome completo, matrícula (se aplicável) e assinar de forma legível. Caso outro colaborador tenha participado, incluir sua identificação.",
                why: "Responsabilização e rastreabilidade do registro.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "N/A",
                quality_check: "Assinatura e identificação presentes e legíveis.",
                evidence: "Nome e assinatura do responsável"
              },
              {
                id: "S6",
                title: "Comunicar supervisor (se necessário)",
                instruction: "Para ocorrências graves ou que exijam providências urgentes, comunicar imediatamente o supervisor após o registro.",
                why: "Garantir resposta rápida e adequada a situações críticas.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Supervisor informado em tempo hábil.",
                evidence: "Confirmação de comunicação"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Livro de ocorrências", "Caneta permanente"],
            consumables: []
          },
          training: {
            modules: [
              "Tipos de ocorrências registráveis",
              "Técnicas de redação objetiva",
              "Aspectos legais do registro",
              "Organização e arquivamento"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Completude dos registros (% com todas as informações)",
              "Tempo médio de registro",
              "Legibilidade avaliada pelo supervisor",
              "Número de registros por plantão"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Livro de Ocorrências"]
          },
          attachments: {
            templates: ["Modelo de registro padrão"],
            photos: []
          }
        },
        {
          id: "PORT_APP_CTRL",
          name: "Uso do Aplicativo de Controle de Acesso",
          objective: "Padronizar o uso do aplicativo de controle de acesso (ex: Severino ou similar) para cadastro, monitoramento e registro de pessoas e veículos, garantindo precisão e conformidade.",
          scope: "Todas as portarias equipadas com sistema digital de controle de acesso.",
          prerequisites: [
            "Aplicativo instalado e configurado",
            "Login e senha ativos",
            "Conexão à internet estável",
            "Dispositivo (tablet/smartphone) carregado"
          ],
          responsibilities: [
            "Porteiro: Operar o aplicativo corretamente e manter registros atualizados",
            "Supervisor: Garantir treinamento, resolver problemas técnicos e auditar registros",
            "Suporte TI: Manter sistema funcionando e prestar suporte técnico"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Login no aplicativo",
                instruction: "Abrir o aplicativo, inserir usuário e senha, e confirmar acesso ao sistema. Verificar se o perfil está correto (portaria específica).",
                why: "Garantir rastreabilidade e acesso aos dados corretos.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Não compartilhar senha com terceiros.",
                quality_check: "Login bem-sucedido e perfil correto.",
                evidence: "Log de acesso ao sistema"
              },
              {
                id: "S2",
                title: "Cadastrar visitante/prestador",
                instruction: "Acessar aba 'Visitantes' ou 'Prestadores', preencher nome completo, tipo e número do documento, empresa (se aplicável), unidade de destino.",
                why: "Criar registro completo e rastreável.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Todos os campos obrigatórios preenchidos.",
                evidence: "Cadastro salvo no sistema"
              },
              {
                id: "S3",
                title: "Fotografar documento",
                instruction: "Utilizar câmera do aplicativo para capturar foto nítida do documento de identificação (frente e verso, se necessário). Verificar legibilidade antes de salvar.",
                why: "Comprovar identidade e criar evidência documental.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Respeitar privacidade do documento.",
                quality_check: "Foto legível e associada ao cadastro.",
                evidence: "Imagem do documento armazenada"
              },
              {
                id: "S4",
                title: "Registrar horários de entrada e saída",
                instruction: "Na entrada, registrar horário automaticamente ou manualmente (conforme sistema). Na saída, localizar o cadastro e registrar horário de saída.",
                why: "Controlar permanência e fechar ciclo de acesso.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Entrada e saída registradas corretamente.",
                evidence: "Timestamps de entrada e saída"
              },
              {
                id: "S5",
                title: "Conferir autorização no sistema",
                instruction: "Antes de liberar o acesso, verificar se há autorização registrada no sistema (nome do autorizador, unidade, validade). Não liberar sem confirmação.",
                why: "Evitar acessos não autorizados e garantir segurança.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Em caso de dúvida, negar acesso e consultar supervisor.",
                quality_check: "Autorização confirmada antes da liberação.",
                evidence: "Campo 'autorização' validado no sistema"
              },
              {
                id: "S6",
                title: "Solucionar problemas comuns",
                instruction: "Em caso de falha de internet: usar registro manual e atualizar sistema após retorno. Erro no login: verificar senha, reiniciar app ou acionar suporte. Sistema lento: aguardar ou reiniciar dispositivo.",
                why: "Manter operação contínua mesmo com imprevistos técnicos.",
                who: "Porteiro",
                time_estimate_min: 5,
                safety: "Sempre ter backup manual (papel) para registros críticos.",
                quality_check: "Problema solucionado ou escalado para suporte.",
                evidence: "Registro de problema e solução aplicada"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Tablet/Smartphone com aplicativo", "Conexão à internet", "Backup de papel (contingência)"],
            consumables: []
          },
          training: {
            modules: [
              "Navegação no aplicativo",
              "Cadastro de visitantes e prestadores",
              "Resolução de problemas técnicos básicos",
              "Política de privacidade e LGPD"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Taxa de cadastros completos (% com todos os campos)",
              "Tempo médio de cadastro",
              "Número de incidentes técnicos por mês",
              "Aderência ao uso do sistema (vs. registro manual)"
            ],
            audit_frequency_days: 15,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Aplicativo de Controle de Acesso"]
          },
          attachments: {
            templates: ["Guia rápido do aplicativo", "FAQ de problemas comuns"],
            photos: []
          }
        },
        {
          id: "PORT_ECLUSA",
          name: "Operação de Eclusa de Pedestres",
          objective: "Garantir segurança máxima no acesso de pedestres através de eclusa, controlando o fluxo, evitando invasões e permitindo inspeção adequada em ambiente isolado.",
          scope: "Portarias equipadas com sistema de eclusa (dupla porta com travamento sequencial).",
          prerequisites: [
            "Eclusa em funcionamento correto",
            "Sistema de travamento das portas operacional",
            "Câmeras de monitoramento ativas",
            "Protocolo de emergência conhecido"
          ],
          responsibilities: [
            "Porteiro: Operar a eclusa conforme procedimento, verificar identidade e autorizar acessos",
            "Supervisor: Garantir manutenção do sistema e resposta a emergências",
            "Manutenção: Realizar verificações periódicas e reparos"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Verificar identificação do pedestre",
                instruction: "Solicitar documento com foto através do interfone ou visor. Confirmar identidade visual comparando documento com a pessoa.",
                why: "Garantir que apenas pessoas identificadas acessem a eclusa.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Manter portas fechadas até confirmação de identidade.",
                quality_check: "Documento verificado e identidade confirmada.",
                evidence: "Registro de identificação no sistema"
              },
              {
                id: "S2",
                title: "Confirmar autorização de acesso",
                instruction: "Consultar sistema, lista de autorizados ou contatar responsável para confirmar permissão de entrada. Verificar horário permitido e restrições.",
                why: "Evitar acesso não autorizado e garantir conformidade.",
                who: "Porteiro",
                time_estimate_min: 1.5,
                safety: "Em caso de dúvida, negar acesso e consultar supervisor.",
                quality_check: "Autorização confirmada no sistema.",
                evidence: "Campo de autorização validado"
              },
              {
                id: "S3",
                title: "Liberar primeira porta",
                instruction: "Acionar controle para abrir a primeira porta (externa). Aguardar o pedestre entrar completamente na eclusa. Monitorar através das câmeras.",
                why: "Permitir entrada controlada em ambiente isolado.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Verificar que apenas uma pessoa entra por vez.",
                quality_check: "Pedestre dentro da eclusa.",
                evidence: "Log de abertura da porta 1"
              },
              {
                id: "S4",
                title: "Fechar primeira porta",
                instruction: "Após o pedestre entrar completamente, acionar fechamento da primeira porta. Aguardar travamento total (luz indicadora ou sinal sonoro).",
                why: "Isolar a eclusa antes de liberar acesso interno.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Nunca abrir segunda porta antes do fechamento completo da primeira.",
                quality_check: "Porta 1 completamente fechada e travada.",
                evidence: "Confirmação de travamento da porta 1"
              },
              {
                id: "S5",
                title: "Liberar segunda porta",
                instruction: "Somente após confirmação de travamento da primeira porta, acionar abertura da segunda porta (interna). Orientar o pedestre sobre trajeto permitido.",
                why: "Completar acesso seguro mantendo controle do fluxo.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Garantir que apenas o pedestre autorizado saia da eclusa.",
                quality_check: "Segunda porta aberta somente após primeira travada.",
                evidence: "Log de abertura da porta 2"
              },
              {
                id: "S6",
                title: "Acionar protocolo de emergência",
                instruction: "Em caso de tentativa de invasão, comportamento suspeito ou emergência médica: travar ambas as portas, acionar alarme, comunicar supervisor e seguir protocolo de emergência específico.",
                why: "Garantir segurança máxima e resposta adequada a situações críticas.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Manter calma e seguir protocolo. Não abrir portas em situação de risco.",
                quality_check: "Protocolo acionado e supervisor informado.",
                evidence: "Registro de ocorrência e ações tomadas"
              }
            ]
          },
          equipment: {
            epc: ["Eclusa com duplo travamento", "Câmeras de monitoramento", "Interfone", "Alarme de emergência"],
            epi: [],
            tools: ["Painel de controle da eclusa", "Rádio comunicador"],
            consumables: []
          },
          training: {
            modules: [
              "Funcionamento da eclusa",
              "Protocolos de segurança",
              "Resposta a emergências",
              "Identificação de comportamentos suspeitos"
            ],
            refresh_cadence_days: 90
          },
          review: {
            kpis: [
              "Número de acessos por eclusa/dia",
              "Tempo médio de processamento por pedestre",
              "Incidentes de segurança registrados",
              "Taxa de conformidade no uso do protocolo"
            ],
            audit_frequency_days: 15,
            auditor_role: "Supervisor de Segurança"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Eclusa de Pedestres"]
          },
          attachments: {
            templates: ["Diagrama de funcionamento da eclusa", "Protocolo de emergência"],
            photos: []
          }
        },
        {
          id: "PORT_PORTOES",
          name: "Inspeção e Operação de Portões",
          objective: "Assegurar o funcionamento adequado de portões de veículos e pedestres através de inspeção diária, operação segura e reporte imediato de anomalias, garantindo acesso controlado e seguro.",
          scope: "Todos os portões de acesso (veículos e pedestres) sob responsabilidade da portaria.",
          prerequisites: [
            "Portões em condições operacionais",
            "Acesso aos controles e comandos",
            "Conhecimento dos pontos de inspeção",
            "Contato do responsável pela manutenção"
          ],
          responsibilities: [
            "Porteiro: Realizar inspeção diária, operar portões com segurança e reportar problemas",
            "Supervisor: Acompanhar relatórios e acionar manutenção quando necessário",
            "Manutenção: Realizar reparos e manutenção preventiva"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Inspeção visual diária",
                instruction: "No início do turno, verificar visualmente: alinhamento das portas, estado das dobradiças, ausência de obstruções, integridade de trancas e fechaduras, luzes indicadoras funcionando.",
                why: "Detectar problemas antes que causem falhas ou acidentes.",
                who: "Porteiro",
                time_estimate_min: 3,
                safety: "Não tocar em partes móveis ou elétricas sem autorização.",
                quality_check: "Checklist visual completo.",
                evidence: "Registro de inspeção no livro de ocorrências"
              },
              {
                id: "S2",
                title: "Teste de abertura e fechamento",
                instruction: "Testar abertura e fechamento completos dos portões (manual ou automático). Verificar ruídos anormais, travamentos, velocidade adequada e parada correta.",
                why: "Garantir funcionamento seguro e evitar falhas durante operação.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Manter distância segura durante teste. Usar comandos adequados.",
                quality_check: "Portões abrem e fecham completamente sem problemas.",
                evidence: "Log de teste operacional"
              },
              {
                id: "S3",
                title: "Verificar sensores e travas",
                instruction: "Para portões automáticos, verificar funcionamento dos sensores de presença, fotocélulas e travas de segurança. Testar parada de emergência.",
                why: "Sensores e travas previnem acidentes e danos.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Nunca desabilitar sensores ou travas de segurança.",
                quality_check: "Todos os dispositivos de segurança operacionais.",
                evidence: "Confirmação de teste dos sensores"
              },
              {
                id: "S4",
                title: "Lubrificar dobradiças (se aplicável)",
                instruction: "Semanalmente ou conforme necessidade, aplicar lubrificante apropriado nas dobradiças e pontos de articulação. Remover excesso.",
                why: "Prolongar vida útil e garantir movimento suave.",
                who: "Porteiro",
                time_estimate_min: 5,
                safety: "Usar lubrificante adequado. Evitar contato com pele.",
                quality_check: "Movimento suave e sem ruídos.",
                evidence: "Registro de lubrificação"
              },
              {
                id: "S5",
                title: "Reportar anomalias ao supervisor",
                instruction: "Qualquer problema identificado (ruído, travamento, sensor defeituoso, dano estrutural) deve ser imediatamente reportado ao supervisor, registrado no livro de ocorrências e, se crítico, acionar manutenção.",
                why: "Garantir reparo rápido e evitar agravamento do problema.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Não usar portão defeituoso se houver risco de segurança.",
                quality_check: "Supervisor informado e registro completo.",
                evidence: "Relatório de anomalia com data, horário e descrição"
              },
              {
                id: "S6",
                title: "Operar em horários de pico e emergências",
                instruction: "Em horários de grande fluxo, coordenar abertura/fechamento para otimizar passagem. Em emergências (evacuação, incêndio), seguir protocolo específico de abertura prioritária ou travamento.",
                why: "Garantir eficiência no fluxo e segurança em situações críticas.",
                who: "Porteiro",
                time_estimate_min: 0,
                safety: "Conhecer protocolo de emergência previamente.",
                quality_check: "Operação adequada ao contexto (pico ou emergência).",
                evidence: "Log de operações especiais"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização de portão em movimento", "Iluminação adequada"],
            epi: ["Luvas (para lubrificação)"],
            tools: ["Controle remoto/painel de comando", "Lubrificante apropriado", "Lanterna", "Rádio comunicador"],
            consumables: ["Lubrificante", "Pano para limpeza"]
          },
          training: {
            modules: [
              "Funcionamento de portões manuais e automáticos",
              "Inspeção e detecção de problemas",
              "Lubrificação e manutenção básica",
              "Protocolos de emergência"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Taxa de conformidade nas inspeções diárias",
              "Número de falhas reportadas vs detectadas",
              "Tempo médio para reporte de anomalias",
              "Disponibilidade dos portões (%)"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Inspeção e Operação de Portões"]
          },
          attachments: {
            templates: ["Checklist de inspeção diária"],
            photos: ["Pontos de lubrificação", "Sensores e travas"]
          }
        },
        {
          id: "PORT_5S",
          name: "Programa 5S - Portaria",
          objective: "Implementar metodologia 5S para melhorar organização, limpeza, padronização e disciplina na área de portaria, aumentando eficiência operacional e qualidade do ambiente de trabalho.",
          scope: "Todos os postos de portaria e controle de acesso.",
          prerequisites: [
            "Comprometimento da equipe com mudança cultural",
            "Materiais organizadores disponíveis",
            "Tempo alocado para implementação inicial"
          ],
          responsibilities: [
            "Porteiro: Aplicar 5S diariamente em seu posto de trabalho",
            "Supervisor: Realizar auditorias periódicas e fornecer feedback",
            "Todos: Manter disciplina e melhorias contínuas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Seiri - Senso de Utilização",
                instruction: "Identificar e eliminar documentos antigos, materiais promocionais vencidos, objetos pessoais em excesso e itens sem utilidade. Manter apenas o essencial no posto.",
                why: "Reduzir desperdício, liberar espaço e facilitar localização do essencial.",
                who: "Porteiro",
                time_estimate_min: 30,
                safety: "Descartar materiais perigosos conforme regulamentação.",
                quality_check: "Apenas itens necessários permanecem no local de trabalho.",
                evidence: "Lista de itens descartados/realocados"
              },
              {
                id: "S2",
                title: "Seiton - Senso de Organização",
                instruction: "Definir lugar específico para cada item: documentos por tipo, crachás por numeração, chaves em painel identificado. Posicionar materiais de uso frequente próximos. Criar identificação visual clara.",
                why: "Facilitar acesso, reduzir tempo de busca e aumentar produtividade.",
                who: "Porteiro",
                time_estimate_min: 45,
                safety: "Itens pesados em prateleiras baixas, identificação clara.",
                quality_check: "Cada item tem lugar definido e identificado.",
                evidence: "Fotos do antes/depois, etiquetas aplicadas"
              },
              {
                id: "S3",
                title: "Seiso - Senso de Limpeza",
                instruction: "Limpar completamente balcão, teclado, monitores, gavetas e área de atendimento. Verificar funcionamento de equipamentos durante limpeza. Identificar vazamentos, desgastes ou defeitos.",
                why: "Manter higiene, identificar problemas ocultos e prevenir defeitos.",
                who: "Porteiro",
                time_estimate_min: 60,
                safety: "Usar produtos adequados para eletrônicos.",
                quality_check: "Ambiente limpo, equipamentos funcionando, problemas identificados.",
                evidence: "Checklist de limpeza, registro de problemas encontrados"
              },
              {
                id: "S4",
                title: "Seiketsu - Senso de Padronização",
                instruction: "Estabelecer procedimentos padrão: checklist de início/fim de turno, padrão de organização de documentos, rotina de limpeza. Criar checklists visuais e fotos padrão.",
                why: "Garantir que todos sigam as mesmas práticas de organização e limpeza.",
                who: "Porteiro + Supervisor",
                time_estimate_min: 30,
                safety: "Padrões devem incluir aspectos de segurança.",
                quality_check: "Procedimentos documentados e compreendidos por todos.",
                evidence: "Checklists visuais, fotos padrão, procedimentos escritos"
              },
              {
                id: "S5",
                title: "Shitsuke - Senso de Disciplina",
                instruction: "Manter 5S como hábito diário. Realizar revisão diária pelo supervisor e auditoria semanal. Celebrar conquistas e corrigir desvios. Comprometimento contínuo da equipe.",
                why: "Transformar 5S em hábito permanente e cultura organizacional.",
                who: "Todos",
                time_estimate_min: 15,
                safety: "Reforçar práticas seguras continuamente.",
                quality_check: "Auditorias periódicas com resultados crescentes ao longo do tempo.",
                evidence: "Resultados de auditorias, ações corretivas, melhorias implementadas"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas (para limpeza)"],
            tools: [
              "Organizadores de gaveta",
              "Etiquetas e identificação visual",
              "Produtos de limpeza para eletrônicos",
              "Checklist de auditoria"
            ],
            consumables: ["Etiquetas", "Marcadores", "Material de limpeza"]
          },
          training: {
            modules: [
              "Fundamentos da metodologia 5S",
              "Benefícios e objetivos do programa",
              "Práticas específicas para portaria",
              "Auditoria e melhoria contínua"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Pontuação em auditorias 5S (escala 0-100)",
              "Tempo de busca de documentos e materiais",
              "Número de melhorias sugeridas pela equipe",
              "Satisfação da equipe com ambiente de trabalho"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Programa 5S Portaria"]
          },
          attachments: {
            templates: ["Checklist de auditoria 5S", "Formulário de ação corretiva"],
            photos: ["Fotos padrão de organização"]
          }
        }
      ]
    },
    {
      id: "ROND",
      name: "Ronda Noturna",
      description: "Vigilância preventiva durante o período noturno.",
      icon: "Eye",
      tags: ["segurança", "vigilância", "ronda", "noturno"],
      activities: [
        {
          id: "ROND_PREV",
          name: "Ronda preventiva noturna",
          objective: "Executar vigilância preventiva em áreas internas e externas durante o período noturno (12h noturno).",
          scope: "Todas as áreas comuns do condomínio durante a noite.",
          responsibilities: [
            "Realizar rondas regulares conforme roteiro estabelecido",
            "Verificar portões, iluminação e áreas críticas",
            "Registrar ocorrências e comunicar anormalidades"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Início do turno",
                instruction: "Retirar roteiro e equipamentos (rádio, lanterna tática).",
                why: "Garantir equipamentos funcionais antes de iniciar.",
                who: "Rondante Noturno",
                time_estimate_min: 3,
                safety: "Verificar funcionamento de rádios e lanternas.",
                quality_check: "Equipamentos testados e funcionais.",
                evidence: "Checklist de equipamentos assinado"
              },
              {
                id: "S2",
                title: "Ronda estratégica",
                instruction: "Cumprir circuito a cada 90-120 minutos, inspecionar portões, sensores, iluminação e áreas de risco.",
                why: "Prevenir invasões e identificar riscos.",
                who: "Rondante Noturno",
                time_estimate_min: 25,
                safety: "Observar movimentações suspeitas e manter postura atenta.",
                quality_check: "Todos os pontos críticos verificados.",
                evidence: "Registro de cada ponto visitado"
              },
              {
                id: "S3",
                title: "Comunicação de irregularidades",
                instruction: "Comunicar irregularidades à portaria ou supervisão imediatamente.",
                why: "Resposta rápida a situações de risco.",
                who: "Rondante Noturno",
                time_estimate_min: 2,
                safety: "Não confrontar suspeitos sozinho.",
                quality_check: "Comunicação realizada.",
                evidence: "Registro de comunicação no rádio/sistema"
              },
              {
                id: "S4",
                title: "Finalização",
                instruction: "Consolidar relatório de ronda com pontos verificados e ocorrências.",
                why: "Documentar atividades para auditoria.",
                who: "Rondante Noturno",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Relatório completo e assinado.",
                evidence: "Relatório de ronda assinado"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Bota", "Capa de chuva"],
            tools: ["Uniforme noturno", "Lanterna tática", "Rádio comunicador", "Check-list ou aplicativo de ronda"],
            consumables: []
          },
          training: {
            modules: [
              "Segurança patrimonial",
              "Comunicação via rádio",
              "Primeiros socorros e resposta a emergências"
            ],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Cumprimento do roteiro de ronda",
              "Número de ocorrências detectadas e resolvidas",
              "Tempo médio de resposta"
            ],
            audit_frequency_days: 7,
            auditor_role: "Supervisor de Segurança"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ROND_5S",
          name: "Programa 5S - Ronda Noturna",
          objective: "Implementar metodologia 5S para melhorar organização, limpeza, padronização e disciplina na área de ronda noturna, aumentando eficiência operacional e qualidade do ambiente de trabalho.",
          scope: "Área de ronda noturna, vestiários e posto de controle.",
          prerequisites: [
            "Comprometimento da equipe com mudança cultural",
            "Materiais organizadores disponíveis",
            "Tempo alocado para implementação inicial"
          ],
          responsibilities: [
            "Rondante: Aplicar 5S diariamente em seu posto de trabalho",
            "Supervisor: Realizar auditorias periódicas e fornecer feedback",
            "Todos: Manter disciplina e melhorias contínuas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Seiri - Senso de Utilização",
                instruction: "Identificar e eliminar equipamentos quebrados, lanternas sem bateria, rádios obsoletos, uniformes danificados e materiais sem uso. Manter apenas o essencial.",
                why: "Reduzir desperdício, liberar espaço e facilitar localização do essencial.",
                who: "Rondante Noturno",
                time_estimate_min: 30,
                safety: "Descartar materiais perigosos conforme regulamentação.",
                quality_check: "Apenas itens necessários permanecem no local de trabalho.",
                evidence: "Lista de itens descartados/realocados"
              },
              {
                id: "S2",
                title: "Seiton - Senso de Organização",
                instruction: "Definir lugar específico para equipamentos de ronda, relatórios, chaves de acesso. Criar organização padronizada com etiquetas refletivas para lanternas e rádios.",
                why: "Facilitar acesso, reduzir tempo de busca e aumentar produtividade.",
                who: "Rondante Noturno",
                time_estimate_min: 45,
                safety: "Equipamentos críticos em locais de fácil acesso.",
                quality_check: "Cada item tem lugar definido e identificado.",
                evidence: "Fotos do antes/depois, etiquetas aplicadas"
              },
              {
                id: "S3",
                title: "Seiso - Senso de Limpeza",
                instruction: "Limpar completamente lanternas, rádios, uniformes e área de descanso. Verificar estado de EPIs e funcionamento de equipamentos durante limpeza.",
                why: "Manter higiene, identificar problemas ocultos e prevenir defeitos.",
                who: "Rondante Noturno",
                time_estimate_min: 60,
                safety: "Usar produtos adequados para eletrônicos.",
                quality_check: "Ambiente limpo, equipamentos funcionando, problemas identificados.",
                evidence: "Checklist de limpeza, registro de problemas encontrados"
              },
              {
                id: "S4",
                title: "Seiketsu - Senso de Padronização",
                instruction: "Estabelecer procedimentos padrão: checklist pré-ronda, protocolo de armazenamento de equipamentos, rotina de manutenção. Criar checklists visuais.",
                why: "Garantir que todos sigam as mesmas práticas de organização e limpeza.",
                who: "Rondante Noturno + Supervisor",
                time_estimate_min: 30,
                safety: "Padrões devem incluir aspectos de segurança.",
                quality_check: "Procedimentos documentados e compreendidos por todos.",
                evidence: "Checklists visuais, fotos padrão, procedimentos escritos"
              },
              {
                id: "S5",
                title: "Shitsuke - Senso de Disciplina",
                instruction: "Manter 5S como hábito diário. Realizar verificação diária de equipamentos e relatório de condição. Auditorias periódicas.",
                why: "Transformar 5S em hábito permanente e cultura organizacional.",
                who: "Todos",
                time_estimate_min: 15,
                safety: "Reforçar práticas seguras continuamente.",
                quality_check: "Auditorias periódicas com resultados crescentes ao longo do tempo.",
                evidence: "Resultados de auditorias, ações corretivas, melhorias implementadas"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas (para limpeza)"],
            tools: [
              "Estante para equipamentos",
              "Organizador de lanternas",
              "Etiquetas refletivas",
              "Checklist de auditoria"
            ],
            consumables: ["Etiquetas", "Marcadores", "Material de limpeza"]
          },
          training: {
            modules: [
              "Fundamentos da metodologia 5S",
              "Benefícios e objetivos do programa",
              "Práticas específicas para ronda noturna",
              "Auditoria e melhoria contínua"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Pontuação em auditorias 5S (escala 0-100)",
              "Tempo de preparação para ronda",
              "% de equipamentos funcionais",
              "Zero ocorrências por falta de equipamento"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Segurança"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Programa 5S Ronda Noturna"]
          },
          attachments: {
            templates: ["Checklist de auditoria 5S", "Formulário de ação corretiva"],
            photos: ["Fotos padrão de organização"]
          }
        }
      ]
    },
    {
      id: "ASG",
      name: "ASG / Zeladoria",
      description: "Limpeza, conservação e apoio rotineiro.",
      icon: "Sparkles",
      tags: ["limpeza", "conservação", "zeladoria"],
      activities: [
        {
          id: "ASG_HALL",
          name: "Limpeza de hall social",
          objective: "Hall limpo, organizado e agradável para moradores.",
          scope: "Halls, lobbies e áreas de convivência.",
          responsibilities: [
            "Limpeza completa conforme cronograma",
            "Acabamento e controle de odor",
            "Produtos adequados por superfície"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Preparação e sinalização",
                instruction: "Vestir EPIs, colocar placa de Piso Molhado e reunir materiais.",
                why: "Prevenir acidentes e garantir eficiência.",
                who: "ASG",
                time_estimate_min: 3,
                safety: "EPIs vestidos e placas visíveis.",
                quality_check: "Kit completo e sinalização adequada.",
                evidence: "Placas posicionadas, checklist de materiais"
              },
              {
                id: "S2",
                title: "Varrição",
                instruction: "Remover resíduos visíveis com vassoura.",
                why: "Preparação da superfície.",
                who: "ASG",
                time_estimate_min: 3,
                safety: "Atenção a objetos cortantes.",
                quality_check: "Piso sem resíduos.",
                evidence: "Inspeção visual"
              },
              {
                id: "S3",
                title: "Higienização do piso",
                instruction: "Aplicar mop úmido com produto neutro em toda a área.",
                why: "Remoção de sujeira e higienização.",
                who: "ASG",
                time_estimate_min: 10,
                safety: "Produto diluído corretamente.",
                quality_check: "Cobertura completa do piso.",
                evidence: "Piso brilhante"
              },
              {
                id: "S4",
                title: "Vidros e metais",
                instruction: "Limpar espelhos, portas e superfícies metálicas.",
                why: "Acabamento visual.",
                who: "ASG",
                time_estimate_min: 5,
                safety: "Não usar produtos abrasivos.",
                quality_check: "Sem manchas ou marcas.",
                evidence: "Superfícies transparentes e brilhantes"
              },
              {
                id: "S5",
                title: "Finalização",
                instruction: "Retirar sinalização após secagem total.",
                why: "Liberar área para uso.",
                who: "ASG",
                time_estimate_min: 1,
                safety: "Verificar secagem completa.",
                quality_check: "Piso seco.",
                evidence: "Área liberada"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização de piso molhado"],
            epi: ["Luvas"],
            tools: ["Mop", "Balde", "Panos de microfibra", "Carrinho funcional"],
            consumables: ["Detergente neutro", "Limpa vidros"]
          },
          training: {
            modules: ["Técnicas de limpeza profissional", "Segurança no uso de produtos químicos", "Organização e 5S"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Checklist diário 100%", "Zero reclamações", "Controle de consumo de materiais"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ASG_BANH",
          name: "Limpeza de banheiros sociais",
          objective: "Banheiros limpos, desinfetados e com insumos repostos.",
          scope: "Banheiros de uso comum.",
          responsibilities: ["Reposição de insumos", "Desinfecção completa", "Controle de odores"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Preparação e EPIs",
                instruction: "Placa de limpeza; usar luvas, botas, óculos.",
                why: "Segurança e higiene.",
                who: "ASG",
                time_estimate_min: 1,
                safety: "EPIs obrigatórios.",
                quality_check: "EPIs completos.",
                evidence: "Registro fotográfico"
              },
              {
                id: "S2",
                title: "Retirada de lixo",
                instruction: "Retirar lixo e repor sacos.",
                why: "Higiene básica.",
                who: "ASG",
                time_estimate_min: 2,
                safety: "Não tocar lixo diretamente.",
                quality_check: "Lixeiras limpas.",
                evidence: "Sacos novos"
              },
              {
                id: "S3",
                title: "Desinfecção",
                instruction: "Aplicar desinfetante nas louças e superfícies; esfregar.",
                why: "Eliminação de germes.",
                who: "ASG",
                time_estimate_min: 10,
                safety: "Ventilar ambiente.",
                quality_check: "Produto em todas as superfícies.",
                evidence: "Odor de desinfetante"
              },
              {
                id: "S4",
                title: "Enxágue e reposição",
                instruction: "Remover produto, secar e repor papel, sabonete e toalhas.",
                why: "Finalização e conforto.",
                who: "ASG",
                time_estimate_min: 5,
                safety: "Não misturar produtos.",
                quality_check: "Sem resíduos, insumos completos.",
                evidence: "Superfícies secas e insumos repostos"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização de limpeza"],
            epi: ["Luvas grossas", "Botas", "Óculos de proteção"],
            tools: ["Escovas", "Panos", "Balde"],
            consumables: ["Desinfetante", "Detergente", "Papel higiênico", "Sabonete líquido", "Toalhas de papel"]
          },
          training: {
            modules: ["Desinfecção e higiene", "Uso seguro de produtos químicos"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["100% insumos repostos", "Zero reclamações"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ASG_GAR",
          name: "Limpeza de garagem",
          objective: "Garagem limpa, sem sujeira acumulada e drenagem funcionando.",
          scope: "Garagens e estacionamentos.",
          responsibilities: ["Varrição e lavagem", "Desobstrução de ralos", "Remoção de manchas de óleo"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Varrição geral",
                instruction: "Remover folhas, terra e resíduos grandes.",
                why: "Preparação da superfície.",
                who: "ASG",
                time_estimate_min: 15,
                safety: "Atenção a veículos em movimento.",
                quality_check: "Área sem resíduos visíveis.",
                evidence: "Inspeção visual"
              },
              {
                id: "S2",
                title: "Lavagem",
                instruction: "Lavar piso com jato d'água e detergente apropriado.",
                why: "Remoção de sujeira aderida.",
                who: "ASG",
                time_estimate_min: 30,
                safety: "Sinalizar área molhada.",
                quality_check: "Piso limpo.",
                evidence: "Piso sem manchas"
              },
              {
                id: "S3",
                title: "Ralos e finalização",
                instruction: "Desobstruir ralos e verificar escoamento da água.",
                why: "Evitar alagamentos.",
                who: "ASG",
                time_estimate_min: 10,
                safety: "Usar luvas para limpar ralos.",
                quality_check: "Água escoando corretamente.",
                evidence: "Ralos desobstruídos"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização"],
            epi: ["Luvas", "Botas"],
            tools: ["Mangueira de alta pressão", "Vassoura", "Rodo"],
            consumables: ["Detergente desengraxante", "Removedor de óleo"]
          },
          training: {
            modules: ["Limpeza de áreas externas", "Segurança em ambientes com veículos"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Checklist semanal completo", "Zero reclamações"],
            audit_frequency_days: 15,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ASG_ELEV",
          name: "Limpeza de elevadores",
          objective: "Elevadores limpos, funcionais e bem apresentados.",
          scope: "Cabines e botões de todos os elevadores.",
          responsibilities: ["Limpeza interna da cabine", "Desinfecção de botões", "Limpeza de espelhos e paredes"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Preparação",
                instruction: "Bloquear elevador temporariamente e vestir EPIs.",
                why: "Segurança durante limpeza.",
                who: "ASG",
                time_estimate_min: 1,
                safety: "Nunca limpar com elevador em movimento.",
                quality_check: "Elevador bloqueado.",
                evidence: "Registro de bloqueio"
              },
              {
                id: "S2",
                title: "Limpeza interna",
                instruction: "Limpar paredes, espelhos, piso e botões com produto adequado.",
                why: "Higiene e apresentação.",
                who: "ASG",
                time_estimate_min: 8,
                safety: "Não usar água em excesso nos botões.",
                quality_check: "Cabine limpa e brilhante.",
                evidence: "Inspeção visual"
              },
              {
                id: "S3",
                title: "Desinfecção e liberação",
                instruction: "Desinfetar botões e liberar elevador.",
                why: "Controle sanitário.",
                who: "ASG",
                time_estimate_min: 2,
                safety: "Aguardar secagem antes de liberar.",
                quality_check: "Botões desinfetados.",
                evidence: "Elevador liberado"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas"],
            tools: ["Panos de microfibra", "Spray"],
            consumables: ["Limpa vidros", "Desinfetante", "Produto neutro"]
          },
          training: {
            modules: ["Limpeza de elevadores", "Segurança em ambientes confinados"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["100% elevadores limpos diariamente"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ASG_ESC",
          name: "Limpeza de escadas",
          objective: "Escadas limpas, seguras e sem resíduos.",
          scope: "Todas as escadas de uso comum.",
          responsibilities: ["Varrição e limpeza de degraus", "Limpeza de corrimãos", "Controle de segurança"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Varrição",
                instruction: "Varrer todos os degraus de cima para baixo.",
                why: "Remoção de resíduos.",
                who: "ASG",
                time_estimate_min: 5,
                safety: "Atenção ao deslocamento vertical.",
                quality_check: "Degraus sem resíduos.",
                evidence: "Inspeção visual"
              },
              {
                id: "S2",
                title: "Limpeza úmida",
                instruction: "Passar pano úmido nos degraus e corrimãos.",
                why: "Higienização completa.",
                who: "ASG",
                time_estimate_min: 10,
                safety: "Sinalizar durante limpeza.",
                quality_check: "Degraus limpos.",
                evidence: "Piso brilhante"
              },
              {
                id: "S3",
                title: "Desinfecção de corrimãos",
                instruction: "Desinfetar corrimãos com produto adequado.",
                why: "Controle sanitário.",
                who: "ASG",
                time_estimate_min: 3,
                safety: "Aguardar secagem.",
                quality_check: "Corrimãos desinfetados.",
                evidence: "Corrimãos limpos"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização"],
            epi: ["Luvas"],
            tools: ["Vassoura", "Panos", "Balde"],
            consumables: ["Detergente neutro", "Desinfetante"]
          },
          training: {
            modules: ["Técnicas de limpeza vertical", "Segurança em escadas"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Checklist diário completo"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ASG_5S",
          name: "Programa 5S - Limpeza/Zeladoria",
          objective: "Implementar metodologia 5S para melhorar organização, limpeza, padronização e disciplina na área de limpeza/zeladoria, aumentando eficiência operacional e qualidade do ambiente de trabalho.",
          scope: "DML (Depósito de Material de Limpeza) e áreas de zeladoria.",
          prerequisites: [
            "Comprometimento da equipe com mudança cultural",
            "Materiais organizadores disponíveis",
            "Tempo alocado para implementação inicial"
          ],
          responsibilities: [
            "Zelador/ASG: Aplicar 5S diariamente em seu posto de trabalho",
            "Supervisor: Realizar auditorias periódicas e fornecer feedback",
            "Todos: Manter disciplina e melhorias contínuas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Seiri - Senso de Utilização",
                instruction: "Identificar e descartar produtos vencidos, embalagens vazias, panos e esponjas gastas, ferramentas quebradas. Manter apenas o essencial no DML.",
                why: "Reduzir desperdício, liberar espaço e facilitar localização do essencial.",
                who: "Zelador/ASG",
                time_estimate_min: 30,
                safety: "Descartar produtos químicos conforme regulamentação.",
                quality_check: "Apenas itens necessários permanecem no local de trabalho.",
                evidence: "Lista de itens descartados/realocados"
              },
              {
                id: "S2",
                title: "Seiton - Senso de Organização",
                instruction: "Organizar produtos por tipo, padronizar carrinho de limpeza, definir lugar para cada ferramenta. Criar prateleiras identificadas com etiquetas.",
                why: "Facilitar acesso, reduzir tempo de busca e aumentar produtividade.",
                who: "Zelador/ASG",
                time_estimate_min: 45,
                safety: "Produtos químicos em prateleiras adequadas com FISPQ visível.",
                quality_check: "Cada item tem lugar definido e identificado.",
                evidence: "Fotos do antes/depois, etiquetas aplicadas"
              },
              {
                id: "S3",
                title: "Seiso - Senso de Limpeza",
                instruction: "Limpar completamente o DML, lavar equipamentos de limpeza, organizar prateleiras. Verificar vazamentos e estado de embalagens.",
                why: "Manter higiene, identificar problemas ocultos e prevenir defeitos.",
                who: "Zelador/ASG",
                time_estimate_min: 60,
                safety: "Ventilar área ao limpar produtos químicos.",
                quality_check: "Ambiente limpo, equipamentos funcionando, problemas identificados.",
                evidence: "Checklist de limpeza, registro de problemas encontrados"
              },
              {
                id: "S4",
                title: "Seiketsu - Senso de Padronização",
                instruction: "Estabelecer padrão de carrinho de limpeza, criar fichas técnicas de produtos na parede, protocolo de reabastecimento.",
                why: "Garantir que todos sigam as mesmas práticas de organização e limpeza.",
                who: "Zelador/ASG + Supervisor",
                time_estimate_min: 30,
                safety: "Fichas técnicas devem incluir procedimentos de segurança.",
                quality_check: "Procedimentos documentados e compreendidos por todos.",
                evidence: "Checklists visuais, fichas técnicas plastificadas, procedimentos escritos"
              },
              {
                id: "S5",
                title: "Shitsuke - Senso de Disciplina",
                instruction: "Manter 5S como hábito diário. Realizar inspeção semanal do DML, reabastecimento programado. Auditorias periódicas.",
                why: "Transformar 5S em hábito permanente e cultura organizacional.",
                who: "Todos",
                time_estimate_min: 15,
                safety: "Reforçar práticas seguras com produtos químicos continuamente.",
                quality_check: "Auditorias periódicas com resultados crescentes ao longo do tempo.",
                evidence: "Resultados de auditorias, ações corretivas, melhorias implementadas"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas (para manuseio de químicos)"],
            tools: [
              "Prateleiras identificadas",
              "Caixas organizadoras",
              "Fichas técnicas plastificadas",
              "Checklist de auditoria"
            ],
            consumables: ["Etiquetas", "Marcadores", "Material de limpeza"]
          },
          training: {
            modules: [
              "Fundamentos da metodologia 5S",
              "Benefícios e objetivos do programa",
              "Práticas específicas para limpeza/zeladoria",
              "Auditoria e melhoria contínua"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Pontuação em auditorias 5S (escala 0-100)",
              "Tempo de preparação de carrinho de limpeza",
              "Consumo otimizado de produtos",
              "Zero acidentes com produtos"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Zeladoria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Programa 5S Limpeza/Zeladoria"]
          },
          attachments: {
            templates: ["Checklist de auditoria 5S", "Formulário de ação corretiva"],
            photos: ["Fotos padrão de organização do DML"]
          }
        }
      ]
    },
    {
      id: "VIGIL",
      name: "Vigilância",
      description: "Proteção patrimonial armada e desarmada.",
      icon: "Shield",
      tags: ["segurança", "vigilância", "proteção"],
      activities: [
        {
          id: "VIGIL_ARM",
          name: "Vigilância armada",
          objective: "Proteger pessoas e patrimônio do condomínio com presença armada, atuando de forma preventiva e dentro da lei.",
          scope: "Áreas comuns do condomínio, 24/7.",
          responsibilities: [
            "Cumprir instruções de posto",
            "Realizar rondas e manter postura atenta",
            "Registrar e comunicar ocorrências",
            "Acionar forças de segurança quando necessário"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Início do turno",
                instruction: "Assumir posto, revisar informações do plantão anterior e verificar arma e colete.",
                why: "Continuidade operacional e segurança pessoal.",
                who: "Vigilante Armado",
                time_estimate_min: 5,
                safety: "Verificar arma e colete balístico.",
                quality_check: "Leitura completa do livro de ocorrências.",
                evidence: "Assinatura no livro de ocorrências"
              },
              {
                id: "S2",
                title: "Verificação de equipamentos",
                instruction: "Testar rádio, alarmes e equipamentos de segurança.",
                why: "Garantir comunicação e resposta a emergências.",
                who: "Vigilante Armado",
                time_estimate_min: 3,
                safety: "Equipamentos funcionais.",
                quality_check: "Todos os equipamentos operacionais.",
                evidence: "Checklist de equipamentos assinado"
              },
              {
                id: "S3",
                title: "Rondas estratégicas",
                instruction: "Executar rondas estratégicas e observar movimentações suspeitas.",
                why: "Dissuadir crimes e identificar riscos.",
                who: "Vigilante Armado",
                time_estimate_min: 20,
                safety: "Manter presença ostensiva e postura profissional.",
                quality_check: "Rondas executadas conforme roteiro.",
                evidence: "Registro de rondas"
              },
              {
                id: "S4",
                title: "Protocolo de emergência",
                instruction: "Acionar protocolo em situações de emergência (seguir uso progressivo da força).",
                why: "Resposta adequada e legal.",
                who: "Vigilante Armado",
                time_estimate_min: 0,
                safety: "Uso progressivo da força conforme legislação.",
                quality_check: "Protocolo seguido corretamente.",
                evidence: "Relatório de ocorrência detalhado"
              },
              {
                id: "S5",
                title: "Encerramento do turno",
                instruction: "Registrar ocorrências com hora, fato e providência. Entregar posto com relatório completo.",
                why: "Documentação e continuidade.",
                who: "Vigilante Armado",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Relatório completo e assinado.",
                evidence: "Relatório de turno"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Colete balístico"],
            tools: ["Uniforme tático", "Rádio comunicador", "Lanterna", "Arma de fogo registrada"],
            consumables: []
          },
          training: {
            modules: [
              "Legislação da segurança privada",
              "Procedimentos de emergência",
              "Uso progressivo da força"
            ],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Tempo médio de resposta a ocorrências",
              "Cumprimento de rondas",
              "Relatórios completos e auditáveis"
            ],
            audit_frequency_days: 7,
            auditor_role: "Supervisor de Segurança"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "VIGIL_DESARM",
          name: "Vigilância desarmada",
          objective: "Proteger pessoas e patrimônio do condomínio com presença ostensiva desarmada, atuando de forma preventiva.",
          scope: "Áreas comuns do condomínio, 24/7.",
          responsibilities: [
            "Cumprir instruções de posto",
            "Realizar rondas e manter postura atenta",
            "Registrar e comunicar ocorrências",
            "Acionar forças de segurança quando necessário"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Início do turno",
                instruction: "Assumir posto e revisar informações do plantão anterior.",
                why: "Continuidade operacional.",
                who: "Vigilante Desarmado",
                time_estimate_min: 5,
                safety: "Verificar equipamentos de comunicação.",
                quality_check: "Leitura completa do livro de ocorrências.",
                evidence: "Assinatura no livro de ocorrências"
              },
              {
                id: "S2",
                title: "Verificação de equipamentos",
                instruction: "Testar rádio, alarmes e equipamentos de segurança.",
                why: "Garantir comunicação e resposta a emergências.",
                who: "Vigilante Desarmado",
                time_estimate_min: 3,
                safety: "Equipamentos funcionais.",
                quality_check: "Todos os equipamentos operacionais.",
                evidence: "Checklist de equipamentos assinado"
              },
              {
                id: "S3",
                title: "Rondas preventivas",
                instruction: "Executar rondas estratégicas e observar movimentações suspeitas.",
                why: "Dissuadir crimes e identificar riscos.",
                who: "Vigilante Desarmado",
                time_estimate_min: 20,
                safety: "Manter presença ostensiva e postura profissional. Não confrontar suspeitos.",
                quality_check: "Rondas executadas conforme roteiro.",
                evidence: "Registro de rondas"
              },
              {
                id: "S4",
                title: "Protocolo de emergência",
                instruction: "Acionar forças de segurança em situações de emergência.",
                why: "Resposta adequada sem risco pessoal.",
                who: "Vigilante Desarmado",
                time_estimate_min: 0,
                safety: "Não confrontar. Priorizar comunicação e segurança pessoal.",
                quality_check: "Protocolo seguido corretamente.",
                evidence: "Relatório de ocorrência detalhado"
              },
              {
                id: "S5",
                title: "Encerramento do turno",
                instruction: "Registrar ocorrências e entregar posto com relatório completo.",
                why: "Documentação e continuidade.",
                who: "Vigilante Desarmado",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Relatório completo e assinado.",
                evidence: "Relatório de turno"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Uniforme", "Rádio comunicador", "Lanterna"],
            consumables: []
          },
          training: {
            modules: [
              "Legislação da segurança privada",
              "Procedimentos de emergência",
              "Comunicação e mediação de conflitos"
            ],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Tempo médio de resposta a ocorrências",
              "Cumprimento de rondas",
              "Relatórios completos e auditáveis"
            ],
            audit_frequency_days: 7,
            auditor_role: "Supervisor de Segurança"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "VIGIL_5S",
          name: "Programa 5S - Vigilância",
          objective: "Implementar metodologia 5S para melhorar organização, limpeza, padronização e disciplina na área de vigilância, aumentando eficiência operacional e qualidade do ambiente de trabalho.",
          scope: "Posto de vigilância, armário tático e área de equipamentos.",
          prerequisites: [
            "Comprometimento da equipe com mudança cultural",
            "Materiais organizadores disponíveis",
            "Tempo alocado para implementação inicial"
          ],
          responsibilities: [
            "Vigilante: Aplicar 5S diariamente em seu posto de trabalho",
            "Supervisor: Realizar auditorias periódicas e fornecer feedback",
            "Todos: Manter disciplina e melhorias contínuas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Seiri - Senso de Utilização",
                instruction: "Identificar e eliminar uniformes danificados, equipamentos quebrados, documentos antigos e materiais sem utilidade. Manter apenas o essencial.",
                why: "Reduzir desperdício, liberar espaço e facilitar localização do essencial.",
                who: "Vigilante",
                time_estimate_min: 30,
                safety: "Descartar munições vencidas conforme protocolo específico.",
                quality_check: "Apenas itens necessários permanecem no local de trabalho.",
                evidence: "Lista de itens descartados/realocados"
              },
              {
                id: "S2",
                title: "Seiton - Senso de Organização",
                instruction: "Organizar armário tático, equipamentos de comunicação, registros de ocorrências. Criar identificação visual clara para cada item crítico.",
                why: "Facilitar acesso, reduzir tempo de busca e aumentar produtividade.",
                who: "Vigilante",
                time_estimate_min: 45,
                safety: "Armas e munições em local seguro com cadeado.",
                quality_check: "Cada item tem lugar definido e identificado.",
                evidence: "Fotos do antes/depois, etiquetas aplicadas"
              },
              {
                id: "S3",
                title: "Seiso - Senso de Limpeza",
                instruction: "Limpar colete balístico, rádio, arma (conforme protocolo), uniformes e área de trabalho. Verificar estado de conservação durante limpeza.",
                why: "Manter higiene, identificar problemas ocultos e prevenir defeitos.",
                who: "Vigilante",
                time_estimate_min: 60,
                safety: "Seguir protocolo de limpeza de arma com munição separada.",
                quality_check: "Ambiente limpo, equipamentos funcionando, problemas identificados.",
                evidence: "Checklist de limpeza, registro de problemas encontrados"
              },
              {
                id: "S4",
                title: "Seiketsu - Senso de Padronização",
                instruction: "Estabelecer checklist de equipamentos de segurança, protocolo de manutenção de arma, rotina de verificação. Criar padrões visuais.",
                why: "Garantir que todos sigam as mesmas práticas de organização e limpeza.",
                who: "Vigilante + Supervisor",
                time_estimate_min: 30,
                safety: "Padrões devem incluir todos os aspectos de segurança armada.",
                quality_check: "Procedimentos documentados e compreendidos por todos.",
                evidence: "Checklists visuais, fotos padrão, procedimentos escritos"
              },
              {
                id: "S5",
                title: "Shitsuke - Senso de Disciplina",
                instruction: "Manter 5S como hábito diário. Realizar revista diária de equipamentos, manutenção preventiva mensal. Auditorias rigorosas.",
                why: "Transformar 5S em hábito permanente e cultura organizacional.",
                who: "Todos",
                time_estimate_min: 15,
                safety: "Reforçar práticas seguras com armas e equipamentos táticos.",
                quality_check: "Auditorias periódicas com resultados crescentes ao longo do tempo.",
                evidence: "Resultados de auditorias, ações corretivas, melhorias implementadas"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas (para limpeza de equipamentos)"],
            tools: [
              "Armário com cadeado",
              "Organizador de equipamentos táticos",
              "Kit de limpeza de arma",
              "Checklist de auditoria"
            ],
            consumables: ["Etiquetas", "Marcadores", "Material de limpeza para arma"]
          },
          training: {
            modules: [
              "Fundamentos da metodologia 5S",
              "Benefícios e objetivos do programa",
              "Práticas específicas para vigilância",
              "Auditoria e melhoria contínua"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Pontuação em auditorias 5S (escala 0-100)",
              "Disponibilidade 100% de equipamentos críticos",
              "Conformidade em inspeções",
              "Tempo de resposta a ocorrências"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Segurança"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Programa 5S Vigilância"]
          },
          attachments: {
            templates: ["Checklist de auditoria 5S", "Formulário de ação corretiva"],
            photos: ["Fotos padrão de organização"]
          }
        }
      ]
    },
    {
      id: "JARD",
      name: "Jardinagem",
      description: "Manutenção de áreas verdes e paisagismo.",
      icon: "Trees",
      tags: ["jardinagem", "paisagismo", "áreas verdes"],
      activities: [
        {
          id: "JARD_PODA",
          name: "Poda de plantas ornamentais",
          objective: "Manter plantas saudáveis e paisagismo harmonioso.",
          scope: "Todas as áreas verdes do condomínio.",
          responsibilities: ["Realizar podas conforme cronograma", "Remover galhos secos e doentes", "Recolher resíduos"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Planejamento",
                instruction: "Planejar zonas de poda conforme cronograma.",
                why: "Organização e eficiência.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "Identificar plantas que necessitam poda.",
                quality_check: "Cronograma definido.",
                evidence: "Lista de áreas"
              },
              {
                id: "S2",
                title: "Execução da poda",
                instruction: "Efetuar poda técnica com tesouras adequadas.",
                why: "Saúde das plantas e estética.",
                who: "Jardineiro",
                time_estimate_min: 30,
                safety: "Usar luvas e óculos de proteção.",
                quality_check: "Poda executada corretamente.",
                evidence: "Plantas podadas"
              },
              {
                id: "S3",
                title: "Limpeza",
                instruction: "Recolher aparas e resíduos vegetais.",
                why: "Organização da área.",
                who: "Jardineiro",
                time_estimate_min: 10,
                safety: "Atenção a galhos cortantes.",
                quality_check: "Área limpa.",
                evidence: "Resíduos recolhidos"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas", "Botas", "Óculos de proteção"],
            tools: ["Tesouras de poda", "Serrote", "Carrinho de mão"],
            consumables: ["Sacos para resíduos"]
          },
          training: {
            modules: ["Técnicas de poda", "Identificação de plantas", "Operação segura de equipamentos"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Cronograma cumprido", "Condição visual das plantas", "Fotos comparativas"],
            audit_frequency_days: 30,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "JARD_IRRIG",
          name: "Irrigação de áreas verdes",
          objective: "Garantir hidratação adequada das plantas.",
          scope: "Todas as áreas verdes do condomínio.",
          responsibilities: ["Irrigar conforme necessidade", "Ajustar volume de água", "Verificar sistemas automáticos"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Verificação",
                instruction: "Verificar umidade do solo e necessidade de irrigação.",
                why: "Evitar desperdício de água.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Solo verificado.",
                evidence: "Registro de umidade"
              },
              {
                id: "S2",
                title: "Irrigação",
                instruction: "Irrigar com volume adequado (manhã ou final de tarde).",
                why: "Absorção eficiente.",
                who: "Jardineiro",
                time_estimate_min: 20,
                safety: "Não irrigar em horário de sol forte.",
                quality_check: "Área irrigada uniformemente.",
                evidence: "Solo úmido"
              },
              {
                id: "S3",
                title: "Verificação de sistema",
                instruction: "Verificar funcionamento de aspersores e temporizadores.",
                why: "Garantir irrigação automática.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Sistema funcionando.",
                evidence: "Checklist de sistema"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Botas"],
            tools: ["Mangueira", "Aspersores", "Temporizador"],
            consumables: []
          },
          training: {
            modules: ["Técnicas de irrigação", "Economia de água"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Plantas saudáveis", "Consumo de água controlado"],
            audit_frequency_days: 30,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "JARD_ADUB",
          name: "Adubação de jardins",
          objective: "Fornecer nutrientes para o desenvolvimento saudável das plantas.",
          scope: "Todas as áreas verdes do condomínio.",
          responsibilities: ["Aplicar adubos conforme cronograma", "Dosagem correta", "Registrar aplicações"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Preparação",
                instruction: "Preparar adubo conforme tipo de planta e dosagem recomendada.",
                why: "Nutrição adequada.",
                who: "Jardineiro",
                time_estimate_min: 10,
                safety: "Usar luvas.",
                quality_check: "Dosagem correta.",
                evidence: "Registro de dosagem"
              },
              {
                id: "S2",
                title: "Aplicação",
                instruction: "Aplicar adubo ao redor das plantas (não nas folhas).",
                why: "Evitar queimaduras.",
                who: "Jardineiro",
                time_estimate_min: 20,
                safety: "Não aplicar em dias chuvosos.",
                quality_check: "Adubo distribuído uniformemente.",
                evidence: "Área adubada"
              },
              {
                id: "S3",
                title: "Irrigação pós-adubação",
                instruction: "Irrigar levemente após aplicação.",
                why: "Facilitar absorção.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Solo úmido.",
                evidence: "Irrigação realizada"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas", "Máscara"],
            tools: ["Pá", "Regador"],
            consumables: ["Adubos orgânicos", "Fertilizantes"]
          },
          training: {
            modules: ["Tipos de adubos", "Dosagem e aplicação"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Cronograma de adubação cumprido", "Plantas vigorosas"],
            audit_frequency_days: 90,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "JARD_PRAGA",
          name: "Controle de pragas em jardins",
          objective: "Prevenir e controlar pragas e doenças nas plantas.",
          scope: "Todas as áreas verdes do condomínio.",
          responsibilities: ["Identificar pragas", "Aplicar defensivos adequados", "Registrar aplicações"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Inspeção",
                instruction: "Inspecionar plantas e identificar pragas ou doenças.",
                why: "Diagnóstico correto.",
                who: "Jardineiro",
                time_estimate_min: 10,
                safety: "N/A",
                quality_check: "Praga identificada.",
                evidence: "Registro de identificação"
              },
              {
                id: "S2",
                title: "Aplicação",
                instruction: "Aplicar defensivo adequado conforme recomendação técnica.",
                why: "Eliminação de pragas.",
                who: "Jardineiro",
                time_estimate_min: 15,
                safety: "Usar EPIs completos (máscara, luvas, óculos).",
                quality_check: "Aplicação uniforme.",
                evidence: "Registro de aplicação"
              },
              {
                id: "S3",
                title: "Monitoramento",
                instruction: "Monitorar eficácia do tratamento após 7 dias.",
                why: "Garantir eliminação da praga.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Praga eliminada.",
                evidence: "Registro de monitoramento"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas", "Máscara", "Óculos de proteção"],
            tools: ["Pulverizador"],
            consumables: ["Defensivos agrícolas", "Inseticidas", "Fungicidas"]
          },
          training: {
            modules: ["Identificação de pragas", "Uso seguro de defensivos", "Legislação ambiental"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Taxa de controle de pragas", "Zero intoxicações"],
            audit_frequency_days: 30,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "JARD_5S",
          name: "Programa 5S - Jardinagem",
          objective: "Implementar metodologia 5S para melhorar organização, limpeza, padronização e disciplina na área de jardinagem, aumentando eficiência operacional e qualidade do ambiente de trabalho.",
          scope: "Depósito de jardinagem, área de ferramentas e insumos.",
          prerequisites: [
            "Comprometimento da equipe com mudança cultural",
            "Materiais organizadores disponíveis",
            "Tempo alocado para implementação inicial"
          ],
          responsibilities: [
            "Jardineiro: Aplicar 5S diariamente em seu posto de trabalho",
            "Supervisor: Realizar auditorias periódicas e fornecer feedback",
            "Todos: Manter disciplina e melhorias contínuas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Seiri - Senso de Utilização",
                instruction: "Identificar e descartar ferramentas quebradas, plantas mortas, embalagens de insumos vazias, materiais sem uso. Manter apenas o essencial.",
                why: "Reduzir desperdício, liberar espaço e facilitar localização do essencial.",
                who: "Jardineiro",
                time_estimate_min: 30,
                safety: "Descartar defensivos vencidos conforme regulamentação.",
                quality_check: "Apenas itens necessários permanecem no local de trabalho.",
                evidence: "Lista de itens descartados/realocados"
              },
              {
                id: "S2",
                title: "Seiton - Senso de Organização",
                instruction: "Organizar ferramentas por tipo em painel, insumos por validade, padronizar carrinho de jardinagem. Usar etiquetas impermeáveis.",
                why: "Facilitar acesso, reduzir tempo de busca e aumentar produtividade.",
                who: "Jardineiro",
                time_estimate_min: 45,
                safety: "Ferramentas cortantes em locais seguros.",
                quality_check: "Cada item tem lugar definido e identificado.",
                evidence: "Fotos do antes/depois, etiquetas aplicadas"
              },
              {
                id: "S3",
                title: "Seiso - Senso de Limpeza",
                instruction: "Limpar ferramentas após uso, lavar carrinho, organizar depósito. Verificar estado de conservação de ferramentas e equipamentos.",
                why: "Manter higiene, identificar problemas ocultos e prevenir defeitos.",
                who: "Jardineiro",
                time_estimate_min: 60,
                safety: "Limpar ferramentas antes de guardar para evitar oxidação.",
                quality_check: "Ambiente limpo, equipamentos funcionando, problemas identificados.",
                evidence: "Checklist de limpeza, registro de problemas encontrados"
              },
              {
                id: "S4",
                title: "Seiketsu - Senso de Padronização",
                instruction: "Estabelecer padrão de armazenamento de ferramentas, controle de estoque de insumos, protocolo de manutenção de equipamentos.",
                why: "Garantir que todos sigam as mesmas práticas de organização e limpeza.",
                who: "Jardineiro + Supervisor",
                time_estimate_min: 30,
                safety: "Padrões devem incluir manuseio seguro de ferramentas.",
                quality_check: "Procedimentos documentados e compreendidos por todos.",
                evidence: "Checklists visuais, fotos padrão, procedimentos escritos"
              },
              {
                id: "S5",
                title: "Shitsuke - Senso de Disciplina",
                instruction: "Manter 5S como hábito diário. Realizar limpeza diária de ferramentas, inventário mensal de insumos. Auditorias periódicas.",
                why: "Transformar 5S em hábito permanente e cultura organizacional.",
                who: "Todos",
                time_estimate_min: 15,
                safety: "Reforçar práticas seguras com ferramentas cortantes.",
                quality_check: "Auditorias periódicas com resultados crescentes ao longo do tempo.",
                evidence: "Resultados de auditorias, ações corretivas, melhorias implementadas"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas (para limpeza)"],
            tools: [
              "Painel para ferramentas",
              "Prateleiras para insumos",
              "Etiquetas impermeáveis",
              "Checklist de auditoria"
            ],
            consumables: ["Etiquetas", "Marcadores", "Material de limpeza"]
          },
          training: {
            modules: [
              "Fundamentos da metodologia 5S",
              "Benefícios e objetivos do programa",
              "Práticas específicas para jardinagem",
              "Auditoria e melhoria contínua"
            ],
            refresh_cadence_days: 180
          },
          review: {
            kpis: [
              "Pontuação em auditorias 5S (escala 0-100)",
              "Vida útil de ferramentas",
              "Zero acidentes",
              "Tempo de busca de materiais"
            ],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Jardinagem"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-11-13",
            changelog: ["Criação inicial do POP - Programa 5S Jardinagem"]
          },
          attachments: {
            templates: ["Checklist de auditoria 5S", "Formulário de ação corretiva"],
            photos: ["Fotos padrão de organização"]
          }
        }
      ]
    },
    {
      id: "PISC",
      name: "Piscineiro",
      description: "Manutenção e tratamento de piscinas.",
      icon: "Waves",
      tags: ["piscina", "manutenção", "tratamento químico"],
      activities: [
        {
          id: "PISC_QUIM",
          name: "Tratamento químico da água",
          objective: "Manter a piscina limpa, tratada e segura para uso.",
          scope: "Todas as piscinas do condomínio.",
          responsibilities: [
            "Verificar pH e cloro diariamente",
            "Controlar produtos químicos e dosagens",
            "Registrar parâmetros"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Medição de parâmetros",
                instruction: "Medir pH e cloro livre com kit de teste.",
                why: "Controle de qualidade da água.",
                who: "Piscineiro",
                time_estimate_min: 5,
                safety: "Usar luvas.",
                quality_check: "pH entre 7.2-7.6, Cloro livre 1-3 ppm.",
                evidence: "Registro na planilha"
              },
              {
                id: "S2",
                title: "Ajuste de dosagens",
                instruction: "Ajustar dosagens de cloro, algicida ou clarificante conforme necessário.",
                why: "Manter parâmetros ideais.",
                who: "Piscineiro",
                time_estimate_min: 10,
                safety: "Não misturar produtos químicos.",
                quality_check: "Dosagens corretas aplicadas.",
                evidence: "Registro de produtos usados"
              },
              {
                id: "S3",
                title: "Registro",
                instruction: "Registrar parâmetros e produtos usados na planilha.",
                why: "Rastreabilidade e auditoria.",
                who: "Piscineiro",
                time_estimate_min: 3,
                safety: "N/A",
                quality_check: "Planilha atualizada.",
                evidence: "Planilha de parâmetros diários"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas", "Máscara", "Óculos"],
            tools: ["Kit de teste de pH e cloro"],
            consumables: ["Cloro", "Algicida", "Clarificante", "Barrilha"]
          },
          training: {
            modules: ["Balanceamento químico da água", "Segurança química", "Interpretação de testes"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Parâmetros dentro da faixa ideal",
              "Registros diários completos",
              "Zero reclamações por água turva"
            ],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "PISC_LIMP",
          name: "Limpeza física da piscina",
          objective: "Piscina limpa, sem resíduos visíveis.",
          scope: "Todas as piscinas do condomínio.",
          responsibilities: ["Aspirar fundo", "Peneirar superfície", "Limpar bordas"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Peneirar superfície",
                instruction: "Remover folhas e resíduos da superfície com peneira.",
                why: "Limpeza visual.",
                who: "Piscineiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Superfície limpa.",
                evidence: "Inspeção visual"
              },
              {
                id: "S2",
                title: "Aspirar fundo",
                instruction: "Aspirar o fundo da piscina com aspirador adequado.",
                why: "Remoção de sujeira depositada.",
                who: "Piscineiro",
                time_estimate_min: 20,
                safety: "Verificar mangueiras e conexões.",
                quality_check: "Fundo limpo.",
                evidence: "Água cristalina"
              },
              {
                id: "S3",
                title: "Limpar bordas",
                instruction: "Escovar e limpar bordas e linha d'água.",
                why: "Remover manchas e algas.",
                who: "Piscineiro",
                time_estimate_min: 10,
                safety: "Atenção ao deslocamento na borda.",
                quality_check: "Bordas limpas.",
                evidence: "Bordas sem manchas"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Botas"],
            tools: ["Aspirador", "Escova", "Peneira"],
            consumables: []
          },
          training: {
            modules: ["Técnicas de limpeza de piscinas", "Operação de aspiradores"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Piscina limpa diariamente", "Zero reclamações"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "PISC_MANUT",
          name: "Manutenção de equipamentos da piscina",
          objective: "Equipamentos funcionando corretamente.",
          scope: "Bombas, filtros e sistemas hidráulicos.",
          responsibilities: ["Realizar backwash", "Verificar vazamentos", "Inspecionar bomba"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Backwash do filtro",
                instruction: "Realizar retrolavagem do filtro conforme cronograma.",
                why: "Manter eficiência da filtragem.",
                who: "Piscineiro",
                time_estimate_min: 10,
                safety: "Desligar bomba antes de ajustar válvulas.",
                quality_check: "Água do backwash limpa.",
                evidence: "Registro de backwash"
              },
              {
                id: "S2",
                title: "Inspeção da bomba",
                instruction: "Verificar funcionamento, ruídos e vazamentos na bomba.",
                why: "Prevenir falhas.",
                who: "Piscineiro",
                time_estimate_min: 5,
                safety: "Não tocar em partes elétricas.",
                quality_check: "Bomba funcionando normalmente.",
                evidence: "Checklist de inspeção"
              },
              {
                id: "S3",
                title: "Verificação de vazamentos",
                instruction: "Inspecionar tubulações e conexões em busca de vazamentos.",
                why: "Economia de água e prevenção de danos.",
                who: "Piscineiro",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Sem vazamentos detectados.",
                evidence: "Relatório de inspeção"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas"],
            tools: ["Chaves", "Multímetro"],
            consumables: []
          },
          training: {
            modules: ["Manutenção do sistema hidráulico", "Operação de bombas e filtros"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Zero falhas de equipamentos", "Backwash semanal realizado"],
            audit_frequency_days: 30,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "PISC_5S",
          name: "Programa 5S - Piscineiro",
          objective: "Implementar metodologia 5S para melhorar organização, limpeza, padronização e disciplina na área de piscina.",
          scope: "Casa de máquinas, área de produtos químicos.",
          prerequisites: ["Comprometimento da equipe", "Materiais organizadores", "Tempo para implementação"],
          responsibilities: ["Piscineiro: Aplicar 5S diariamente", "Supervisor: Auditorias periódicas"],
          procedure: {
            steps: [
              {id: "S1", title: "Seiri - Senso de Utilização", instruction: "Descartar produtos químicos vencidos, equipamentos quebrados, embalagens vazias.", why: "Reduzir desperdício e facilitar acesso.", who: "Piscineiro", time_estimate_min: 30, safety: "Descartar químicos conforme FISPQ.", quality_check: "Apenas itens necessários permanecem.", evidence: "Lista de descarte"},
              {id: "S2", title: "Seiton - Senso de Organização", instruction: "Organizar produtos químicos por tipo em armário trancado, testes por frequência, criar identificação GHS.", why: "Facilitar acesso seguro.", who: "Piscineiro", time_estimate_min: 45, safety: "Produtos químicos separados e identificados.", quality_check: "Cada item tem lugar definido.", evidence: "Fotos e etiquetas"},
              {id: "S3", title: "Seiso - Senso de Limpeza", instruction: "Limpar casa de máquinas, equipamentos, área química. Identificar vazamentos e corrosões.", why: "Manter higiene e identificar problemas.", who: "Piscineiro", time_estimate_min: 60, safety: "Ventilar área.", quality_check: "Ambiente limpo, problemas identificados.", evidence: "Checklist de limpeza"},
              {id: "S4", title: "Seiketsu - Senso de Padronização", instruction: "Criar protocolo de armazenamento químico, checklist de segurança, FISPQ visível.", why: "Garantir conformidade de todos.", who: "Piscineiro + Supervisor", time_estimate_min: 30, safety: "Padrões incluem segurança química.", quality_check: "Procedimentos documentados.", evidence: "Checklists e FISPQ"},
              {id: "S5", title: "Shitsuke - Senso de Disciplina", instruction: "Inspeção diária de segurança química, auditoria mensal. Manter 5S como hábito.", why: "Transformar em cultura.", who: "Todos", time_estimate_min: 15, safety: "Reforçar práticas seguras.", quality_check: "Auditorias com resultados crescentes.", evidence: "Resultados de auditorias"}
            ]
          },
          equipment: {epc: [], epi: ["Luvas", "Óculos"], tools: ["Armário trancado", "Etiquetas GHS"], consumables: ["Etiquetas"]},
          training: {modules: ["Fundamentos 5S", "Práticas para piscineiro"], refresh_cadence_days: 180},
          review: {kpis: ["Pontuação 5S (0-100)", "Zero incidentes químicos"], audit_frequency_days: 30, auditor_role: "Supervisor"},
          versioning: {current_version: "01", last_review_date: "2025-11-13", changelog: ["Criação POP 5S Piscineiro"]}
        }
      ]
    },
    {
      id: "MANUT",
      name: "Manutenção",
      description: "Reparos elétricos, hidráulicos e preventivos.",
      icon: "Wrench",
      tags: ["manutenção", "elétrica", "hidráulica", "preventiva"],
      activities: [
        {
          id: "MANUT_ELET",
          name: "Manutenção elétrica básica",
          objective: "Executar reparos elétricos de baixa complexidade com segurança.",
          scope: "Áreas comuns do condomínio.",
          responsibilities: [
            "Substituir lâmpadas e tomadas",
            "Realizar testes de segurança",
            "Reportar falhas complexas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Desligamento do circuito",
                instruction: "Desligar circuito e testar ausência de tensão com multímetro.",
                why: "Segurança do profissional.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 3,
                safety: "Nunca trabalhar com circuito energizado.",
                quality_check: "Tensão zero confirmada.",
                evidence: "Leitura do multímetro"
              },
              {
                id: "S2",
                title: "Reparo",
                instruction: "Substituir lâmpadas, tomadas ou realizar reparo necessário.",
                why: "Restaurar funcionamento.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 10,
                safety: "Usar EPIs (luvas, óculos).",
                quality_check: "Componente substituído corretamente.",
                evidence: "Peça antiga removida"
              },
              {
                id: "S3",
                title: "Teste",
                instruction: "Religar circuito e testar funcionamento.",
                why: "Validar reparo.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 2,
                safety: "Verificar conexões antes de energizar.",
                quality_check: "Equipamento funcionando.",
                evidence: "Registro de teste"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas isolantes", "Óculos de proteção"],
            tools: ["Multímetro", "Alicate", "Chaves", "Fita isolante"],
            consumables: ["Lâmpadas", "Tomadas", "Interruptores"]
          },
          training: {
            modules: ["NR-10 básica", "Noções de elétrica", "Segurança no uso de ferramentas"],
            refresh_cadence_days: 730
          },
          review: {
            kpis: ["Taxa de resolução de falhas simples", "Zero acidentes"],
            audit_frequency_days: 30,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "MANUT_HIDR",
          name: "Manutenção hidráulica básica",
          objective: "Executar reparos hidráulicos de baixa complexidade.",
          scope: "Áreas comuns do condomínio.",
          responsibilities: [
            "Corrigir vazamentos simples",
            "Trocar vedações e sifões",
            "Reportar falhas complexas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Fechamento de registro",
                instruction: "Fechar registro e drenar água residual.",
                why: "Prevenir alagamentos.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 2,
                safety: "Verificar fechamento completo.",
                quality_check: "Sem fluxo de água.",
                evidence: "Registro fechado"
              },
              {
                id: "S2",
                title: "Reparo",
                instruction: "Corrigir vazamento ou trocar vedações conforme necessário.",
                why: "Restaurar funcionamento.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 15,
                safety: "Usar EPIs (luvas).",
                quality_check: "Vedação correta.",
                evidence: "Peça trocada"
              },
              {
                id: "S3",
                title: "Teste",
                instruction: "Reabrir registro e testar funcionamento.",
                why: "Validar reparo.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 3,
                safety: "Verificar vazamentos após abertura.",
                quality_check: "Sem vazamentos.",
                evidence: "Registro de teste"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas"],
            tools: ["Chaves inglesas", "Alicate", "Chave de fenda"],
            consumables: ["Vedações", "Sifões", "Fita veda rosca"]
          },
          training: {
            modules: ["Noções de hidráulica", "Segurança no uso de ferramentas"],
            refresh_cadence_days: 730
          },
          review: {
            kpis: ["Taxa de resolução de falhas simples", "Zero vazamentos após reparo"],
            audit_frequency_days: 30,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "MANUT_PREV",
          name: "Manutenção preventiva",
          objective: "Executar inspeções preventivas para identificar falhas antes que ocorram.",
          scope: "Áreas comuns do condomínio.",
          responsibilities: [
            "Executar checklist semanal",
            "Comunicar anomalias",
            "Solicitar técnico especializado se necessário"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Checklist semanal",
                instruction: "Executar checklist de iluminação, bombas, tomadas e equipamentos.",
                why: "Identificar falhas preventivamente.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 30,
                safety: "N/A",
                quality_check: "Checklist 100% preenchido.",
                evidence: "Checklist assinado"
              },
              {
                id: "S2",
                title: "Registro de anomalias",
                instruction: "Registrar e comunicar anomalias encontradas.",
                why: "Priorização de reparos.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 5,
                safety: "N/A",
                quality_check: "Anomalias documentadas.",
                evidence: "Relatório de anomalias"
              },
              {
                id: "S3",
                title: "Solicitação de suporte",
                instruction: "Solicitar técnico especializado se necessário.",
                why: "Resolver falhas complexas.",
                who: "Auxiliar de Manutenção",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Solicitação enviada.",
                evidence: "Registro de solicitação"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Multímetro", "Lanternas", "Checklist"],
            consumables: []
          },
          training: {
            modules: ["Inspeção preventiva", "Identificação de falhas"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Checklists 100% preenchidos", "Taxa de detecção preventiva"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "MANUT_5S",
          name: "Programa 5S - Manutenção",
          objective: "Implementar 5S para melhorar organização e eficiência na oficina de manutenção.",
          scope: "Oficina, bancada, depósito de ferramentas.",
          prerequisites: ["Comprometimento", "Materiais organizadores"],
          responsibilities: ["Auxiliar: Aplicar 5S", "Supervisor: Auditorias"],
          procedure: {
            steps: [
              {id: "S1", title: "Seiri", instruction: "Descartar peças quebradas, ferramentas obsoletas.", why: "Liberar espaço.", who: "Auxiliar", time_estimate_min: 30, safety: "Descarte adequado.", quality_check: "Apenas essencial.", evidence: "Lista descarte"},
              {id: "S2", title: "Seiton", instruction: "Shadow board para ferramentas, organizar por tipo.", why: "Facilitar busca.", who: "Auxiliar", time_estimate_min: 45, safety: "Ferramentas seguras.", quality_check: "Lugar definido.", evidence: "Fotos"},
              {id: "S3", title: "Seiso", instruction: "Limpar oficina, ferramentas, bancada.", why: "Higiene e identificação.", who: "Auxiliar", time_estimate_min: 60, safety: "EPIs.", quality_check: "Limpo.", evidence: "Checklist"},
              {id: "S4", title: "Seiketsu", instruction: "Checklist de ferramentas, padrão de bancada.", why: "Padronização.", who: "Auxiliar + Supervisor", time_estimate_min: 30, safety: "Segurança.", quality_check: "Documentado.", evidence: "Procedimentos"},
              {id: "S5", title: "Shitsuke", instruction: "Limpeza após uso, auditoria semanal.", why: "Hábito.", who: "Todos", time_estimate_min: 15, safety: "Práticas seguras.", quality_check: "Auditorias.", evidence: "Resultados"}
            ]
          },
          equipment: {epc: [], epi: ["Luvas"], tools: ["Shadow board", "Caixas"], consumables: ["Etiquetas"]},
          training: {modules: ["5S", "Práticas manutenção"], refresh_cadence_days: 180},
          review: {kpis: ["Pontuação 5S", "Tempo busca ferramentas"], audit_frequency_days: 30, auditor_role: "Supervisor"},
          versioning: {current_version: "01", last_review_date: "2025-11-13", changelog: ["Criação 5S Manutenção"]}
        }
      ]
    },
    {
      id: "CONC",
      name: "Concierge",
      description: "Atendimento personalizado a moradores.",
      icon: "UserCheck",
      tags: ["atendimento", "concierge", "reservas"],
      activities: [
        {
          id: "CONC_ATEND",
          name: "Atendimento personalizado",
          objective: "Oferecer atendimento personalizado e resolver solicitações dos moradores.",
          scope: "Área de concierge do condomínio.",
          responsibilities: [
            "Atender moradores presencialmente e via telefone",
            "Registrar e acompanhar demandas até a resolução",
            "Manter postura profissional"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Acolhimento",
                instruction: "Cumprimentar e identificar a solicitação do morador.",
                why: "Atendimento cordial e profissional.",
                who: "Concierge",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Solicitação compreendida.",
                evidence: "Registro inicial no sistema"
              },
              {
                id: "S2",
                title: "Registro",
                instruction: "Registrar no sistema (solicitante, assunto, prazo).",
                why: "Rastreabilidade e gestão.",
                who: "Concierge",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Registro completo.",
                evidence: "Ticket criado no sistema"
              },
              {
                id: "S3",
                title: "Encaminhamento",
                instruction: "Encaminhar demanda ao setor responsável.",
                why: "Resolução eficiente.",
                who: "Concierge",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Demanda encaminhada.",
                evidence: "Registro de encaminhamento"
              },
              {
                id: "S4",
                title: "Acompanhamento",
                instruction: "Retornar com solução ou status atualizado.",
                why: "Satisfação do morador.",
                who: "Concierge",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Morador informado.",
                evidence: "Registro de retorno"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Computador ou tablet", "Telefone ou interfone", "Sistema de gestão de solicitações"],
            consumables: []
          },
          training: {
            modules: [
              "Atendimento e etiqueta corporativa",
              "Comunicação escrita e verbal",
              "Gestão de sistemas condominiais"
            ],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Tempo médio de atendimento",
              "Satisfação dos moradores",
              "Taxa de resolução no primeiro contato"
            ],
            audit_frequency_days: 30,
            auditor_role: "Gerente de Zona"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "CONC_RESERV",
          name: "Gestão de reservas de espaços",
          objective: "Gerenciar reservas de espaços comuns conforme regras internas.",
          scope: "Áreas de lazer e espaços reserváveis do condomínio.",
          responsibilities: [
            "Verificar disponibilidade de espaços",
            "Confirmar e registrar agendamentos",
            "Comunicar regras de uso"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Solicitação",
                instruction: "Identificar espaço desejado e data/horário.",
                why: "Compreender necessidade.",
                who: "Concierge",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Informações completas.",
                evidence: "Registro de solicitação"
              },
              {
                id: "S2",
                title: "Verificação de disponibilidade",
                instruction: "Verificar disponibilidade no sistema de reservas.",
                why: "Evitar conflitos de agenda.",
                who: "Concierge",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Disponibilidade confirmada.",
                evidence: "Agenda consultada"
              },
              {
                id: "S3",
                title: "Confirmação e registro",
                instruction: "Confirmar e registrar agendamento conforme regras internas.",
                why: "Organização e rastreabilidade.",
                who: "Concierge",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Reserva confirmada e registrada.",
                evidence: "Registro na agenda"
              },
              {
                id: "S4",
                title: "Comunicação de regras",
                instruction: "Informar morador sobre regras de uso e responsabilidades.",
                why: "Cumprimento das normas.",
                who: "Concierge",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Morador informado.",
                evidence: "Termo de compromisso assinado (se aplicável)"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Computador ou tablet", "Sistema de reservas", "Agenda"],
            consumables: []
          },
          training: {
            modules: ["Gestão de reservas", "Comunicação de regras internas"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Cumprimento das regras de reservas",
              "Zero conflitos de agendamento"
            ],
            audit_frequency_days: 30,
            auditor_role: "Gerente de Zona"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "CONC_5S",
          name: "Programa 5S - Concierge",
          objective: "Implementar 5S para melhorar organização no atendimento.",
          scope: "Mesa de atendimento, arquivo.",
          prerequisites: ["Comprometimento", "Organizadores"],
          responsibilities: ["Concierge: Aplicar 5S", "Supervisor: Auditorias"],
          procedure: {
            steps: [
              {id: "S1", title: "Seiri", instruction: "Eliminar folhetos desatualizados, documentos antigos.", why: "Liberar espaço.", who: "Concierge", time_estimate_min: 30, safety: "N/A", quality_check: "Essencial.", evidence: "Lista"},
              {id: "S2", title: "Seiton", instruction: "Organizar agenda, contatos, material.", why: "Facilitar acesso.", who: "Concierge", time_estimate_min: 45, safety: "N/A", quality_check: "Definido.", evidence: "Fotos"},
              {id: "S3", title: "Seiso", instruction: "Limpar mesa, telefones, computador.", why: "Higiene.", who: "Concierge", time_estimate_min: 60, safety: "Produtos adequados.", quality_check: "Limpo.", evidence: "Checklist"},
              {id: "S4", title: "Seiketsu", instruction: "Padrão de atendimento, checklist.", why: "Padronização.", who: "Concierge + Supervisor", time_estimate_min: 30, safety: "N/A", quality_check: "Documentado.", evidence: "Procedimentos"},
              {id: "S5", title: "Shitsuke", instruction: "Revisão diária, feedback moradores.", why: "Hábito.", who: "Todos", time_estimate_min: 15, safety: "N/A", quality_check: "Auditorias.", evidence: "Resultados"}
            ]
          },
          equipment: {epc: [], epi: [], tools: ["Organizador mesa", "Arquivo"], consumables: ["Etiquetas"]},
          training: {modules: ["5S", "Práticas concierge"], refresh_cadence_days: 180},
          review: {kpis: ["Pontuação 5S", "Tempo atendimento"], audit_frequency_days: 30, auditor_role: "Supervisor"},
          versioning: {current_version: "01", last_review_date: "2025-11-13", changelog: ["Criação 5S Concierge"]}
        }
      ]
    },
    {
      id: "ADM",
      name: "Administrador Dedicado",
      description: "Gestão administrativa, financeira e contratual.",
      icon: "Briefcase",
      tags: ["administração", "financeiro", "contratos"],
      activities: [
        {
          id: "ADM_FIN",
          name: "Gestão financeira",
          objective: "Gerir processos financeiros do condomínio com eficiência e transparência.",
          scope: "Administração financeira do condomínio.",
          responsibilities: [
            "Elaborar relatórios mensais e controlar orçamento",
            "Atualizar previsão orçamentária",
            "Emitir prestação de contas"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Consolidação de receitas e despesas",
                instruction: "Consolidar receitas e despesas do mês.",
                why: "Controle financeiro.",
                who: "Administrador Dedicado",
                time_estimate_min: 60,
                safety: "N/A",
                quality_check: "Dados completos e corretos.",
                evidence: "Relatório financeiro mensal"
              },
              {
                id: "S2",
                title: "Atualização orçamentária",
                instruction: "Atualizar previsão orçamentária e fluxo de caixa.",
                why: "Planejamento financeiro.",
                who: "Administrador Dedicado",
                time_estimate_min: 30,
                safety: "N/A",
                quality_check: "Projeções atualizadas.",
                evidence: "Planilha orçamentária"
              },
              {
                id: "S3",
                title: "Prestação de contas",
                instruction: "Emitir relatório financeiro e prestação de contas para o síndico.",
                why: "Transparência e governança.",
                who: "Administrador Dedicado",
                time_estimate_min: 30,
                safety: "N/A",
                quality_check: "Relatório completo e claro.",
                evidence: "Relatório aprovado pelo síndico"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Computador", "Sistema administrativo", "Planilhas", "Documentos fiscais"],
            consumables: []
          },
          training: {
            modules: ["Gestão financeira condominial", "Legislação e compliance", "Comunicação executiva"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Aderência ao orçamento",
              "Pontualidade na prestação de contas",
              "Feedback do síndico e da diretoria"
            ],
            audit_frequency_days: 30,
            auditor_role: "Gerente Geral"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ADM_CONTR",
          name: "Gestão de contratos",
          objective: "Supervisionar fornecedores e contratos do condomínio.",
          scope: "Administração de contratos do condomínio.",
          responsibilities: [
            "Revisar contratos e fornecedores",
            "Acompanhar vencimentos",
            "Negociar renovações"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Revisão de contratos",
                instruction: "Revisar contratos vigentes e vencimentos próximos.",
                why: "Planejamento de renovações.",
                who: "Administrador Dedicado",
                time_estimate_min: 30,
                safety: "N/A",
                quality_check: "Contratos revisados.",
                evidence: "Planilha de contratos atualizada"
              },
              {
                id: "S2",
                title: "Avaliação de fornecedores",
                instruction: "Avaliar desempenho de fornecedores e identificar oportunidades de melhoria.",
                why: "Qualidade dos serviços.",
                who: "Administrador Dedicado",
                time_estimate_min: 20,
                safety: "N/A",
                quality_check: "Avaliação documentada.",
                evidence: "Relatório de avaliação"
              },
              {
                id: "S3",
                title: "Negociação e renovação",
                instruction: "Negociar renovações e aprovar com síndico antes da assinatura.",
                why: "Melhores condições contratuais.",
                who: "Administrador Dedicado",
                time_estimate_min: 60,
                safety: "N/A",
                quality_check: "Contratos renovados no prazo.",
                evidence: "Contratos assinados"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Computador", "Repositório de arquivos digitais", "Sistema administrativo"],
            consumables: []
          },
          training: {
            modules: ["Gestão de contratos", "Negociação", "Legislação trabalhista e tributária"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Contratos renovados no prazo",
              "Redução de custos contratuais",
              "Satisfação com fornecedores"
            ],
            audit_frequency_days: 90,
            auditor_role: "Gerente Geral"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ADM_ASSEMB",
          name: "Assembleias e comunicações",
          objective: "Preparar assembleias e gerir comunicações com moradores.",
          scope: "Comunicação interna do condomínio.",
          responsibilities: [
            "Preparar pauta de assembleias",
            "Redigir comunicados",
            "Atuar como elo entre síndico e empresa"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Preparação de pauta",
                instruction: "Preparar pauta de assembleia com síndico e diretoria.",
                why: "Organização da assembleia.",
                who: "Administrador Dedicado",
                time_estimate_min: 30,
                safety: "N/A",
                quality_check: "Pauta completa e aprovada.",
                evidence: "Documento de pauta"
              },
              {
                id: "S2",
                title: "Convocação",
                instruction: "Convocar moradores conforme regras do regimento interno.",
                why: "Cumprimento legal.",
                who: "Administrador Dedicado",
                time_estimate_min: 15,
                safety: "N/A",
                quality_check: "Convocação enviada no prazo.",
                evidence: "Registro de convocação"
              },
              {
                id: "S3",
                title: "Ata e comunicações",
                instruction: "Redigir ata da assembleia e comunicar decisões aos moradores.",
                why: "Transparência e informação.",
                who: "Administrador Dedicado",
                time_estimate_min: 30,
                safety: "N/A",
                quality_check: "Ata completa e comunicada.",
                evidence: "Ata assinada e publicada"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: [],
            tools: ["Computador", "Sistema de comunicação", "Editor de texto"],
            consumables: []
          },
          training: {
            modules: ["Gestão de assembleias", "Comunicação escrita", "Legislação condominial"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: [
              "Assembleias realizadas no prazo",
              "Atas publicadas em até 3 dias",
              "Satisfação dos moradores"
            ],
            audit_frequency_days: 90,
            auditor_role: "Gerente Geral"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "ADM_5S",
          name: "Programa 5S - Administração",
          objective: "Implementar 5S para organização administrativa.",
          scope: "Escritório, arquivo físico e digital.",
          prerequisites: ["Comprometimento", "Sistema backup"],
          responsibilities: ["Administrador: Aplicar 5S", "Gerente: Auditorias"],
          procedure: {
            steps: [
              {id: "S1", title: "Seiri", instruction: "Eliminar documentos antigos (conforme retenção legal), duplicatas.", why: "Liberar espaço.", who: "Administrador", time_estimate_min: 30, safety: "Conformidade legal.", quality_check: "Essencial.", evidence: "Lista"},
              {id: "S2", title: "Seiton", instruction: "Organizar pastas, arquivos digitais, nomenclatura.", why: "Facilitar busca.", who: "Administrador", time_estimate_min: 45, safety: "Backup.", quality_check: "Definido.", evidence: "Estrutura"},
              {id: "S3", title: "Seiso", instruction: "Limpar escritório, equipamentos, arquivo. Organizar e-mails.", why: "Higiene física e digital.", who: "Administrador", time_estimate_min: 60, safety: "N/A", quality_check: "Limpo.", evidence: "Checklist"},
              {id: "S4", title: "Seiketsu", instruction: "Protocolo nomenclatura, política retenção.", why: "Padronização.", who: "Administrador + Gerente", time_estimate_min: 30, safety: "Conformidade.", quality_check: "Documentado.", evidence: "Políticas"},
              {id: "S5", title: "Shitsuke", instruction: "Revisão mensal arquivos, auditoria trimestral.", why: "Hábito.", who: "Todos", time_estimate_min: 15, safety: "N/A", quality_check: "Auditorias.", evidence: "Resultados"}
            ]
          },
          equipment: {epc: [], epi: [], tools: ["Arquivo deslizante", "Backup digital"], consumables: ["Etiquetas"]},
          training: {modules: ["5S", "Gestão documental"], refresh_cadence_days: 180},
          review: {kpis: ["Pontuação 5S", "Tempo busca documentos"], audit_frequency_days: 30, auditor_role: "Gerente"},
          versioning: {current_version: "01", last_review_date: "2025-11-13", changelog: ["Criação 5S Administração"]}
        }
      ]
    }
  ]
};
