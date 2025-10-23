import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { POP } from "@/types/pop";
import { Activity } from "@/types/schema";

export const generatePDF = (pop: POP, activity: Activity) => {
  const doc = new jsPDF();
  
  // Cores Singular
  const primaryGreen = [0, 122, 100]; // #007A64
  const primaryBlue = [26, 53, 92]; // #1A355C
  
  // Cabeçalho com gradiente simulado
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, 210, 35, "F");
  
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 28, 210, 7, "F");
  
  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SINGULAR SERVIÇOS", 105, 15, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("Procedimento Operacional Padrão", 105, 23, { align: "center" });
  
  // Resetar cor do texto
  doc.setTextColor(26, 53, 92);
  
  // Tipo do POP
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(pop.tipoPOP.toUpperCase(), 14, 48);
  
  // Informações do documento
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const infoData = [
    [`Condomínio:`, pop.condominioNome],
    [`Código:`, pop.codigoPOP],
    [`Versão:`, pop.versao],
    [`Data de emissão:`, new Date(pop.dataEmissao).toLocaleDateString("pt-BR")],
    [`Elaborado por:`, pop.responsavelElaboracao],
    [`Aprovado por:`, pop.aprovadoPor],
  ];
  
  if (pop.turno) {
    const turnoLabel = pop.turno === "24h" ? "24 horas" :
                       pop.turno === "12h-diurno" ? "12 horas diurno (06h-18h)" :
                       pop.turno === "12h-noturno" ? "12 horas noturno (18h-06h)" :
                       pop.turno === "8h-comercial" ? "8 horas comercial" : "Não aplicável";
    infoData.push([`Turno:`, turnoLabel]);
  }
  
  const info = infoData;
  
  autoTable(doc, {
    startY: 52,
    body: info,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35 },
      1: { cellWidth: "auto" },
    },
  });
  
  let yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // 1. Objetivo
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("1. OBJETIVO", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  const objetivoLines = doc.splitTextToSize(activity.objective, 180);
  doc.text(objetivoLines, 14, yPosition);
  yPosition += objetivoLines.length * 5 + 8;
  
  // 2. Campo de Aplicação
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("2. CAMPO DE APLICAÇÃO", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  const scopeText = activity.scope || "Aplicável a todas as situações relacionadas a esta atividade.";
  const aplicacaoLines = doc.splitTextToSize(scopeText, 180);
  doc.text(aplicacaoLines, 14, yPosition);
  yPosition += aplicacaoLines.length * 5 + 8;
  
  // 3. Pré-requisitos
  if (activity.prerequisites && activity.prerequisites.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text("3. PRÉ-REQUISITOS", 14, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 53, 92);
    
    activity.prerequisites.forEach((prereq) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      const prereqLines = doc.splitTextToSize(`• ${prereq}`, 180);
      doc.text(prereqLines, 14, yPosition);
      yPosition += prereqLines.length * 5 + 2;
    });
    
    yPosition += 8;
  }
  
  // 4. Responsabilidades
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`${activity.prerequisites ? '4' : '3'}. RESPONSABILIDADES`, 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  
  activity.responsibilities.forEach((resp) => {
    if (yPosition > 275) {
      doc.addPage();
      yPosition = 20;
    }
    const respLines = doc.splitTextToSize(`• ${resp}`, 180);
    doc.text(respLines, 14, yPosition);
    yPosition += respLines.length * 5 + 2;
  });
  
  yPosition += 8;
  
  // 5. Procedimentos Detalhados
  const sectionNum = activity.prerequisites ? 5 : 4;
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`${sectionNum}. PROCEDIMENTOS`, 14, yPosition);
  yPosition += 7;
  
  const steps = pop.customSteps || activity.procedure.steps;
  
  steps.forEach((step, index) => {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Título do step
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text(`${sectionNum}.${index + 1}. ${step.title}`, 14, yPosition);
    yPosition += 6;
    
    doc.setFontSize(9);
    doc.setTextColor(26, 53, 92);
    
    // Instrução
    doc.setFont("helvetica", "bold");
    doc.text("O que fazer:", 18, yPosition);
    doc.setFont("helvetica", "normal");
    const instrLines = doc.splitTextToSize(step.instruction, 175);
    doc.text(instrLines, 18, yPosition + 4);
    yPosition += instrLines.length * 4 + 6;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Por quê
    doc.setFont("helvetica", "bold");
    doc.text("Por quê:", 18, yPosition);
    doc.setFont("helvetica", "normal");
    const whyLines = doc.splitTextToSize(step.why, 175);
    doc.text(whyLines, 18, yPosition + 4);
    yPosition += whyLines.length * 4 + 6;
    
    // Info compacta (who, time)
    doc.setFont("helvetica", "normal");
    doc.text(`Responsável: ${step.who} | Tempo: ${step.time_estimate_min} min`, 18, yPosition);
    yPosition += 5;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Segurança
    if (step.safety) {
      doc.setFont("helvetica", "bold");
      doc.text("⚠ Segurança:", 18, yPosition);
      doc.setFont("helvetica", "normal");
      const safetyLines = doc.splitTextToSize(step.safety, 175);
      doc.text(safetyLines, 18, yPosition + 4);
      yPosition += safetyLines.length * 4 + 6;
    }
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Controle de Qualidade
    if (step.quality_check) {
      doc.setFont("helvetica", "bold");
      doc.text("✓ Controle:", 18, yPosition);
      doc.setFont("helvetica", "normal");
      const qcLines = doc.splitTextToSize(step.quality_check, 175);
      doc.text(qcLines, 18, yPosition + 4);
      yPosition += qcLines.length * 4 + 6;
    }
    
    // Evidência
    if (step.evidence) {
      doc.setFont("helvetica", "bold");
      doc.text("📋 Evidência:", 18, yPosition);
      doc.setFont("helvetica", "normal");
      const evidLines = doc.splitTextToSize(step.evidence, 175);
      doc.text(evidLines, 18, yPosition + 4);
      yPosition += evidLines.length * 4 + 6;
    }
    
    yPosition += 3;
  });
  
  yPosition += 5;
  
  // 6. Equipamentos e Materiais
  const equipSectionNum = activity.prerequisites ? 6 : 5;
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`${equipSectionNum}. EQUIPAMENTOS E MATERIAIS`, 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setTextColor(26, 53, 92);
  
  // EPC
  if (activity.equipment.epc.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("EPC (Equipamento de Proteção Coletiva):", 14, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    activity.equipment.epc.forEach((item) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${item}`, 18, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  }
  
  // EPI
  if (activity.equipment.epi.length > 0) {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text("EPI (Equipamento de Proteção Individual):", 14, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    activity.equipment.epi.forEach((item) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${item}`, 18, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  }
  
  // Ferramentas
  if (activity.equipment.tools.length > 0) {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text("Ferramentas:", 14, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    activity.equipment.tools.forEach((item) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${item}`, 18, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  }
  
  // Consumíveis
  if (activity.equipment.consumables.length > 0) {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text("Consumíveis:", 14, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    activity.equipment.consumables.forEach((item) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${item}`, 18, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  }
  
  yPosition += 5;
  
  
  // 7. Treinamento Obrigatório
  const trainSectionNum = activity.prerequisites ? 7 : 6;
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`${trainSectionNum}. TREINAMENTO OBRIGATÓRIO`, 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  
  doc.setFont("helvetica", "bold");
  doc.text("Módulos de treinamento:", 14, yPosition);
  yPosition += 5;
  
  doc.setFont("helvetica", "normal");
  activity.training.modules.forEach((module) => {
    if (yPosition > 275) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`• ${module}`, 18, yPosition);
    yPosition += 5;
  });
  
  yPosition += 3;
  doc.setFont("helvetica", "bold");
  doc.text(`Reciclagem: a cada ${activity.training.refresh_cadence_days} dias`, 14, yPosition);
  yPosition += 8;
  
  // 8. Indicadores de Desempenho e Auditoria
  const kpiSectionNum = activity.prerequisites ? 8 : 7;
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`${kpiSectionNum}. INDICADORES DE DESEMPENHO`, 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  
  doc.setFont("helvetica", "bold");
  doc.text("KPIs de controle:", 14, yPosition);
  yPosition += 5;
  
  doc.setFont("helvetica", "normal");
  activity.review.kpis.forEach((kpi) => {
    if (yPosition > 275) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`• ${kpi}`, 18, yPosition);
    yPosition += 5;
  });
  
  yPosition += 3;
  doc.setFont("helvetica", "bold");
  doc.text(`Auditoria: a cada ${activity.review.audit_frequency_days} dias`, 14, yPosition);
  yPosition += 5;
  doc.text(`Auditor responsável: ${activity.review.auditor_role}`, 14, yPosition);
  yPosition += 8;
  
  // 9. Observações Específicas do Condomínio
  const obsSectionNum = activity.prerequisites ? 9 : 8;
  if (pop.observacoes && pop.observacoes.trim()) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text(`${obsSectionNum}. OBSERVAÇÕES ESPECÍFICAS DO CONDOMÍNIO`, 14, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 53, 92);
    const obsLines = doc.splitTextToSize(pop.observacoes, 180);
    doc.text(obsLines, 14, yPosition);
    yPosition += obsLines.length * 5 + 8;
  }
  
  // 10. Controle de Versão
  const versionSectionNum = pop.observacoes ? obsSectionNum + 1 : obsSectionNum;
  if (yPosition > 260) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`${versionSectionNum}. CONTROLE DE VERSÃO`, 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setTextColor(26, 53, 92);
  
  doc.setFont("helvetica", "bold");
  doc.text(`Versão atual: ${activity.versioning.current_version}`, 14, yPosition);
  yPosition += 5;
  doc.text(`Última revisão: ${new Date(activity.versioning.last_review_date).toLocaleDateString('pt-BR')}`, 14, yPosition);
  yPosition += 7;
  
  if (activity.versioning.changelog.length > 0) {
    doc.text("Histórico de alterações:", 14, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    activity.versioning.changelog.forEach((change) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${change}`, 18, yPosition);
      yPosition += 5;
    });
  }
  
  // Rodapé em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
    doc.text(
      "Documento controlado - Singular Serviços",
      105,
      285,
      { align: "center" }
    );
  }
  
  return doc;
};

export const downloadPDF = (pop: POP, activity: Activity) => {
  const doc = generatePDF(pop, activity);
  const fileName = `POP_${pop.codigoPOP}_${pop.condominioNome.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};
