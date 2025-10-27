import * as XLSX from "xlsx";
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

export const exportToExcel = async (
  stats: Stats,
  dateRange: { from: Date; to: Date }
) => {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Resumo
  const resumoData = [
    ["Relatório de Estatísticas"],
    [],
    ["Período:", `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`],
    ["Gerado em:", format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })],
    [],
    ["Métrica", "Valor"],
    ["Total de Usuários", stats.totalUsers],
    ["Total de POPs", stats.totalPOPs],
    ["Total de Zonas", stats.totalZonas],
  ];
  const resumoWS = XLSX.utils.aoa_to_sheet(resumoData);
  
  // Formatação do cabeçalho
  if (!resumoWS["!cols"]) resumoWS["!cols"] = [];
  resumoWS["!cols"][0] = { wch: 25 };
  resumoWS["!cols"][1] = { wch: 20 };
  
  XLSX.utils.book_append_sheet(wb, resumoWS, "Resumo");

  // Sheet 2: Usuários por Role
  if (stats.usersByRole.length > 0) {
    const rolesData = [
      ["Role", "Quantidade"],
      ...stats.usersByRole.map(item => [item.role, item.count])
    ];
    const rolesWS = XLSX.utils.aoa_to_sheet(rolesData);
    
    if (!rolesWS["!cols"]) rolesWS["!cols"] = [];
    rolesWS["!cols"][0] = { wch: 20 };
    rolesWS["!cols"][1] = { wch: 15 };
    
    XLSX.utils.book_append_sheet(wb, rolesWS, "Usuários por Role");
  }

  // Sheet 3: POPs por Zona
  if (stats.popsByZona.length > 0) {
    const zonasData = [
      ["Zona", "Quantidade de POPs"],
      ...stats.popsByZona.map(item => [item.zona, item.count])
    ];
    const zonasWS = XLSX.utils.aoa_to_sheet(zonasData);
    
    if (!zonasWS["!cols"]) zonasWS["!cols"] = [];
    zonasWS["!cols"][0] = { wch: 30 };
    zonasWS["!cols"][1] = { wch: 20 };
    
    XLSX.utils.book_append_sheet(wb, zonasWS, "POPs por Zona");
  }

  // Sheet 4: POPs por Supervisor
  if (stats.popsBySupervisor.length > 0) {
    const supervisorData = [
      ["Supervisor", "Zona", "Quantidade de POPs"],
      ...stats.popsBySupervisor.map(item => [
        item.supervisor,
        item.zona,
        item.count
      ])
    ];
    const supervisorWS = XLSX.utils.aoa_to_sheet(supervisorData);
    
    if (!supervisorWS["!cols"]) supervisorWS["!cols"] = [];
    supervisorWS["!cols"][0] = { wch: 25 };
    supervisorWS["!cols"][1] = { wch: 25 };
    supervisorWS["!cols"][2] = { wch: 20 };
    
    XLSX.utils.book_append_sheet(wb, supervisorWS, "POPs por Supervisor");
  }

  // Sheet 5: POPs por Função
  if (stats.popsByFunction.length > 0) {
    const functionData = [
      ["Função", "Quantidade de POPs"],
      ...stats.popsByFunction.map(item => [item.function, item.count])
    ];
    const functionWS = XLSX.utils.aoa_to_sheet(functionData);
    
    if (!functionWS["!cols"]) functionWS["!cols"] = [];
    functionWS["!cols"][0] = { wch: 30 };
    functionWS["!cols"][1] = { wch: 20 };
    
    XLSX.utils.book_append_sheet(wb, functionWS, "POPs por Função");
  }

  // Salvar arquivo
  XLSX.writeFile(wb, `estatisticas_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`);
};