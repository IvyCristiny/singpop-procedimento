import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Cronograma, diasSemana } from "@/types/cronograma";

export const exportCronogramaPDF = (cronograma: Cronograma) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Colors
  const headerColor: [number, number, number] = [76, 175, 80]; // Green #4CAF50
  const lightGreen: [number, number, number] = [200, 230, 201];
  
  let yPos = 20;

  // Title
  doc.setFillColor(...headerColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(cronograma.titulo, pageWidth / 2, 15, { align: "center" });

  yPos = 35;

  // Info Section
  doc.setFillColor(...lightGreen);
  doc.rect(10, yPos, pageWidth - 20, 45, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Condomínio: ${cronograma.condominio_nome}`, 15, yPos + 8);
  doc.text(`Código: ${cronograma.codigo}`, 15, yPos + 15);
  doc.text(`Versão: ${cronograma.versao}`, 15, yPos + 22);
  doc.text(`Turno: ${cronograma.turno}`, 15, yPos + 29);
  doc.text(`Periodicidade: ${cronograma.periodicidade}`, 15, yPos + 36);
  doc.text(`Responsável: ${cronograma.responsavel}`, 15, yPos + 43);

  yPos += 55;

  // Rotina Diária
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headerColor);
  doc.text("ROTINA DIÁRIA", 10, yPos);
  yPos += 2;

  const dailyTableData = cronograma.rotina_diaria.map((rotina) => [
    `${rotina.horario_inicio}-${rotina.horario_fim}`,
    rotina.ambiente_atividade,
    rotina.detalhamento,
    rotina.responsavel,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Horário", "Ambiente/Atividade", "Detalhamento", "Responsável"]],
    body: dailyTableData,
    theme: "grid",
    headStyles: {
      fillColor: headerColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 10, right: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Rotina Semanal
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headerColor);
  doc.text("ROTINA SEMANAL", 10, yPos);
  yPos += 2;

  const weeklyTableData = cronograma.rotina_semanal
    .sort((a, b) => a.ordem - b.ordem)
    .map((rotina) => {
      const dia = diasSemana.find((d) => d.value === rotina.dia_semana);
      return [
        dia?.label || rotina.dia_semana,
        rotina.atividade,
        rotina.observacoes || "-",
      ];
    });

  if (weeklyTableData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [["Dia da Semana", "Atividade", "Observações"]],
      body: weeklyTableData,
      theme: "grid",
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 10, right: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Footer - Revisão
  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }

  if (cronograma.responsavel_revisao || cronograma.data_revisao) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Responsável pela Revisão: ${cronograma.responsavel_revisao || "-"}`,
      10,
      yPos
    );
    doc.text(
      `Data de Revisão: ${cronograma.data_revisao || "-"}`,
      10,
      yPos + 5
    );
  }

  // Save
  const filename = `${cronograma.codigo}_${cronograma.condominio_nome.replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(filename);
};
