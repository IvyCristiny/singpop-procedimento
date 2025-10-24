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
  
  // Cor verde Singular
  const singularGreen: [number, number, number] = [0, 120, 80];
  
  // Carregar logo em base64
  const logoBase64 = await getImageAsBase64(logoSingular);
  
  // ==================== CABEÇALHO SIMPLES ====================
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`SINGULAR | ${pop.condominioNome.toUpperCase()}`, 14, 15);
  
  // Logo no canto direito
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", 170, 8, 30, 12);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }
  
  // ==================== TABELA PRINCIPAL ====================
  const steps = pop.customSteps || activity.procedure.steps;
  
  // Preparar dados da tabela
  const tableData: any[] = [
    // Linha 1: Título + Revisado em
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
    // Linha 2: Nome da atividade + Data
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
    
    // Linha 3: 1. Objetivo (cabeçalho)
    [
      { 
        content: "1. Objetivo", 
        colSpan: 2,
        styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
      }
    ],
    // Linha 4: Conteúdo do objetivo
    [
      { 
        content: activity.objective, 
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ],
    
    // Linha 5: 2. Campo de Aplicação (cabeçalho)
    [
      { 
        content: "2. Campo de Aplicação", 
        colSpan: 2,
        styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
      }
    ],
    // Linha 6: Conteúdo do campo de aplicação
    [
      { 
        content: activity.scope || "Aplicável a todas as situações relacionadas a esta atividade.", 
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ],
    
    // Linha 7: 3. Responsabilidades (cabeçalho)
    [
      { 
        content: "3. Responsabilidades", 
        colSpan: 2,
        styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
      }
    ]
  ];
  
  // Adicionar cada responsabilidade como uma linha
  activity.responsibilities.forEach(resp => {
    tableData.push([
      { 
        content: `• ${resp}`, 
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ]);
  });
  
  // Adicionar seção de procedimentos
  tableData.push([
    { 
      content: "4. Procedimentos", 
      colSpan: 2,
      styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
    }
  ]);
  
  // Adicionar cada procedimento numerado
  steps.forEach((step, idx) => {
    tableData.push([
      { 
        content: `${idx + 1}. ${step.instruction}`, 
        colSpan: 2,
        styles: { fontSize: 9, cellPadding: 3 }
      }
    ]);
  });
  
  // Adicionar seção de registros
  tableData.push([
    { 
      content: "5. Registros", 
      colSpan: 2,
      styles: { fontStyle: "bold", fontSize: 11, textColor: singularGreen, cellPadding: 3 }
    }
  ]);
  
  // Preparar lista de registros baseado nos equipamentos
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
  
  // Adicionar seção de observações
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
  
  // Gerar a tabela
  autoTable(doc, {
    startY: 25,
    body: tableData,
    theme: "grid",
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      cellPadding: 4,
      textColor: [0, 0, 0],
      fontSize: 9,
      valign: "top"
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 66 }
    }
  });
  
  // ==================== RODAPÉ SIMPLES ====================
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Linha separadora simples
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(14, 280, 196, 280);
    
    // Rodapé simples
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    
    // Informações básicas - linha 1
    doc.text(`Código: ${pop.codigoPOP} | Versão: ${pop.versao}`, 14, 285);
    doc.text(`Página ${i}/${pageCount}`, 196, 285, { align: "right" });
    
    // Informações básicas - linha 2
    doc.text(`Elaborado por: ${pop.responsavelElaboracao} | Colaborador: ${pop.nomeColaborador}`, 14, 289);
    doc.text(`Apresentado em: ${new Date(pop.dataApresentacao).toLocaleDateString("pt-BR")}`, 196, 289, { align: "right" });
  }
  
  return doc;
};

export const downloadPDF = async (pop: POP, activity: Activity) => {
  const doc = await generatePDF(pop, activity);
  const fileName = `POP_${pop.codigoPOP}_${pop.condominioNome.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};
