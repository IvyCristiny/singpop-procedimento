import * as XLSX from "xlsx";
import { Cronograma, diasSemana } from "@/types/cronograma";
import { POP } from "@/types/pop";

export const exportCronogramaExcel = (cronograma: Cronograma, pops: POP[] = []) => {
  const wb = XLSX.utils.book_new();

  // Buscar códigos dos POPs associados
  const popCodigos = cronograma.pop_ids
    .map((id) => {
      const pop = pops.find((p) => p.id === id);
      return pop?.codigoPOP || id;
    })
    .join(", ");

  // Dados consolidados em uma única sheet
  const dadosConsolidados: any[] = [
    // Título (será mesclado)
    [`Cronograma de Limpeza – Condomínio ${cronograma.condominio_nome}`],
    [],
    
    // Informações gerais
    ["Condomínio:", cronograma.condominio_nome],
    ["Código:", cronograma.codigo],
    ["Versão:", cronograma.versao],
    ["Turno:", cronograma.turno],
    ["Periodicidade:", cronograma.periodicidade],
    ["Responsável:", cronograma.responsavel],
    ["Supervisão:", cronograma.supervisao || ""],
    [],
    
    // POPs associados
    ["POPs Associados:", popCodigos || "Nenhum"],
    [],
    
    // Rotina Diária
    ["Rotina Diária"],
    [],
    ["Horário", "Ambiente / Atividade", "Detalhamento das tarefas", "Responsável"],
  ];

  // Adicionar dados da rotina diária
  cronograma.rotina_diaria
    .sort((a, b) => a.ordem - b.ordem)
    .forEach((rotina) => {
      dadosConsolidados.push([
        `${rotina.horario_inicio} – ${rotina.horario_fim}`,
        rotina.ambiente_atividade,
        rotina.detalhamento,
        rotina.responsavel,
      ]);
    });

  dadosConsolidados.push([]);

  // Rotina Semanal
  if (cronograma.rotina_semanal && cronograma.rotina_semanal.length > 0) {
    dadosConsolidados.push(["Rotina Semanal"]);
    dadosConsolidados.push([]);
    dadosConsolidados.push(["Dia da Semana", "Atividade Semanal", "Observações"]);
    
    cronograma.rotina_semanal
      .sort((a, b) => a.ordem - b.ordem)
      .forEach((rotina) => {
        const dia = diasSemana.find((d) => d.value === rotina.dia_semana);
        dadosConsolidados.push([
          dia?.label || rotina.dia_semana,
          rotina.atividade,
          rotina.observacoes || "",
        ]);
      });

    dadosConsolidados.push([]);
  }

  // Footer com dados de revisão
  dadosConsolidados.push([]);
  dadosConsolidados.push([
    "Responsável pela Revisão:",
    cronograma.responsavel_revisao || "_".repeat(40),
  ]);
  dadosConsolidados.push([
    "Data da Revisão:",
    cronograma.data_revisao || "____ / ____ / ________",
  ]);

  // Criar worksheet
  const ws = XLSX.utils.aoa_to_sheet(dadosConsolidados);

  // Definir largura das colunas
  ws["!cols"] = [
    { wch: 25 }, // Coluna A
    { wch: 35 }, // Coluna B
    { wch: 55 }, // Coluna C
    { wch: 15 }, // Coluna D
  ];

  // Mesclar célula do título (linha 1, colunas A-D)
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

  // Aplicar estilos ao título
  if (ws["A1"]) {
    ws["A1"].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "left", vertical: "center" },
    };
  }

  // Aplicar estilos aos cabeçalhos das tabelas
  const headerStyle = {
    font: { bold: true, sz: 10 },
    fill: { fgColor: { rgb: "D9D9D9" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Encontrar e estilizar cabeçalhos "Rotina Diária" e "Rotina Semanal"
  dadosConsolidados.forEach((row, idx) => {
    if (row[0] === "Rotina Diária" || row[0] === "Rotina Semanal") {
      const cellRef = XLSX.utils.encode_cell({ r: idx, c: 0 });
      if (ws[cellRef]) {
        ws[cellRef].s = { font: { bold: true, sz: 12 } };
      }
    }
    // Estilizar cabeçalhos das tabelas
    if (
      row[0] === "Horário" ||
      row[0] === "Dia da Semana"
    ) {
      for (let col = 0; col < row.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: idx, c: col });
        if (ws[cellRef]) {
          ws[cellRef].s = headerStyle;
        }
      }
    }
  });

  XLSX.utils.book_append_sheet(wb, ws, "Cronograma");

  // Salvar arquivo
  const filename = `${cronograma.codigo}_${cronograma.condominio_nome.replace(
    /\s+/g,
    "_"
  )}.xlsx`;
  XLSX.writeFile(wb, filename);
};
