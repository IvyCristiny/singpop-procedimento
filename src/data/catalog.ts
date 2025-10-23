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
            last_review_date: "2025-10-23",
            changelog: ["Conversão para modelo detalhado com steps"]
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
              },
              {
                id: "S4",
                title: "Bloqueio se necessário",
                instruction: "Negar acesso não autorizado e acionar supervisão.",
                why: "Protocolo de segurança.",
                who: "Porteiro",
                time_estimate_min: 2,
                safety: "Manter postura profissional.",
                quality_check: "Ocorrência registrada.",
                evidence: "Relatório de tentativa de acesso"
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
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial"]
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
                title: "Armazenamento",
                instruction: "Guardar em armário identificado e seguro.",
                why: "Proteção contra furto/dano.",
                who: "Porteiro",
                time_estimate_min: 0.5,
                safety: "Não empilhar itens frágeis.",
                quality_check: "Item localizado corretamente.",
                evidence: "Número do compartimento"
              },
              {
                id: "S4",
                title: "Notificação",
                instruction: "Avisar destinatário (interfone/app).",
                why: "Agilizar retirada.",
                who: "Porteiro",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Morador notificado.",
                evidence: "Status 'notificado' no sistema"
              },
              {
                id: "S5",
                title: "Entrega",
                instruction: "Entregar mediante identificação/assinatura.",
                why: "Confirmação de recebimento.",
                who: "Porteiro",
                time_estimate_min: 1,
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
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial"]
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
          objective: "Hall limpo, organizado e agradável.",
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
                title: "Sinalizar",
                instruction: "Colocar placa de Piso Molhado.",
                why: "Prevenir acidentes.",
                who: "ASG",
                time_estimate_min: 1,
                safety: "Posicionar placas visíveis.",
                quality_check: "Sinalização adequada.",
                evidence: "Placas posicionadas"
              },
              {
                id: "S2",
                title: "Preparar",
                instruction: "Reunir mop, panos, balde e produto neutro.",
                why: "Eficiência operacional.",
                who: "ASG",
                time_estimate_min: 2,
                safety: "EPIs vestidos.",
                quality_check: "Kit completo.",
                evidence: "Checklist de materiais"
              },
              {
                id: "S3",
                title: "Varrer",
                instruction: "Remover resíduos visíveis.",
                why: "Preparação da superfície.",
                who: "ASG",
                time_estimate_min: 3,
                safety: "Atenção a objetos cortantes.",
                quality_check: "Piso sem resíduos.",
                evidence: "Inspeção visual"
              },
              {
                id: "S4",
                title: "Higienizar",
                instruction: "Mop úmido com produto neutro em toda a área.",
                why: "Remoção de sujeira.",
                who: "ASG",
                time_estimate_min: 10,
                safety: "Produto diluído corretamente.",
                quality_check: "Cobertura completa.",
                evidence: "Piso brilhante"
              },
              {
                id: "S5",
                title: "Vidros/Metais",
                instruction: "Limpar espelhos/portas/superfícies metálicas.",
                why: "Acabamento visual.",
                who: "ASG",
                time_estimate_min: 5,
                safety: "Não usar produtos abrasivos.",
                quality_check: "Sem manchas.",
                evidence: "Superfícies transparentes"
              },
              {
                id: "S6",
                title: "Finalizar",
                instruction: "Retirar sinalização após secagem total.",
                why: "Liberar área.",
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
            tools: ["Mop", "Balde", "Panos de microfibra"],
            consumables: ["Detergente neutro", "Limpa vidros"]
          },
          training: {
            modules: ["Técnicas de limpeza", "Segurança química"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Checklist diário 100%", "Zero reclamações"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial"]
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
                title: "Sinalizar e EPI",
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
                title: "Lixo",
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
                title: "Desinfetar",
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
                title: "Enxaguar e Secar",
                instruction: "Remover produto e secar com pano limpo.",
                why: "Finalização.",
                who: "ASG",
                time_estimate_min: 5,
                safety: "Não misturar produtos.",
                quality_check: "Sem resíduos.",
                evidence: "Superfícies secas"
              },
              {
                id: "S5",
                title: "Repor",
                instruction: "Papel, sabonete e toalhas repostos.",
                why: "Disponibilidade para usuários.",
                who: "ASG",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Insumos completos.",
                evidence: "Dispensers cheios"
              },
              {
                id: "S6",
                title: "Ventilar",
                instruction: "Deixar portas semiabertas para ventilação.",
                why: "Secagem e renovação do ar.",
                who: "ASG",
                time_estimate_min: 1,
                safety: "N/A",
                quality_check: "Ar renovado.",
                evidence: "Sem odor desagradável"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização"],
            epi: ["Luvas", "Botas", "Óculos"],
            tools: ["Escova", "Panos"],
            consumables: ["Desinfetante", "Detergente", "Sacos de lixo"]
          },
          training: {
            modules: ["Higienização de banheiros", "EPIs e segurança química"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Sem odor", "Insumos OK", "Zero reclamações"],
            audit_frequency_days: 1,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial"]
          }
        },
        {
          id: "ASG_GAR",
          name: "Limpeza de garagem",
          objective: "Garagem limpa, segura e sem manchas críticas.",
          scope: "Áreas de estacionamento.",
          responsibilities: ["Varrição/lavagem conforme cronograma", "Sinalização de molhado", "Uso racional de água"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Varrição",
                instruction: "Retirar resíduos e varrer toda a área.",
                why: "Preparação.",
                who: "ASG",
                time_estimate_min: 15,
                safety: "Atenção a veículos.",
                quality_check: "Sem resíduos visíveis.",
                evidence: "Piso varrido"
              },
              {
                id: "S2",
                title: "Manchas",
                instruction: "Aplicar detergente em manchas de óleo e esfregar.",
                why: "Remoção de sujeira pesada.",
                who: "ASG",
                time_estimate_min: 10,
                safety: "Produto adequado para óleo.",
                quality_check: "Manchas reduzidas.",
                evidence: "Área tratada"
              },
              {
                id: "S3",
                title: "Enxágue controlado",
                instruction: "Enxaguar com água moderada e drenar.",
                why: "Remoção de produto.",
                who: "ASG",
                time_estimate_min: 20,
                safety: "Uso racional de água.",
                quality_check: "Drenagem adequada.",
                evidence: "Piso enxaguado"
              },
              {
                id: "S4",
                title: "Sinalização",
                instruction: "Placas de área molhada até secagem completa.",
                why: "Segurança.",
                who: "ASG",
                time_estimate_min: 2,
                safety: "Placas visíveis.",
                quality_check: "Sinalização adequada.",
                evidence: "Placas posicionadas"
              }
            ]
          },
          equipment: {
            epc: ["Sinalização"],
            epi: ["Botas"],
            tools: ["Vassoura", "Escova", "Mangueira"],
            consumables: ["Detergente neutro", "Desengraxante"]
          },
          training: {
            modules: ["Limpeza de áreas externas", "Uso racional de água"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Sem manchas persistentes", "Consumo de água controlado"],
            audit_frequency_days: 7,
            auditor_role: "Zelador"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial"]
          }
        }
      ]
    },
    {
      id: "JARD",
      name: "Jardinagem",
      description: "Cuidados de paisagismo e áreas verdes.",
      icon: "Trees",
      tags: ["jardim", "paisagismo", "áreas verdes"],
      activities: [
        {
          id: "JARD_PODA",
          name: "Poda de arbustos e plantas",
          objective: "Manter estética e saúde das espécies por podas adequadas.",
          scope: "Áreas verdes e jardins.",
          responsibilities: ["Podas seguras e periódicas", "Proteger as plantas", "Destino correto de resíduos"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "EPI",
                instruction: "Vestir luvas, botas e óculos.",
                why: "Proteção individual.",
                who: "Jardineiro",
                time_estimate_min: 1,
                safety: "EPIs obrigatórios.",
                quality_check: "EPIs completos.",
                evidence: "Registro visual"
              },
              {
                id: "S2",
                title: "Análise",
                instruction: "Identificar tipo de planta e cortes necessários.",
                why: "Poda adequada à espécie.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "Conhecer a espécie.",
                quality_check: "Planejamento correto.",
                evidence: "Lista de plantas"
              },
              {
                id: "S3",
                title: "Execução",
                instruction: "Usar tesoura/serrote adequado e remover galhos secos/excesso.",
                why: "Saúde da planta.",
                who: "Jardineiro",
                time_estimate_min: 20,
                safety: "Ferramentas afiadas.",
                quality_check: "Cortes limpos.",
                evidence: "Plantas podadas"
              },
              {
                id: "S4",
                title: "Limpeza",
                instruction: "Recolher resíduos e destinar corretamente.",
                why: "Organização e limpeza.",
                who: "Jardineiro",
                time_estimate_min: 10,
                safety: "Não deixar resíduos no chão.",
                quality_check: "Área limpa.",
                evidence: "Sacos com resíduos"
              },
              {
                id: "S5",
                title: "Pós-poda",
                instruction: "Adubar e irrigar conforme necessidade.",
                why: "Recuperação da planta.",
                who: "Jardineiro",
                time_estimate_min: 10,
                safety: "Dosagem correta.",
                quality_check: "Planta nutrida.",
                evidence: "Adubo aplicado"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Luvas", "Óculos", "Botas"],
            tools: ["Tesoura de poda", "Serrote", "Ancinho"],
            consumables: ["Sacos verdes", "Adubo", "Fertilizante"]
          },
          training: {
            modules: ["Técnicas de poda", "Irrigação", "Ferramentas cortantes"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Avaliação quinzenal estética/saúde", "Zero danos às plantas"],
            audit_frequency_days: 15,
            auditor_role: "Supervisor de Jardinagem"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial detalhada"]
          }
        },
        {
          id: "JARD_IRRIG",
          name: "Irrigação de áreas verdes",
          objective: "Garantir hidratação adequada das plantas.",
          scope: "Todas as áreas verdes.",
          responsibilities: ["Irrigação programada", "Manutenção de equipamentos", "Uso racional de água"],
          procedure: {
            steps: [
              {
                id: "S1",
                title: "Verificar sistema",
                instruction: "Checar funcionamento de aspersores e mangueiras.",
                why: "Evitar desperdício.",
                who: "Jardineiro",
                time_estimate_min: 5,
                safety: "Verificar vazamentos.",
                quality_check: "Sistema operacional.",
                evidence: "Checklist de equipamentos"
              },
              {
                id: "S2",
                title: "Irrigar",
                instruction: "Ligar sistema ou irrigar manualmente conforme cronograma.",
                why: "Hidratação das plantas.",
                who: "Jardineiro",
                time_estimate_min: 30,
                safety: "Evitar encharcamento.",
                quality_check: "Cobertura uniforme.",
                evidence: "Solo úmido"
              },
              {
                id: "S3",
                title: "Registrar",
                instruction: "Anotar horário e duração da irrigação.",
                why: "Controle de atividades.",
                who: "Jardineiro",
                time_estimate_min: 2,
                safety: "N/A",
                quality_check: "Registro completo.",
                evidence: "Planilha atualizada"
              }
            ]
          },
          equipment: {
            epc: [],
            epi: ["Botas"],
            tools: ["Mangueira", "Aspersores", "Timer"],
            consumables: ["Água"]
          },
          training: {
            modules: ["Técnicas de irrigação", "Uso racional de água"],
            refresh_cadence_days: 365
          },
          review: {
            kpis: ["Consumo de água controlado", "Plantas saudáveis"],
            audit_frequency_days: 30,
            auditor_role: "Supervisor de Jardinagem"
          },
          versioning: {
            current_version: "01",
            last_review_date: "2025-10-23",
            changelog: ["Versão inicial"]
          }
        }
      ]
    }
  ]
};
