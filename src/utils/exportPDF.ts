import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  totalUsers: number;
  totalPOPs: number;
  totalZonas: number;
  usersByRole: { role: string; count: number }[];
  popsByZona: { zona: string; count: number }[];
  popsBySupervisor: { supervisor: string; zona: string; count: number }[];
  popsByFunction: { function: string; count: number }[];
}

export const exportToPDF = async (
  stats: Stats,
  dateRange: { from: Date; to: Date }
) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Título
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de Estatísticas", 105, yPos, { align: "center" });
  
  yPos += 10;
  
  // Período
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const periodText = `Período: ${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
  doc.text(periodText, 105, yPos, { align: "center" });
  
  yPos += 5;
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 105, yPos, { align: "center" });
  doc.setTextColor(0);
  
  yPos += 15;

  // Resumo Geral
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Geral", 14, yPos);
  yPos += 7;

  autoTable(doc, {
    startY: yPos,
    head: [["Métrica", "Valor"]],
    body: [
      ["Total de Usuários", stats.totalUsers.toString()],
      ["Total de POPs", stats.totalPOPs.toString()],
      ["Total de Zonas", stats.totalZonas.toString()],
    ],
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Usuários por Role
  if (stats.usersByRole.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Usuários por Role", 14, yPos);
    yPos += 7;

    autoTable(doc, {
      startY: yPos,
      head: [["Role", "Quantidade"]],
      body: stats.usersByRole.map(item => [item.role, item.count.toString()]),
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // POPs por Zona
  if (stats.popsByZona.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POPs por Zona", 14, yPos);
    yPos += 7;

    autoTable(doc, {
      startY: yPos,
      head: [["Zona", "Quantidade de POPs"]],
      body: stats.popsByZona.map(item => [item.zona, item.count.toString()]),
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // POPs por Supervisor
  if (stats.popsBySupervisor.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POPs por Supervisor", 14, yPos);
    yPos += 7;

    autoTable(doc, {
      startY: yPos,
      head: [["Supervisor", "Zona", "Quantidade de POPs"]],
      body: stats.popsBySupervisor.map(item => [
        item.supervisor,
        item.zona,
        item.count.toString()
      ]),
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // POPs por Função
  if (stats.popsByFunction.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POPs por Função", 14, yPos);
    yPos += 7;

    autoTable(doc, {
      startY: yPos,
      head: [["Função", "Quantidade de POPs"]],
      body: stats.popsByFunction.map(item => [item.function, item.count.toString()]),
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: 14, right: 14 },
    });
  }

  // Adicionar numeração de páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Salvar PDF
  doc.save(`estatisticas_${format(new Date(), "yyyy-MM-dd_HHmm")}.pdf`);
};