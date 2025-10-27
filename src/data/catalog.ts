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
          name: "Controle de acesso de veículos",
          objective: "Controlar o fluxo de veículos, garantindo segurança e rastreabilidade das entradas e saídas.",
          scope: "Garagem e portões de acesso veicular.",
          responsibilities: [
            "Registrar e monitorar entradas e saídas",
            "Verificar autorizações e comunicar o morador",
            "Orientar normas de circulação/estacionamento"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Checagem de autorização",
                instruction: "Verificar autorização e destino antes de abrir o portão.",
                why: "Garantir segurança patrimonial.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Manter visibilidade do veículo.",
                quality_check: "Autorização confirmada.",
                evidence: "Registro de placa e autorização"
              },
              {
                id: "S2",
                title: "Registro",
                instruction: "Registrar placa, condutor, horário e unidade.",
                why: "Rastreabilidade completa.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Posicionar-se em local seguro.",
                quality_check: "Campos obrigatórios preenchidos.",
                evidence: "Linha no sistema com placa e timestamp"
              },
              {
                id: "S3",
                title: "Liberação e orientação",
                instruction: "Abrir portão e orientar local de estacionamento.",
                why: "Organização do espaço.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Sinalizar abertura do portão.",
                quality_check: "Acesso liberado.",
                evidence: "Log de abertura do portão"
              }
            ]
          },
          equipment: {
            epc: ["Cancela automática", "Câmeras"],
            epi: [],
            tools: ["Rádio", "Sistema de controle"],
            consumables: ["Etiquetas/crachás estacionamento"]
          },
          training: {
            modules: ["Procedimentos de acesso veicular", "Comunicação e mediação"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Registros sem falha", "Tempo de resposta"],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
          }
        },
        {
          id: "PORT_CORRESP",
          name: "Recebimento de correspondências e encomendas",
          objective: "Receber, registrar e entregar itens com segurança e rastreabilidade.",
          scope: "Portaria e área de armazenamento.",
          responsibilities: [
            "Receber e registrar",
            "Armazenar em local seguro",
            "Entregar ao destinatário com confirmação"
          ],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Conferência",
                instruction: "Conferir nome/unidade e condição do item.",
                why: "Evitar extravios e danos.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Verificar embalagem íntegra.",
                quality_check: "Item sem avarias.",
                evidence: "Foto do item (opcional)"
              },
              {
                id: "S2",
                title: "Registro",
                instruction: "Registrar data, hora, remetente e destinatário.",
                why: "Rastreabilidade completa.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "Manter organização.",
                quality_check: "Registro completo no sistema.",
                evidence: "Linha no log de correspondências"
              },
              {
                id: "S3",
                title: "Notificação e entrega",
                instruction: "Avisar destinatário e entregar mediante identificação/assinatura.",
                why: "Confirmação de recebimento.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Validar identidade do recebedor.",
                quality_check: "Assinatura/confirmação registrada.",
                evidence: "Protocolo de entrega"
              }
            ]
          },
          equipment: {
            epc: ["Armário identificado"],
            epi: [],
            tools: ["Sistema de registro"],
            consumables: ["Formulários de retirada"]
          },
          training: {
            modules: ["Recebimento seguro", "Organização e registro"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["0 divergências de entrega", "Tempo médio de notificação"],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Portaria"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-27",
            changelog: ["Migração completa dos templates POP"]
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
        }
      ]
    }
  ]
};
