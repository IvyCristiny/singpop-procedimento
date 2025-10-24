import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { POP } from "@/types/pop";
import { Activity } from "@/types/schema";
import logoSingular from "@/assets/logo_singular_colorida.png";

// Helper para converter imagem para base64
const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading logo:", error);
    return "";
  }
};

// Função auxiliar para adicionar uma atividade ao PDF
const addActivityPageToPDF = async (
  doc: jsPDF,
  pop: POP,
  activity: Activity,
  isFirstPage: boolean
) => {
  if (!isFirstPage) {
    doc.addPage();
  }

  const singularGreen: [number, number, number] = [0, 120, 80];
  const logoBase64 = await getImageAsBase64(logoSingular);

  // ==================== CABEÇALHO ====================
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`SINGULAR | ${pop.condominioNome.toUpperCase()}`, 14, 15);

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", 170, 8, 30, 12);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }

  // ==================== TABELA PRINCIPAL ====================
  const steps = pop.customSteps || activity.procedure.steps;

  const tableData: any[] = [
    [
      {
        content: "Procedimento Operacional Padrão. POP",
        colSpan: 1,
        styles: { fontStyle: "bold", fontSize: 12, textColor: singularGreen, cellPadding: 3 }
      },
      {
        content: "Revisado em:",
        styles: { fontStyle: "bold", fontSize: 10, halign: "left", cellPadding: 3 }
      }
    ],
    [
      {
        content: activity.name,
        styles: { fontSize: 10, cellPadding: 3 }
      },
      {
        content: `Data: ${new Date(pop.dataRevisao).toLocaleDateString("pt-BR")}`,
        styles: { fontSize: 10, cellPadding: 3 }
      }
    ],
    [
      {
        content: "1. Objetivo",
        colSpan: 2,
        styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
      }
    ],
    [
      {
        content: activity.objective,
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ],
    [
      {
        content: "2. Campo de Aplicação",
        colSpan: 2,
        styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
      }
    ],
    [
      {
        content: activity.scope || "Aplicável a todas as situações relacionadas a esta atividade.",
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ],
    [
      {
        content: "3. Responsabilidades",
        colSpan: 2,
        styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
      }
    ]
  ];

  activity.responsibilities.forEach(resp => {
    tableData.push([
      {
        content: `• ${resp}`,
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ]);
  });

  tableData.push([
    {
      content: "4. Procedimentos",
      colSpan: 2,
      styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
    }
  ]);

  steps.forEach((step, idx) => {
    tableData.push([
      {
        content: `${idx + 1}. ${step.instruction}`,
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ]);
  });

  tableData.push([
    {
      content: "5. Registros",
      colSpan: 2,
      styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
    }
  ]);

  const registros: string[] = [];
  if (activity.equipment.epc.length > 0) {
    registros.push("EPC: " + activity.equipment.epc.join(", "));
  }
  if (activity.equipment.epi.length > 0) {
    registros.push("EPI: " + activity.equipment.epi.join(", "));
  }
  if (activity.equipment.tools.length > 0) {
    registros.push("Ferramentas: " + activity.equipment.tools.join(", "));
  }
  if (activity.equipment.consumables.length > 0) {
    registros.push("Consumíveis: " + activity.equipment.consumables.join(", "));
  }
  registros.push("Planilha ou sistema de controle");
  registros.push("Livro de ocorrências");

  tableData.push([
    {
      content: registros.join("\n"),
      colSpan: 2,
      styles: { fontSize: 9, cellPadding: 3 }
    }
  ]);

  tableData.push([
    {
      content: "6. Observações",
      colSpan: 2,
      styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
    }
  ]);

  tableData.push([
    {
      content: pop.observacoes || "Nenhuma observação adicional.",
      colSpan: 2,
      styles: { fontSize: 9, cellPadding: 3 }
    }
  ]);

  autoTable(doc, {
    startY: 25,
    body: tableData,
    theme: "grid",
    margin: { left: 14, right: 14 },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      cellPadding: 4,
      textColor: [0, 0, 0],
      fontSize: 9,
      valign: "top"
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 62 }
    }
  });
};

// Função para adicionar rodapé
const addFooterToAllPages = (doc: jsPDF, pop: POP) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(14, 280, 196, 280);

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    doc.text(`Código: ${pop.codigoPOP} | Versão: ${pop.versao}`, 14, 285);
    doc.text(`Página ${i}/${pageCount}`, 196, 285, { align: "right" });

    doc.text(`Elaborado por: ${pop.responsavelElaboracao} | Colaborador: ${pop.nomeColaborador}`, 14, 289);
    doc.text(`Apresentado em: ${new Date(pop.dataApresentacao).toLocaleDateString("pt-BR")}`, 196, 289, { align: "right" });
  }
};

export const generatePDF = async (
  pop: POP,
  activity: Activity,
  attachedImages?: string[]
) => {
  const doc = new jsPDF();

  await addActivityPageToPDF(doc, pop, activity, true);

  // Adicionar imagens anexas se houver
  if (attachedImages && attachedImages.length > 0) {
    for (let idx = 0; idx < attachedImages.length; idx++) {
      const imageBase64 = attachedImages[idx];
      doc.addPage();

      // Cabeçalho da página de anexo
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 120, 80);
      doc.text(`ANEXO ${idx + 1} - Imagem Referência`, 14, 20);

      try {
        const imgProps = doc.getImageProperties(imageBase64);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const maxWidth = pageWidth - 28;
        const maxHeight = pageHeight - 60;

        let width = imgProps.width;
        let height = imgProps.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        const x = (pageWidth - width) / 2;
        const y = 30;

        doc.addImage(imageBase64, 'JPEG', x, y, width, height);
      } catch (error) {
        console.error(`Erro ao adicionar imagem ${idx + 1}:`, error);
      }
    }
  }

  addFooterToAllPages(doc, pop);

  return doc;
};

export const downloadPDF = async (
  pop: POP,
  activity: Activity,
  attachedImages?: string[]
) => {
  const doc = await generatePDF(pop, activity, attachedImages);
  const fileName = `POP_${pop.codigoPOP}_${pop.condominioNome.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};

// Nova função para gerar PDF com múltiplas atividades
export const generateMultipleActivitiesPDF = async (
  pop: POP,
  activities: Activity[]
) => {
  const doc = new jsPDF();

  for (let i = 0; i < activities.length; i++) {
    await addActivityPageToPDF(doc, pop, activities[i], i === 0);
  }

  addFooterToAllPages(doc, pop);

  return doc;
};

export const downloadMultipleActivitiesPDF = async (
  pop: POP,
  activities: Activity[]
) => {
  const doc = await generateMultipleActivitiesPDF(pop, activities);
  const fileName = `POP_${pop.codigoPOP}_${pop.condominioNome.replace(/\s+/g, "_")}_${activities.length}atividades.pdf`;
  doc.save(fileName);
};
