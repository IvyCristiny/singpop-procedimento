import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { POP, popTemplates } from "@/types/pop";

export const generatePDF = (pop: POP) => {
  const doc = new jsPDF();
  const template = popTemplates[pop.tipoPOP];
  
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
  
  const info = [
    [`Condomínio:`, pop.condominioNome],
    [`Código:`, pop.codigoPOP],
    [`Versão:`, pop.versao],
    [`Data de emissão:`, new Date(pop.dataEmissao).toLocaleDateString("pt-BR")],
    [`Elaborado por:`, pop.responsavelElaboracao],
    [`Aprovado por:`, pop.aprovadoPor],
  ];
  
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
  const objetivoLines = doc.splitTextToSize(template.objetivo, 180);
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
  const aplicacaoLines = doc.splitTextToSize(template.aplicacao, 180);
  doc.text(aplicacaoLines, 14, yPosition);
  yPosition += aplicacaoLines.length * 5 + 8;
  
  // 3. Responsabilidades
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("3. RESPONSABILIDADES", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  const respLines = doc.splitTextToSize(template.responsabilidades, 180);
  doc.text(respLines, 14, yPosition);
  yPosition += respLines.length * 5 + 8;
  
  // 4. Procedimentos
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("4. PROCEDIMENTOS", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  
  template.procedimentos.forEach((proc, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    const procText = `${index + 1}. ${proc}`;
    const procLines = doc.splitTextToSize(procText, 175);
    doc.text(procLines, 18, yPosition);
    yPosition += procLines.length * 5 + 3;
  });
  
  yPosition += 5;
  
  // 5. Equipamentos e Materiais
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("5. EQUIPAMENTOS E MATERIAIS NECESSÁRIOS", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  
  template.equipamentos.forEach((equip) => {
    if (yPosition > 275) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`• ${equip}`, 18, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  
  // 6. Registros
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("6. REGISTROS", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  
  template.registros.forEach((reg) => {
    if (yPosition > 275) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`• ${reg}`, 18, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  
  // 7. Treinamento
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("7. TREINAMENTO", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  const treinamentoText = "Todos os funcionários envolvidos devem ser treinados neste procedimento antes de iniciar suas atividades. O treinamento deve ser registrado e atualizado sempre que houver mudanças no procedimento.";
  const treinamentoLines = doc.splitTextToSize(treinamentoText, 180);
  doc.text(treinamentoLines, 14, yPosition);
  yPosition += treinamentoLines.length * 5 + 8;
  
  // 8. Revisão
  if (yPosition > 260) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("8. REVISÃO", 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 53, 92);
  const revisaoText = "Este procedimento deve ser revisado anualmente ou sempre que houver mudanças significativas nas operações, equipamentos ou legislação aplicável.";
  const revisaoLines = doc.splitTextToSize(revisaoText, 180);
  doc.text(revisaoLines, 14, yPosition);
  
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

export const downloadPDF = (pop: POP) => {
  const doc = generatePDF(pop);
  const fileName = `POP_${pop.codigoPOP}_${pop.condominioNome.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};
