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

export const generatePDF = async (pop: POP, activity: Activity) => {
  const doc = new jsPDF();
  
  // Cores Singular v2 - Apenas verde, branco e preto
  const singularGreen: [number, number, number] = [0, 154, 103]; // #009A67
  const singularGreenDark: [number, number, number] = [0, 120, 80]; // #007850
  const singularGray: [number, number, number] = [242, 242, 242]; // #F2F2F2
  const darkText: [number, number, number] = [51, 51, 51]; // #333333
  const lightText: [number, number, number] = [102, 102, 102]; // #666666
  
  // Símbolos ASCII para substituir emojis (compatíveis com jsPDF)
  const icons = {
    objetivo: "[>]",
    aplicacao: "[#]",
    responsabilidades: "[=]",
    procedimento: "[@]",
    recursos: "[*]",
    treinamento: "[+]",
    indicadores: "[%]",
    observacoes: "[!]",
    tempo: "[T]",
    seguranca: "[!]",
    ok: "OK"
  };
  
  // Carregar logo em base64
  const logoBase64 = await getImageAsBase64(logoSingular);
  
  // Helper para criar blocos de seção com ícone e fundo colorido
  const drawSectionBlock = (
    yPos: number,
    icon: string,
    title: string,
    color: [number, number, number] = singularGreen,
    width: number = 182
  ) => {
    doc.setFillColor(singularGray[0], singularGray[1], singularGray[2]);
    doc.roundedRect(14, yPos - 6, width, 10, 1, 1, "F");
    
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${icon} ${title}`, 16, yPos);
    
    return yPos + 10;
  };
  
  // ==================== CABEÇALHO ====================
  // Faixa superior verde
  doc.setFillColor(singularGreen[0], singularGreen[1], singularGreen[2]);
  doc.rect(0, 0, 210, 35, "F");
  
  // Logo Singular (lado esquerdo)
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", 14, 8, 50, 18);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }
  
  // Divisor vertical
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(70, 10, 70, 30);
  
  // Título do documento (meio)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PROCEDIMENTO OPERACIONAL PADRÃO", 75, 15);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const activityNameLines = doc.splitTextToSize(activity.name.toUpperCase(), 60);
  doc.text(activityNameLines, 75, 21);
  
  // Box de informações (lado direito)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(140, 5, 65, 25, 2, 2, "F");
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`Código: ${pop.codigoPOP}`, 142, 10);
  doc.text(`Versão: ${pop.versao}`, 142, 14);
  doc.text(`Condomínio: ${pop.condominioNome}`, 142, 18);
  
  const turnoLabel = pop.turno === "24h" ? "24h" :
                     pop.turno === "12h-diurno" ? "12h Diurno" :
                     pop.turno === "12h-noturno" ? "12h Noturno" :
                     pop.turno === "8h-comercial" ? "8h Comercial" : "N/A";
  doc.text(`Turno: ${turnoLabel}`, 142, 22);
  doc.text(`Emissão: ${new Date(pop.dataEmissao).toLocaleDateString("pt-BR")}`, 142, 26);
  
  let yPosition = 42;
  
  // ==================== BLOCO 1: OBJETIVO E APLICAÇÃO (2 colunas) ====================
  const colWidth = 88;
  const col1X = 14;
  const col2X = 106;
  
  // Coluna 1 - Objetivo
  doc.setFillColor(singularGray[0], singularGray[1], singularGray[2]);
  doc.roundedRect(col1X, yPosition, colWidth, 28, 2, 2, "F");
  doc.setTextColor(singularGreen[0], singularGreen[1], singularGreen[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${icons.objetivo} OBJETIVO`, col1X + 3, yPosition + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const objLines = doc.splitTextToSize(activity.objective, colWidth - 6);
  doc.text(objLines, col1X + 3, yPosition + 10);
  
  // Coluna 2 - Campo de Aplicação
  doc.setFillColor(singularGray[0], singularGray[1], singularGray[2]);
  doc.roundedRect(col2X, yPosition, colWidth, 28, 2, 2, "F");
  doc.setTextColor(singularGreenDark[0], singularGreenDark[1], singularGreenDark[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${icons.aplicacao} CAMPO DE APLICACAO`, col2X + 3, yPosition + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const scopeText = activity.scope || "Aplicável a todas as situações relacionadas a esta atividade.";
  const scopeLines = doc.splitTextToSize(scopeText, colWidth - 6);
  doc.text(scopeLines, col2X + 3, yPosition + 10);
  
  yPosition += 33;
  
  // ==================== BLOCO 2: RESPONSABILIDADES ====================
  yPosition = drawSectionBlock(yPosition, icons.responsabilidades, "RESPONSABILIDADES", singularGreenDark);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  
  activity.responsibilities.forEach((resp) => {
    let prefix = "";
    if (resp.toLowerCase().includes("asg")) prefix = "[ASG] ";
    if (resp.toLowerCase().includes("zelador")) prefix = "[ZEL] ";
    if (resp.toLowerCase().includes("gestão") || resp.toLowerCase().includes("gestor")) prefix = "[GES] ";
    
    doc.text(`${prefix}${resp}`, 16, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  
  // ==================== BLOCO 3: PROCEDIMENTO OPERACIONAL (Timeline) ====================
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  yPosition = drawSectionBlock(yPosition, icons.procedimento, "PROCEDIMENTO OPERACIONAL", singularGreen);
  
  const steps = pop.customSteps || activity.procedure.steps;
  
  // Tabela visual com autoTable
  const stepsData = steps.map((step, idx) => [
    `${idx + 1}`,
    step.title,
    step.instruction.substring(0, 45) + (step.instruction.length > 45 ? "..." : ""),
    step.why.substring(0, 35) + (step.why.length > 35 ? "..." : ""),
    `${step.time_estimate_min}min`,
    step.safety ? icons.seguranca : icons.ok,
    step.quality_check ? icons.ok : "-"
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [["#", "Etapa", "O que fazer", "Por quê", "Tempo", "Seg.", "Ctrl"]],
    body: stepsData,
    theme: "grid",
    headStyles: {
      fillColor: singularGreen,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2,
      textColor: darkText
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center", fillColor: singularGray },
      1: { cellWidth: 35, fontStyle: "bold" },
      2: { cellWidth: 45 },
      3: { cellWidth: 38 },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 12, halign: "center" },
      6: { cellWidth: 12, halign: "center" }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 8;
  
  // Tempo total
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(singularGreen[0], singularGreen[1], singularGreen[2]);
  const totalTime = steps.reduce((sum, step) => sum + step.time_estimate_min, 0);
  doc.text(`${icons.tempo} Tempo total estimado: ${totalTime} minutos`, 14, yPosition);
  yPosition += 10;
  
  // ==================== BLOCO 4: RECURSOS NECESSÁRIOS ====================
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  yPosition = drawSectionBlock(yPosition, icons.recursos, "RECURSOS NECESSARIOS", singularGreenDark);
  
  const equipData = [
    ["[EPC]", activity.equipment.epc.join(", ") || "N/A"],
    ["[EPI]", activity.equipment.epi.join(", ") || "N/A"],
    ["[FER]", activity.equipment.tools.join(", ") || "N/A"],
    ["[CON]", activity.equipment.consumables.join(", ") || "N/A"]
  ];
  
  autoTable(doc, {
    startY: yPosition,
    body: equipData,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: singularGreenDark },
      1: { cellWidth: 147 }
    }
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // ==================== BLOCO 5: TREINAMENTO E INDICADORES (2 colunas) ====================
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Coluna 1 - Treinamento
  doc.setFillColor(singularGray[0], singularGray[1], singularGray[2]);
  doc.roundedRect(col1X, yPosition, colWidth, 35, 2, 2, "F");
  doc.setTextColor(singularGreenDark[0], singularGreenDark[1], singularGreenDark[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${icons.treinamento} TREINAMENTO`, col1X + 3, yPosition + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  let trainY = yPosition + 10;
  activity.training.modules.forEach(mod => {
    const modLines = doc.splitTextToSize(`• ${mod}`, colWidth - 6);
    doc.text(modLines, col1X + 3, trainY);
    trainY += modLines.length * 3.5;
  });
  doc.setFont("helvetica", "bold");
  doc.text(`Reciclagem: ${activity.training.refresh_cadence_days} dias`, col1X + 3, trainY + 2);
  
  // Coluna 2 - Indicadores
  doc.setFillColor(singularGray[0], singularGray[1], singularGray[2]);
  doc.roundedRect(col2X, yPosition, colWidth, 35, 2, 2, "F");
  doc.setTextColor(singularGreen[0], singularGreen[1], singularGreen[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${icons.indicadores} INDICADORES`, col2X + 3, yPosition + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  let kpiY = yPosition + 10;
  activity.review.kpis.forEach(kpi => {
    const kpiLines = doc.splitTextToSize(`• ${kpi}`, colWidth - 6);
    doc.text(kpiLines, col2X + 3, kpiY);
    kpiY += kpiLines.length * 3.5;
  });
  doc.setFont("helvetica", "bold");
  doc.text(`Auditoria: ${activity.review.audit_frequency_days} dias`, col2X + 3, kpiY + 2);
  doc.text(`Auditor: ${activity.review.auditor_role}`, col2X + 3, kpiY + 6);
  
  yPosition += 40;
  
  // ==================== OBSERVAÇÕES DO CONDOMÍNIO ====================
  if (pop.observacoes && pop.observacoes.trim()) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition = drawSectionBlock(yPosition, icons.observacoes, "OBSERVACOES DO CONDOMINIO", singularGreenDark);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const obsLines = doc.splitTextToSize(pop.observacoes, 180);
    doc.text(obsLines, 14, yPosition);
    yPosition += obsLines.length * 4 + 8;
  }
  
  // ==================== RODAPÉ PADRONIZADO ====================
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Linha separadora
    doc.setDrawColor(singularGreen[0], singularGreen[1], singularGreen[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 280, 196, 280);
    
    // Informações do rodapé
    doc.setFontSize(7);
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.setFont("helvetica", "normal");
    
    // Esquerda: Código e versão
    doc.text(`${pop.codigoPOP} • v${pop.versao}`, 14, 285);
    
    // Centro: Documento controlado
    doc.text("[DOC] Documento controlado - Singular Servicos", 105, 285, { align: "center" });
    
    // Direita: Paginação
    doc.text(`Pagina ${i}/${pageCount}`, 196, 285, { align: "right" });
    
    // Segunda linha: Data de emissão
    doc.setFontSize(6);
    doc.text(`Emissao: ${new Date(pop.dataEmissao).toLocaleDateString("pt-BR")}`, 14, 289);
    doc.text("[REV] Revisao anual ou a cada alteracao de processo", 105, 289, { align: "center" });
    doc.text(`${pop.responsavelElaboracao} / ${pop.aprovadoPor}`, 196, 289, { align: "right" });
  }
  
  return doc;
};

export const downloadPDF = async (pop: POP, activity: Activity) => {
  const doc = await generatePDF(pop, activity);
  const fileName = `POP_${pop.codigoPOP}_${pop.condominioNome.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};
