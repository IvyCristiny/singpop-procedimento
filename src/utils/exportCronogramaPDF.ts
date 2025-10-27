import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Cronograma, diasSemana } from "@/types/cronograma";
import { POP } from "@/types/pop";

export const exportCronogramaPDF = (cronograma: Cronograma, pops: POP[] = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Colors (cinza para seguir o modelo)
  const headerColor: [number, number, number] = [217, 217, 217]; // Cinza claro
  
  let yPos = 15;

  // Título
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`Cronograma de Limpeza – Condomínio ${cronograma.condominio_nome}`, 10, yPos);

  yPos += 10;

  // Buscar códigos dos POPs associados
  const popCodigos = cronograma.pop_ids
    .map((id) => {
      const pop = pops.find((p) => p.id === id);
      return pop?.codigoPOP || id;
    })
    .join(", ");

  // Dados gerais (formato simples)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const infoFields: [string, string][] = [
    ["Condomínio:", cronograma.condominio_nome],
    ["Código:", cronograma.codigo],
    ["Versão:", cronograma.versao],
    ["Turno:", cronograma.turno],
    ["Periodicidade:", cronograma.periodicidade],
    ["Responsável:", cronograma.responsavel],
    ["Supervisão:", cronograma.supervisao || "-"],
    ["", ""], // Linha vazia
    ["POPs Associados:", popCodigos || "Nenhum"],
  ];

  infoFields.forEach(([label, value]) => {
    if (!label) {
      yPos += 3;
      return;
    }
    doc.setFont("helvetica", "bold");
    doc.text(label, 10, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 55, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Rotina Diária
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Rotina Diária", 10, yPos);
  yPos += 5;

  const dailyTableData = cronograma.rotina_diaria
    .sort((a, b) => a.ordem - b.ordem)
    .map((rotina) => [
      `${rotina.horario_inicio} – ${rotina.horario_fim}`,
      rotina.ambiente_atividade,
      rotina.detalhamento,
      rotina.responsavel,
    ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Horário", "Ambiente / Atividade", "Detalhamento das tarefas", "Responsável"]],
    body: dailyTableData,
    theme: "grid",
    headStyles: {
      fillColor: headerColor,
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 45 },
      2: { cellWidth: 70 },
      3: { cellWidth: 30 },
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 10, right: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Verificar se precisa de nova página
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Rotina Semanal
  if (cronograma.rotina_semanal && cronograma.rotina_semanal.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Rotina Semanal", 10, yPos);
    yPos += 5;

    const weeklyTableData = cronograma.rotina_semanal
      .sort((a, b) => a.ordem - b.ordem)
      .map((rotina) => {
        const dia = diasSemana.find((d) => d.value === rotina.dia_semana);
        return [dia?.label || rotina.dia_semana, rotina.atividade, rotina.observacoes || ""];
      });

    autoTable(doc, {
      startY: yPos,
      head: [["Dia da Semana", "Atividade Semanal", "Observações"]],
      body: weeklyTableData,
      theme: "grid",
      headStyles: {
        fillColor: headerColor,
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 10, right: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Footer com dados de revisão
  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Responsável pela Revisão: ${cronograma.responsavel_revisao || "_".repeat(40)}`,
    10,
    yPos
  );
  yPos += 6;
  doc.text(
    `Data da Revisão: ${cronograma.data_revisao || "____ / ____ / ________"}`,
    10,
    yPos
  );

  // Salvar arquivo
  const filename = `${cronograma.codigo}_${cronograma.condominio_nome.replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(filename);
};
