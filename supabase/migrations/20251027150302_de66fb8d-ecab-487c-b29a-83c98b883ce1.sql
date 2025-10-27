-- Sincronizar catalog com todas as 9 funções e 28 atividades do defaultCatalog

-- Deletar dados antigos
DELETE FROM catalog;

-- Inserir catálogo completo atualizado com 9 funções e 28 atividades
INSERT INTO catalog (catalog_data, version, last_modified_by)
VALUES (
  '{
    "functions": [
      {
        "id": "PORT",
        "name": "Portaria / Controle de Acesso",
        "activities": [
          {
            "id": "PORT_PED",
            "name": "POP 01 - Controle de Acesso de Pedestres",
            "objective": "Garantir a segurança do condomínio através do controle rigoroso de entrada e saída de moradores, visitantes, prestadores de serviço e entregas.",
            "scope": "Aplica-se a todos os acessos de pedestres do Residencial Praça da Luz, incluindo portões sociais, de serviço e garagens.",
            "responsibilities": "Porteiro: Executar o controle conforme procedimentos.\\nSupervisor: Verificar cumprimento e registro de acessos.",
            "procedure": {
              "steps": [
                {
                  "instruction": "Identificar a pessoa que solicita entrada (morador, visitante ou prestador de serviço)",
                  "why": "Para aplicar o protocolo de segurança adequado a cada tipo de acesso",
                  "who": "Porteiro",
                  "time": "30 segundos",
                  "safety": "Manter distância segura até identificação completa",
                  "quality_check": "Confirmar identidade visual e/ou documento",
                  "evidence": "Registro em livro/sistema"
                },
                {
                  "instruction": "Solicitar documento de identificação com foto (RG, CNH ou carteirinha do condomínio)",
                  "why": "Para comprovar a identidade e ter registro documental em caso de necessidade",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Não devolver o documento antes de concluir o registro",
                  "quality_check": "Verificar se foto corresponde à pessoa e se documento está válido",
                  "evidence": "Cópia ou foto do documento (conforme política)"
                },
                {
                  "instruction": "Consultar autorização prévia ou ligar para o morador solicitando liberação",
                  "why": "Para garantir que apenas pessoas autorizadas tenham acesso ao condomínio",
                  "who": "Porteiro",
                  "time": "2-3 minutos",
                  "safety": "Em caso de recusa do morador, negar acesso educadamente",
                  "quality_check": "Confirmar nome completo do visitante com o morador",
                  "evidence": "Anotação do nome do morador que autorizou e horário"
                },
                {
                  "instruction": "Registrar entrada com nome completo, RG, unidade visitada e horário",
                  "why": "Para manter histórico de acessos e rastreabilidade em caso de incidentes",
                  "who": "Porteiro",
                  "time": "1-2 minutos",
                  "safety": "Manter livro de registro em local protegido e acessível apenas à equipe",
                  "quality_check": "Letra legível, dados completos e corretos",
                  "evidence": "Livro de registro ou sistema eletrônico com data/hora"
                },
                {
                  "instruction": "Orientar sobre localização e aguardar confirmação de saída para registrar horário",
                  "why": "Para auxiliar o visitante e manter controle completo do tempo de permanência",
                  "who": "Porteiro",
                  "time": "1 minuto + tempo de permanência",
                  "safety": "Informar sobre áreas restritas e normas do condomínio",
                  "quality_check": "Visitante compreendeu as orientações",
                  "evidence": "Registro de saída com horário no mesmo documento de entrada"
                }
              ]
            },
            "equipment": {
              "epc": ["Interfone", "Sistema de CFTV", "Livro de registro ou tablet"],
              "epi": [],
              "tools": ["Caneta", "Prancheta"],
              "consumables": ["Papel para registro"]
            },
            "training": {
              "modules": ["Técnicas de abordagem", "Uso de sistemas de controle", "Procedimentos de segurança"],
              "cadence": "Reciclagem semestral"
            },
            "review": {
              "kpis": ["Tempo médio de liberação", "Índice de acessos não autorizados", "Conformidade nos registros"],
              "frequency": "Auditoria mensal"
            }
          },
          {
            "id": "PORT_VEIC",
            "name": "POP 02 - Controle de Acesso de Veículos",
            "objective": "Definir o procedimento para entrada, permanência e saída de veículos, garantindo controle, segurança e rastreabilidade de todas as movimentações.",
            "scope": "Aplica-se às portarias e áreas de controle de acesso do Residencial Praça da Luz que realizam o monitoramento de veículos.",
            "responsibilities": "Porteiro: Controlar acessos conforme cadastro e autorização prévia.\\nSupervisor: Garantir o funcionamento dos equipamentos de controle e acompanhar o cumprimento dos registros.",
            "procedure": {
              "steps": [
                {
                  "instruction": "Identificar o condutor e confirmar autorização de acesso",
                  "why": "Para garantir que apenas veículos autorizados entrem no condomínio",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Verificar se há autorização prévia ou se é morador cadastrado",
                  "quality_check": "Confirmação de identidade do condutor e autorização",
                  "evidence": "Registro no sistema ou planilha"
                },
                {
                  "instruction": "Conferir placa, destino e horário previsto de permanência",
                  "why": "Para manter rastreabilidade e controle do tempo de permanência",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Anotar placa completa e unidade de destino",
                  "quality_check": "Dados conferidos e corretos",
                  "evidence": "Planilha de controle de veículos"
                },
                {
                  "instruction": "Registrar dados no sistema ou planilha de controle",
                  "why": "Para documentar todas as movimentações e facilitar auditorias",
                  "who": "Porteiro",
                  "time": "1-2 minutos",
                  "safety": "Manter registros atualizados e legíveis",
                  "quality_check": "Todos os campos obrigatórios preenchidos",
                  "evidence": "Sistema eletrônico ou livro de registro"
                },
                {
                  "instruction": "Abrir o portão apenas após confirmação da autorização",
                  "why": "Para evitar entrada de veículos não autorizados",
                  "who": "Porteiro",
                  "time": "30 segundos",
                  "safety": "Aguardar confirmação total antes de acionar o portão",
                  "quality_check": "Autorização confirmada",
                  "evidence": "Registro de entrada com horário"
                },
                {
                  "instruction": "Garantir que o portão esteja totalmente fechado antes de liberar o próximo veículo",
                  "why": "Para evitar entrada de veículos não autorizados por tailgating",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Monitorar fechamento completo via CFTV ou visualmente",
                  "quality_check": "Portão completamente fechado",
                  "evidence": "Observação visual ou câmera"
                },
                {
                  "instruction": "Em caso de dúvida ou divergência, comunicar imediatamente a supervisão",
                  "why": "Para garantir que situações atípicas sejam tratadas adequadamente",
                  "who": "Porteiro",
                  "time": "Conforme necessário",
                  "safety": "Não liberar acesso em caso de dúvida",
                  "quality_check": "Supervisão informada",
                  "evidence": "Registro de ocorrência"
                }
              ]
            },
            "equipment": {
              "epc": ["Sistema de controle de portão", "CFTV", "Interfone"],
              "epi": [],
              "tools": ["Planilha ou sistema eletrônico"],
              "consumables": ["Papel para registro"]
            },
            "training": {
              "modules": ["Operação de sistemas de controle", "Procedimentos de segurança veicular"],
              "cadence": "Reciclagem semestral"
            },
            "review": {
              "kpis": ["Tempo médio de liberação", "Conformidade nos registros", "Incidentes de segurança"],
              "frequency": "Auditoria mensal"
            }
          },
          {
            "id": "PORT_CORRESP",
            "name": "POP 03 - Recebimento de Correspondências e Encomendas",
            "objective": "Garantir o correto recebimento, conferência, registro, armazenamento e entrega de correspondências e encomendas, evitando extravios e falhas no processo.",
            "scope": "Aplica-se a todas as portarias e áreas responsáveis pelo recebimento e controle de entregas do Residencial Praça da Luz.",
            "responsibilities": "Porteiro: Receber, conferir e armazenar os itens com segurança.\\nSupervisor: Verificar as condições de armazenamento e garantir o cumprimento dos registros.",
            "procedure": {
              "steps": [
                {
                  "instruction": "Receber entregas apenas de entregadores devidamente identificados",
                  "why": "Para garantir que apenas entregadores legítimos tenham acesso",
                  "who": "Porteiro",
                  "time": "30 segundos",
                  "safety": "Solicitar identificação do entregador e empresa",
                  "quality_check": "Identificação verificada",
                  "evidence": "Registro do nome do entregador"
                },
                {
                  "instruction": "Conferir o nome e unidade do destinatário antes de aceitar o recebimento",
                  "why": "Para evitar recebimento de encomendas destinadas a endereços incorretos",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Verificar se destinatário é morador cadastrado",
                  "quality_check": "Nome e unidade conferidos",
                  "evidence": "Dados registrados na planilha"
                },
                {
                  "instruction": "Registrar data, hora, nome do entregador e destinatário",
                  "why": "Para manter rastreabilidade completa de todas as entregas",
                  "who": "Porteiro",
                  "time": "1-2 minutos",
                  "safety": "Manter registros atualizados e legíveis",
                  "quality_check": "Todos os campos preenchidos corretamente",
                  "evidence": "Livro ou planilha de controle"
                },
                {
                  "instruction": "Armazenar os itens em local seguro e identificado",
                  "why": "Para evitar extravios e facilitar localização na retirada",
                  "who": "Porteiro",
                  "time": "2 minutos",
                  "safety": "Local de acesso restrito, limpo e organizado",
                  "quality_check": "Item identificado com nome e unidade",
                  "evidence": "Etiqueta de identificação"
                },
                {
                  "instruction": "Comunicar o destinatário sobre a chegada da encomenda",
                  "why": "Para que o morador tenha conhecimento e possa retirar brevemente",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Utilizar interfone ou sistema de comunicação",
                  "quality_check": "Destinatário informado",
                  "evidence": "Registro de comunicação"
                },
                {
                  "instruction": "Solicitar assinatura de retirada ao entregar ao destinatário",
                  "why": "Para comprovar que a entrega foi realizada corretamente",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Confirmar identidade do destinatário",
                  "quality_check": "Assinatura e documento verificados",
                  "evidence": "Assinatura no livro de controle"
                }
              ]
            },
            "equipment": {
              "epc": ["Interfone", "Local de armazenamento"],
              "epi": [],
              "tools": ["Etiquetas de identificação", "Livro de registro"],
              "consumables": ["Etiquetas", "Papel"]
            },
            "training": {
              "modules": ["Procedimentos de recebimento", "Organização e armazenamento"],
              "cadence": "Reciclagem semestral"
            },
            "review": {
              "kpis": ["Índice de extravios", "Tempo médio de armazenamento", "Conformidade nos registros"],
              "frequency": "Auditoria mensal"
            }
          },
          {
            "id": "PORT_ATEND",
            "name": "POP 04 - Atendimento e Postura Profissional",
            "objective": "Padronizar a conduta, apresentação pessoal e comunicação dos colaboradores da portaria, assegurando atendimento cordial, empático e imagem institucional positiva.",
            "scope": "Aplica-se a todos os colaboradores que atuam na recepção, portaria e controle de acesso do Residencial Praça da Luz.",
            "responsibilities": "Porteiro: Cumprir as normas de conduta e apresentação.\\nSupervisor: Avaliar periodicamente o comportamento e postura dos colaboradores.",
            "procedure": {
              "steps": [
                {
                  "instruction": "Apresentar-se uniformizado, identificado e com boa higiene pessoal",
                  "why": "Para transmitir profissionalismo e credibilidade",
                  "who": "Porteiro",
                  "time": "Início do turno",
                  "safety": "Uniforme limpo e completo, crachá visível",
                  "quality_check": "Inspeção visual pelo supervisor",
                  "evidence": "Checklist de apresentação"
                },
                {
                  "instruction": "Manter postura ereta, linguagem formal e tom de voz adequado",
                  "why": "Para demonstrar respeito e atenção no atendimento",
                  "who": "Porteiro",
                  "time": "Durante todo o expediente",
                  "safety": "Evitar gírias e linguagem informal",
                  "quality_check": "Avaliação comportamental",
                  "evidence": "Ficha de avaliação"
                },
                {
                  "instruction": "Cumprimentar todos os moradores e visitantes de forma cordial",
                  "why": "Para criar ambiente acolhedor e fortalecer relacionamento",
                  "who": "Porteiro",
                  "time": "A cada interação",
                  "safety": "Saudação apropriada ao período do dia",
                  "quality_check": "Feedback dos moradores",
                  "evidence": "Pesquisa de satisfação"
                },
                {
                  "instruction": "Evitar conversas paralelas e uso de celular durante o expediente",
                  "why": "Para manter foco e disponibilidade no atendimento",
                  "who": "Porteiro",
                  "time": "Durante todo o expediente",
                  "safety": "Celular permitido apenas em emergências",
                  "quality_check": "Supervisão direta",
                  "evidence": "Registro de advertências"
                },
                {
                  "instruction": "Tratar todos com respeito e manter sigilo sobre informações internas",
                  "why": "Para preservar privacidade e confiança dos moradores",
                  "who": "Porteiro",
                  "time": "Permanente",
                  "safety": "Não divulgar rotinas, ausências ou informações pessoais",
                  "quality_check": "Conformidade com LGPD",
                  "evidence": "Termo de confidencialidade"
                },
                {
                  "instruction": "Comunicar imediatamente à supervisão qualquer situação de conflito ou comportamento suspeito",
                  "why": "Para garantir resposta rápida e adequada a incidentes",
                  "who": "Porteiro",
                  "time": "Imediato",
                  "safety": "Não confrontar, apenas observar e relatar",
                  "quality_check": "Relatório detalhado",
                  "evidence": "Livro de ocorrências"
                }
              ]
            },
            "equipment": {
              "epc": ["Uniforme completo", "Crachá de identificação"],
              "epi": [],
              "tools": [],
              "consumables": []
            },
            "training": {
              "modules": ["Atendimento ao cliente", "Comunicação eficaz", "Ética profissional"],
              "cadence": "Reciclagem trimestral"
            },
            "review": {
              "kpis": ["Índice de satisfação", "Número de reclamações", "Conformidade comportamental"],
              "frequency": "Avaliação mensal"
            }
          },
          {
            "id": "PORT_EMERG",
            "name": "POP 05 - Ocorrências e Situações de Emergência",
            "objective": "Definir os procedimentos a serem adotados em casos de incidentes, emergências e situações atípicas, garantindo resposta rápida, segura e coordenada.",
            "scope": "Aplica-se a todos os postos de portaria e controle de acesso sob responsabilidade da Singular Serviços no Residencial Praça da Luz.",
            "responsibilities": "Porteiro: Agir conforme o protocolo, manter a calma e comunicar imediatamente a supervisão.\\nSupervisor: Coordenar o atendimento e registrar todas as providências adotadas.",
            "procedure": {
              "steps": [
                {
                  "instruction": "Identificar o tipo de ocorrência (acidente, incêndio, invasão, falha elétrica etc.)",
                  "why": "Para acionar o protocolo específico e recursos adequados",
                  "who": "Porteiro",
                  "time": "30 segundos",
                  "safety": "Manter distância segura, avaliar riscos",
                  "quality_check": "Classificação correta da emergência",
                  "evidence": "Registro inicial no livro de ocorrências"
                },
                {
                  "instruction": "Manter a calma e garantir a segurança de todos os envolvidos",
                  "why": "Para evitar pânico e garantir evacuação ordenada se necessário",
                  "who": "Porteiro",
                  "time": "Contínuo",
                  "safety": "Priorizar vidas, seguir rotas de fuga",
                  "quality_check": "Pessoas em local seguro",
                  "evidence": "Relato de testemunhas"
                },
                {
                  "instruction": "Comunicar imediatamente a supervisão e/ou o síndico",
                  "why": "Para ativar cadeia de comando e tomada de decisões",
                  "who": "Porteiro",
                  "time": "1 minuto",
                  "safety": "Utilizar telefone ou rádio",
                  "quality_check": "Comunicação confirmada",
                  "evidence": "Registro de horário da comunicação"
                },
                {
                  "instruction": "Acionar os órgãos competentes (bombeiros, polícia, SAMU) conforme a gravidade",
                  "why": "Para garantir resposta especializada em emergências",
                  "who": "Porteiro ou Supervisor",
                  "time": "2-3 minutos",
                  "safety": "Fornecer endereço completo e natureza da ocorrência",
                  "quality_check": "Órgãos acionados e cientes",
                  "evidence": "Número de protocolo ou registro"
                },
                {
                  "instruction": "Registrar o fato com data, hora, descrição e nomes dos envolvidos",
                  "why": "Para documentar o incidente e permitir análise posterior",
                  "who": "Porteiro",
                  "time": "5-10 minutos",
                  "safety": "Registrar todos os detalhes sem omissão",
                  "quality_check": "Relatório completo e detalhado",
                  "evidence": "Livro de ocorrências e relatório de incidente"
                },
                {
                  "instruction": "Acompanhar o desdobramento da ocorrência até o encerramento",
                  "why": "Para garantir que todas as medidas foram tomadas e situação normalizada",
                  "who": "Supervisor",
                  "time": "Variável",
                  "safety": "Manter comunicação com órgãos de emergência",
                  "quality_check": "Ocorrência encerrada formalmente",
                  "evidence": "Relatório final com providências tomadas"
                }
              ]
            },
            "equipment": {
              "epc": ["Telefone de emergência", "Lista de contatos", "Rádio comunicador"],
              "epi": [],
              "tools": ["Livro de ocorrências", "Kit de primeiros socorros"],
              "consumables": []
            },
            "training": {
              "modules": ["Primeiros socorros", "Combate a incêndio", "Gestão de crises"],
              "cadence": "Reciclagem anual"
            },
            "review": {
              "kpis": ["Tempo de resposta", "Eficácia das ações", "Número de incidentes"],
              "frequency": "Revisão pós-incidente"
            }
          },
          {
            "id": "PORT_RONDA",
            "name": "Ronda Preventiva",
            "objective": "Realizar rondas preventivas periódicas",
            "scope": "Todas as áreas comuns e perímetro do condomínio",
            "responsibilities": "Porteiro responsável por executar ronda conforme roteiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Iniciar ronda pelo perímetro externo",
                  "why": "Para verificar integridade das cercas e portões",
                  "who": "Porteiro",
                  "time": "10 minutos",
                  "safety": "Usar lanterna em locais escuros",
                  "quality_check": "Todos os pontos verificados",
                  "evidence": "Checklist de ronda"
                },
                {
                  "instruction": "Verificar áreas comuns internas",
                  "why": "Para identificar irregularidades",
                  "who": "Porteiro",
                  "time": "15 minutos",
                  "safety": "Manter comunicação via rádio",
                  "quality_check": "Áreas inspecionadas",
                  "evidence": "Registro de ronda"
                }
              ]
            },
            "equipment": {
              "epc": ["Rádio comunicador", "Lanterna"],
              "epi": [],
              "tools": ["Checklist de ronda"],
              "consumables": ["Pilhas"]
            },
            "training": {
              "modules": ["Técnicas de ronda", "Identificação de riscos"],
              "cadence": "Mensal"
            },
            "review": {
              "kpis": ["Frequência de rondas", "Irregularidades identificadas"],
              "frequency": "Semanal"
            }
          }
        ]
      },
      {
        "id": "ROND",
        "name": "Ronda Noturna",
        "activities": [
          {
            "id": "ROND_NOT",
            "name": "Ronda Noturna Completa",
            "objective": "Garantir segurança durante período noturno",
            "scope": "Todo o condomínio durante horário noturno",
            "responsibilities": "Vigilante noturno",
            "procedure": {
              "steps": [
                {
                  "instruction": "Iniciar turno verificando equipamentos",
                  "why": "Para garantir que todos recursos estejam funcionais",
                  "who": "Vigilante",
                  "time": "5 minutos",
                  "safety": "Testar rádio e lanterna",
                  "quality_check": "Equipamentos funcionando",
                  "evidence": "Checklist de início de turno"
                },
                {
                  "instruction": "Realizar rondas estratégicas a cada 2 horas",
                  "why": "Para manter presença e identificar situações anormais",
                  "who": "Vigilante",
                  "time": "30 minutos por ronda",
                  "safety": "Seguir rotas pré-definidas",
                  "quality_check": "Todas as áreas verificadas",
                  "evidence": "Registro de horários"
                }
              ]
            },
            "equipment": {
              "epc": ["Rádio", "Lanterna potente", "Relógio de ponto"],
              "epi": [],
              "tools": ["Livro de ronda"],
              "consumables": ["Pilhas"]
            },
            "training": {
              "modules": ["Ronda noturna", "Procedimentos de emergência"],
              "cadence": "Trimestral"
            },
            "review": {
              "kpis": ["Pontualidade das rondas", "Incidentes noturnos"],
              "frequency": "Semanal"
            }
          }
        ]
      },
      {
        "id": "ASG",
        "name": "ASG / Zeladoria",
        "activities": [
          {
            "id": "ASG_HALL",
            "name": "Limpeza de Halls e Recepção",
            "objective": "Manter halls e recepção limpos e organizados",
            "scope": "Todos os halls sociais e de serviço",
            "responsibilities": "Auxiliar de serviços gerais",
            "procedure": {
              "steps": [
                {
                  "instruction": "Varrer e passar pano úmido no piso",
                  "why": "Para remover sujeira e garantir higiene",
                  "who": "ASG",
                  "time": "20 minutos",
                  "safety": "Sinalizar piso molhado",
                  "quality_check": "Piso limpo e seco",
                  "evidence": "Checklist de limpeza"
                }
              ]
            },
            "equipment": {
              "epc": ["Placas de sinalização"],
              "epi": ["Luvas"],
              "tools": ["Vassoura", "Rodo", "Balde"],
              "consumables": ["Detergente", "Desinfetante"]
            },
            "training": {
              "modules": ["Técnicas de limpeza", "Uso de produtos"],
              "cadence": "Mensal"
            },
            "review": {
              "kpis": ["Limpeza dos ambientes", "Consumo de produtos"],
              "frequency": "Diária"
            }
          },
          {
            "id": "ASG_BANHEIRO",
            "name": "Limpeza de Banheiros",
            "objective": "Higienizar banheiros sociais",
            "scope": "Banheiros de uso comum",
            "responsibilities": "ASG",
            "procedure": {
              "steps": [
                {
                  "instruction": "Aplicar produto específico e esfregar",
                  "why": "Para eliminar germes e manter higiene",
                  "who": "ASG",
                  "time": "15 minutos por banheiro",
                  "safety": "Ventilar ambiente",
                  "quality_check": "Ausência de odores",
                  "evidence": "Checklist"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas", "Máscara"],
              "tools": ["Escova sanitária", "Panos"],
              "consumables": ["Desinfetante", "Sabão"]
            },
            "training": {
              "modules": ["Higienização de sanitários"],
              "cadence": "Mensal"
            },
            "review": {
              "kpis": ["Conformidade sanitária"],
              "frequency": "Diária"
            }
          },
          {
            "id": "ASG_GARAGEM",
            "name": "Limpeza de Garagem",
            "objective": "Manter garagem limpa",
            "scope": "Área de estacionamento",
            "responsibilities": "ASG",
            "procedure": {
              "steps": [
                {
                  "instruction": "Varrer e remover detritos",
                  "why": "Para evitar acúmulo de sujeira",
                  "who": "ASG",
                  "time": "30 minutos",
                  "safety": "Atenção a veículos em movimento",
                  "quality_check": "Área livre de detritos",
                  "evidence": "Registro"
                }
              ]
            },
            "equipment": {
              "epc": ["Colete refletivo"],
              "epi": ["Luvas"],
              "tools": ["Vassoura"],
              "consumables": ["Sacos de lixo"]
            },
            "training": {
              "modules": ["Limpeza de áreas externas"],
              "cadence": "Mensal"
            },
            "review": {
              "kpis": ["Limpeza visual"],
              "frequency": "Diária"
            }
          },
          {
            "id": "ASG_ELEVADOR",
            "name": "Limpeza de Elevadores",
            "objective": "Higienizar cabines",
            "scope": "Todos os elevadores",
            "responsibilities": "ASG",
            "procedure": {
              "steps": [
                {
                  "instruction": "Limpar espelhos e painéis",
                  "why": "Para manter boa apresentação",
                  "who": "ASG",
                  "time": "10 minutos por elevador",
                  "safety": "Não usar água em excesso",
                  "quality_check": "Superfícies brilhantes",
                  "evidence": "Checklist"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas"],
              "tools": ["Panos de microfibra"],
              "consumables": ["Limpa vidros"]
            },
            "training": {
              "modules": ["Limpeza de elevadores"],
              "cadence": "Mensal"
            },
            "review": {
              "kpis": ["Satisfação dos usuários"],
              "frequency": "Semanal"
            }
          },
          {
            "id": "ASG_ESCADA",
            "name": "Limpeza de Escadas",
            "objective": "Manter escadas limpas e seguras",
            "scope": "Escadas de emergência e sociais",
            "responsibilities": "ASG",
            "procedure": {
              "steps": [
                {
                  "instruction": "Varrer e passar pano",
                  "why": "Para evitar acidentes",
                  "who": "ASG",
                  "time": "15 minutos",
                  "safety": "Sinalizar área",
                  "quality_check": "Degraus limpos",
                  "evidence": "Registro"
                }
              ]
            },
            "equipment": {
              "epc": ["Placas de sinalização"],
              "epi": ["Luvas"],
              "tools": ["Vassoura", "Pano"],
              "consumables": ["Detergente"]
            },
            "training": {
              "modules": ["Limpeza de escadas"],
              "cadence": "Mensal"
            },
            "review": {
              "kpis": ["Índice de acidentes"],
              "frequency": "Semanal"
            }
          }
        ]
      },
      {
        "id": "VIGIL",
        "name": "Vigilância",
        "activities": [
          {
            "id": "VIGIL_ARMADO",
            "name": "Vigilância Armada",
            "objective": "Garantir segurança com vigilante armado",
            "scope": "Perímetro do condomínio",
            "responsibilities": "Vigilante armado certificado",
            "procedure": {
              "steps": [
                {
                  "instruction": "Conferir equipamentos e armamento",
                  "why": "Para garantir prontidão",
                  "who": "Vigilante",
                  "time": "10 minutos",
                  "safety": "Verificar arma e munição",
                  "quality_check": "Equipamentos em ordem",
                  "evidence": "Checklist"
                },
                {
                  "instruction": "Realizar rondas estratégicas",
                  "why": "Para inibir ações criminosas",
                  "who": "Vigilante",
                  "time": "Conforme escala",
                  "safety": "Manter vigilância constante",
                  "quality_check": "Rotas cumpridas",
                  "evidence": "Livro de ronda"
                }
              ]
            },
            "equipment": {
              "epc": ["Arma de fogo", "Munição", "Rádio"],
              "epi": ["Colete balístico"],
              "tools": ["Lanterna"],
              "consumables": []
            },
            "training": {
              "modules": ["Porte e uso de arma", "Primeiros socorros"],
              "cadence": "Anual (reciclagem obrigatória)"
            },
            "review": {
              "kpis": ["Incidentes de segurança", "Conformidade legal"],
              "frequency": "Mensal"
            }
          },
          {
            "id": "VIGIL_DESARMADO",
            "name": "Vigilância Desarmada",
            "objective": "Segurança preventiva sem armamento",
            "scope": "Áreas comuns",
            "responsibilities": "Vigilante desarmado",
            "procedure": {
              "steps": [
                {
                  "instruction": "Monitorar acessos e movimentações",
                  "why": "Para identificar situações anormais",
                  "who": "Vigilante",
                  "time": "Durante todo turno",
                  "safety": "Não confrontar invasores",
                  "quality_check": "Atenção constante",
                  "evidence": "Relatório de turno"
                }
              ]
            },
            "equipment": {
              "epc": ["Rádio", "CFTV"],
              "epi": [],
              "tools": ["Lanterna"],
              "consumables": []
            },
            "training": {
              "modules": ["Técnicas de observação", "Comunicação de emergência"],
              "cadence": "Semestral"
            },
            "review": {
              "kpis": ["Eficácia na detecção", "Tempo de resposta"],
              "frequency": "Mensal"
            }
          }
        ]
      },
      {
        "id": "JARD",
        "name": "Jardinagem",
        "activities": [
          {
            "id": "JARD_PODA",
            "name": "Poda e Manutenção de Plantas",
            "objective": "Manter jardins saudáveis e estéticos",
            "scope": "Áreas verdes do condomínio",
            "responsibilities": "Jardineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Avaliar necessidade de poda",
                  "why": "Para manter saúde das plantas",
                  "who": "Jardineiro",
                  "time": "15 minutos",
                  "safety": "Usar ferramentas adequadas",
                  "quality_check": "Plantas sem galhos secos",
                  "evidence": "Registro fotográfico"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas de jardinagem", "Botas"],
              "tools": ["Tesoura de poda", "Serrote"],
              "consumables": []
            },
            "training": {
              "modules": ["Técnicas de poda"],
              "cadence": "Trimestral"
            },
            "review": {
              "kpis": ["Saúde das plantas", "Estética"],
              "frequency": "Quinzenal"
            }
          },
          {
            "id": "JARD_IRRIG",
            "name": "Irrigação",
            "objective": "Garantir hidratação adequada",
            "scope": "Todas áreas verdes",
            "responsibilities": "Jardineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Verificar sistema de irrigação",
                  "why": "Para evitar desperdício",
                  "who": "Jardineiro",
                  "time": "10 minutos",
                  "safety": "Verificar vazamentos",
                  "quality_check": "Sistema funcionando",
                  "evidence": "Checklist"
                }
              ]
            },
            "equipment": {
              "epc": ["Sistema de irrigação"],
              "epi": [],
              "tools": ["Mangueira"],
              "consumables": ["Água"]
            },
            "training": {
              "modules": ["Manejo de irrigação"],
              "cadence": "Semestral"
            },
            "review": {
              "kpis": ["Consumo de água", "Saúde das plantas"],
              "frequency": "Mensal"
            }
          },
          {
            "id": "JARD_ADUBO",
            "name": "Adubação",
            "objective": "Nutrir plantas adequadamente",
            "scope": "Áreas verdes",
            "responsibilities": "Jardineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Aplicar adubo conforme cronograma",
                  "why": "Para manter plantas saudáveis",
                  "who": "Jardineiro",
                  "time": "30 minutos",
                  "safety": "Usar EPI adequado",
                  "quality_check": "Aplicação uniforme",
                  "evidence": "Registro"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas", "Máscara"],
              "tools": ["Espalhador"],
              "consumables": ["Adubo"]
            },
            "training": {
              "modules": ["Adubação"],
              "cadence": "Trimestral"
            },
            "review": {
              "kpis": ["Crescimento das plantas"],
              "frequency": "Mensal"
            }
          },
          {
            "id": "JARD_PRAGA",
            "name": "Controle de Pragas",
            "objective": "Prevenir e combater pragas",
            "scope": "Áreas verdes",
            "responsibilities": "Jardineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Identificar presença de pragas",
                  "why": "Para tratamento direcionado",
                  "who": "Jardineiro",
                  "time": "20 minutos",
                  "safety": "Usar produtos aprovados",
                  "quality_check": "Ausência de pragas",
                  "evidence": "Relatório"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas", "Máscara", "Óculos"],
              "tools": ["Pulverizador"],
              "consumables": ["Defensivos"]
            },
            "training": {
              "modules": ["Manejo integrado de pragas"],
              "cadence": "Semestral"
            },
            "review": {
              "kpis": ["Infestações controladas"],
              "frequency": "Mensal"
            }
          }
        ]
      },
      {
        "id": "PISC",
        "name": "Piscineiro",
        "activities": [
          {
            "id": "PISC_QUIMICA",
            "name": "Tratamento Químico da Água",
            "objective": "Manter água própria para banho",
            "scope": "Piscinas do condomínio",
            "responsibilities": "Piscineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Medir pH e cloro",
                  "why": "Para garantir qualidade da água",
                  "who": "Piscineiro",
                  "time": "15 minutos",
                  "safety": "Usar luvas ao manusear produtos",
                  "quality_check": "Parâmetros dentro da norma",
                  "evidence": "Planilha de controle"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas", "Óculos"],
              "tools": ["Kit de teste"],
              "consumables": ["Cloro", "Barrilha"]
            },
            "training": {
              "modules": ["Química de piscinas"],
              "cadence": "Anual"
            },
            "review": {
              "kpis": ["Conformidade dos parâmetros"],
              "frequency": "Diária"
            }
          },
          {
            "id": "PISC_LIMPEZA",
            "name": "Limpeza Física",
            "objective": "Remover sujeiras visíveis",
            "scope": "Piscinas",
            "responsibilities": "Piscineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Aspirar fundo e paredes",
                  "why": "Para remover detritos",
                  "who": "Piscineiro",
                  "time": "40 minutos",
                  "safety": "Desligar sistema durante aspiração",
                  "quality_check": "Água cristalina",
                  "evidence": "Checklist"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": [],
              "tools": ["Aspirador", "Peneira"],
              "consumables": []
            },
            "training": {
              "modules": ["Limpeza de piscinas"],
              "cadence": "Trimestral"
            },
            "review": {
              "kpis": ["Satisfação visual"],
              "frequency": "Diária"
            }
          },
          {
            "id": "PISC_EQUIP",
            "name": "Manutenção de Equipamentos",
            "objective": "Garantir funcionamento dos sistemas",
            "scope": "Bombas e filtros",
            "responsibilities": "Piscineiro",
            "procedure": {
              "steps": [
                {
                  "instruction": "Verificar bombas e filtros",
                  "why": "Para prevenir falhas",
                  "who": "Piscineiro",
                  "time": "20 minutos",
                  "safety": "Desligar energia antes de manutenção",
                  "quality_check": "Equipamentos operacionais",
                  "evidence": "Registro de manutenção"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas"],
              "tools": ["Ferramentas básicas"],
              "consumables": []
            },
            "training": {
              "modules": ["Manutenção de equipamentos"],
              "cadence": "Semestral"
            },
            "review": {
              "kpis": ["Tempo de inatividade"],
              "frequency": "Semanal"
            }
          }
        ]
      },
      {
        "id": "MANUT",
        "name": "Manutenção",
        "activities": [
          {
            "id": "MANUT_ELET",
            "name": "Manutenção Elétrica Básica",
            "objective": "Resolver problemas elétricos simples",
            "scope": "Áreas comuns",
            "responsibilities": "Eletricista",
            "procedure": {
              "steps": [
                {
                  "instruction": "Desligar energia no quadro",
                  "why": "Para segurança do profissional",
                  "who": "Eletricista",
                  "time": "2 minutos",
                  "safety": "Usar EPI adequado",
                  "quality_check": "Circuito desenergizado",
                  "evidence": "Checklist de segurança"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas isolantes", "Óculos"],
              "tools": ["Alicate", "Multímetro"],
              "consumables": ["Fita isolante"]
            },
            "training": {
              "modules": ["NR-10"],
              "cadence": "Bianual"
            },
            "review": {
              "kpis": ["Tempo de reparo", "Segurança"],
              "frequency": "Após cada intervenção"
            }
          },
          {
            "id": "MANUT_HIDRA",
            "name": "Manutenção Hidráulica Básica",
            "objective": "Resolver vazamentos e entupimentos",
            "scope": "Áreas comuns",
            "responsibilities": "Encanador",
            "procedure": {
              "steps": [
                {
                  "instruction": "Identificar origem do problema",
                  "why": "Para aplicar solução correta",
                  "who": "Encanador",
                  "time": "10 minutos",
                  "safety": "Fechar registro antes de intervir",
                  "quality_check": "Problema localizado",
                  "evidence": "Relatório"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Luvas"],
              "tools": ["Chave inglesa", "Desentupidor"],
              "consumables": ["Vedação"]
            },
            "training": {
              "modules": ["Hidráulica básica"],
              "cadence": "Anual"
            },
            "review": {
              "kpis": ["Vazamentos resolvidos"],
              "frequency": "Após reparo"
            }
          },
          {
            "id": "MANUT_PREV",
            "name": "Manutenção Preventiva",
            "objective": "Prevenir falhas nos equipamentos",
            "scope": "Todos os sistemas",
            "responsibilities": "Equipe de manutenção",
            "procedure": {
              "steps": [
                {
                  "instruction": "Seguir cronograma de inspeções",
                  "why": "Para antecipar problemas",
                  "who": "Técnico",
                  "time": "Variável",
                  "safety": "Usar EPIs adequados",
                  "quality_check": "Itens verificados",
                  "evidence": "Checklist"
                }
              ]
            },
            "equipment": {
              "epc": [],
              "epi": ["Conforme atividade"],
              "tools": ["Ferramentas diversas"],
              "consumables": ["Lubrificantes"]
            },
            "training": {
              "modules": ["Manutenção preventiva"],
              "cadence": "Anual"
            },
            "review": {
              "kpis": ["Falhas evitadas", "Cumprimento do cronograma"],
              "frequency": "Mensal"
            }
          }
        ]
      },
      {
        "id": "CONC",
        "name": "Concierge",
        "activities": [
          {
            "id": "CONC_ATEND",
            "name": "Atendimento Personalizado",
            "objective": "Oferecer serviço diferenciado aos moradores",
            "scope": "Recepção e áreas sociais",
            "responsibilities": "Concierge",
            "procedure": {
              "steps": [
                {
                  "instruction": "Receber morador com cordialidade",
                  "why": "Para criar experiência positiva",
                  "who": "Concierge",
                  "time": "Contínuo",
                  "safety": "Manter postura profissional",
                  "quality_check": "Satisfação do morador",
                  "evidence": "Pesquisa de satisfação"
                }
              ]
            },
            "equipment": {
              "epc": ["Uniforme", "Crachá"],
              "epi": [],
              "tools": ["Tablet ou computador"],
              "consumables": []
            },
            "training": {
              "modules": ["Atendimento de excelência", "Etiqueta profissional"],
              "cadence": "Trimestral"
            },
            "review": {
              "kpis": ["Índice de satisfação"],
              "frequency": "Mensal"
            }
          },
          {
            "id": "CONC_RESERVA",
            "name": "Gestão de Reservas de Espaços",
            "objective": "Organizar uso de áreas comuns",
            "scope": "Salões de festa e churrasqueiras",
            "responsibilities": "Concierge",
            "procedure": {
              "steps": [
                {
                  "instruction": "Registrar solicitação de reserva",
                  "why": "Para controlar disponibilidade",
                  "who": "Concierge",
                  "time": "5 minutos",
                  "safety": "Verificar quitação de taxas",
                  "quality_check": "Reserva confirmada",
                  "evidence": "Sistema de reservas"
                }
              ]
            },
            "equipment": {
              "epc": ["Sistema de gestão"],
              "epi": [],
              "tools": ["Agenda"],
              "consumables": []
            },
            "training": {
              "modules": ["Uso do sistema de reservas"],
              "cadence": "Semestral"
            },
            "review": {
              "kpis": ["Taxa de ocupação", "Conflitos de reserva"],
              "frequency": "Mensal"
            }
          }
        ]
      },
      {
        "id": "ADM",
        "name": "Administrador Dedicado",
        "activities": [
          {
            "id": "ADM_FINANC",
            "name": "Gestão Financeira",
            "objective": "Administrar finanças do condomínio",
            "scope": "Todas as operações financeiras",
            "responsibilities": "Administrador",
            "procedure": {
              "steps": [
                {
                  "instruction": "Controlar receitas e despesas",
                  "why": "Para manter saúde financeira",
                  "who": "Administrador",
                  "time": "Diário",
                  "safety": "Manter sigilo de informações",
                  "quality_check": "Contas balanceadas",
                  "evidence": "Relatórios financeiros"
                }
              ]
            },
            "equipment": {
              "epc": ["Software de gestão"],
              "epi": [],
              "tools": ["Computador"],
              "consumables": []
            },
            "training": {
              "modules": ["Contabilidade condominial"],
              "cadence": "Anual"
            },
            "review": {
              "kpis": ["Inadimplência", "Economia gerada"],
              "frequency": "Mensal"
            }
          },
          {
            "id": "ADM_CONTRATO",
            "name": "Gestão de Contratos",
            "objective": "Administrar contratos de fornecedores",
            "scope": "Todos os contratos",
            "responsibilities": "Administrador",
            "procedure": {
              "steps": [
                {
                  "instruction": "Acompanhar prazos e renovações",
                  "why": "Para evitar interrupções de serviço",
                  "who": "Administrador",
                  "time": "Semanal",
                  "safety": "Manter documentação atualizada",
                  "quality_check": "Contratos vigentes",
                  "evidence": "Pasta de contratos"
                }
              ]
            },
            "equipment": {
              "epc": ["Sistema de gestão"],
              "epi": [],
              "tools": ["Arquivo"],
              "consumables": []
            },
            "training": {
              "modules": ["Gestão de contratos"],
              "cadence": "Anual"
            },
            "review": {
              "kpis": ["Contratos vencidos", "Economia em negociações"],
              "frequency": "Mensal"
            }
          },
          {
            "id": "ADM_ASSEMB",
            "name": "Assembleias e Comunicação",
            "objective": "Organizar assembleias e comunicados",
            "scope": "Comunicação com moradores",
            "responsibilities": "Administrador",
            "procedure": {
              "steps": [
                {
                  "instruction": "Convocar assembleia conforme estatuto",
                  "why": "Para cumprir exigências legais",
                  "who": "Administrador",
                  "time": "Conforme necessário",
                  "safety": "Seguir prazos legais de convocação",
                  "quality_check": "Quórum atingido",
                  "evidence": "Ata de assembleia"
                }
              ]
            },
            "equipment": {
              "epc": ["Sistema de comunicação"],
              "epi": [],
              "tools": ["Projetor"],
              "consumables": ["Papel para atas"]
            },
            "training": {
              "modules": ["Legislação condominial"],
              "cadence": "Anual"
            },
            "review": {
              "kpis": ["Participação nas assembleias"],
              "frequency": "Por assembleia"
            }
          }
        ]
      }
    ]
  }'::jsonb,
  '2.0',
  NULL
);