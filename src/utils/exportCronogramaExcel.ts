import * as XLSX from "xlsx";
import { Cronograma, diasSemana } from "@/types/cronograma";

export const exportCronogramaExcel = (cronograma: Cronograma) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Dados Gerais
  const dadosGerais = [
    ["CRONOGRAMA DE ATIVIDADES"],
    [],
    ["Título", cronograma.titulo],
    ["Condomínio", cronograma.condominio_nome],
    ["Código", cronograma.codigo],
    ["Versão", cronograma.versao],
    [],
    ["Turno", cronograma.turno],
    ["Periodicidade", cronograma.periodicidade],
    ["Responsável", cronograma.responsavel],
    ["Supervisão", cronograma.supervisao || "-"],
    [],
    ["POPs Associadas", cronograma.pop_ids.length],
  ];

  if (cronograma.responsavel_revisao || cronograma.data_revisao) {
    dadosGerais.push([]);
    dadosGerais.push(["Responsável pela Revisão", cronograma.responsavel_revisao || "-"]);
    dadosGerais.push(["Data de Revisão", cronograma.data_revisao || "-"]);
  }

  const wsDadosGerais = XLSX.utils.aoa_to_sheet(dadosGerais);
  XLSX.utils.book_append_sheet(wb, wsDadosGerais, "Dados Gerais");

  // Sheet 2: Rotina Diária
  const rotinaDiariaData = [
    ["ROTINA DIÁRIA"],
    [],
    ["Horário Início", "Horário Fim", "Ambiente/Atividade", "Detalhamento", "Responsável"],
    ...cronograma.rotina_diaria.map((rotina) => [
      rotina.horario_inicio,
      rotina.horario_fim,
      rotina.ambiente_atividade,
      rotina.detalhamento,
      rotina.responsavel,
    ]),
  ];

  const wsRotinaDiaria = XLSX.utils.aoa_to_sheet(rotinaDiariaData);
  XLSX.utils.book_append_sheet(wb, wsRotinaDiaria, "Rotina Diária");

  // Sheet 3: Rotina Semanal
  const rotinaSemanalData = [
    ["ROTINA SEMANAL"],
    [],
    ["Dia da Semana", "Atividade", "Observações"],
    ...cronograma.rotina_semanal
      .sort((a, b) => a.ordem - b.ordem)
      .map((rotina) => {
        const dia = diasSemana.find((d) => d.value === rotina.dia_semana);
        return [dia?.label || rotina.dia_semana, rotina.atividade, rotina.observacoes || "-"];
      }),
  ];

  const wsRotinaSemanal = XLSX.utils.aoa_to_sheet(rotinaSemanalData);
  XLSX.utils.book_append_sheet(wb, wsRotinaSemanal, "Rotina Semanal");

  // Save
  const filename = `${cronograma.codigo}_${cronograma.condominio_nome.replace(
    /\s+/g,
    "_"
  )}.xlsx`;
  XLSX.writeFile(wb, filename);
};
