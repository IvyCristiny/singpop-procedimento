import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DetailedPOP } from "@/components/admin/POPsTable";

export const exportPOPsToExcel = async (
  pops: DetailedPOP[],
  dateRange: { from: Date; to: Date }
) => {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Preparar dados das POPs
  const popsData = [
    ["POPs Detalhadas"],
    [],
    ["Período:", `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`],
    ["Gerado em:", format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })],
    ["Total de POPs:", pops.length],
    [],
    [
      "Código POP",
      "Condomínio",
      "Responsável",
      "Colaborador",
      "Função",
      "Atividades",
      "Data Criação"
    ],
    ...pops.map(pop => [
      pop.codigo_pop,
      pop.condominio_nome,
      pop.responsavel_nome,
      pop.nome_colaborador,
      pop.function_name,
      pop.activities_names.join(", "),
      format(new Date(pop.created_at), "dd/MM/yyyy", { locale: ptBR })
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(popsData);

  // Formatação das colunas
  if (!ws["!cols"]) ws["!cols"] = [];
  ws["!cols"][0] = { wch: 15 };  // Código POP
  ws["!cols"][1] = { wch: 30 };  // Condomínio
  ws["!cols"][2] = { wch: 25 };  // Responsável
  ws["!cols"][3] = { wch: 25 };  // Colaborador
  ws["!cols"][4] = { wch: 20 };  // Função
  ws["!cols"][5] = { wch: 50 };  // Atividades
  ws["!cols"][6] = { wch: 15 };  // Data Criação

  XLSX.utils.book_append_sheet(wb, ws, "POPs Detalhadas");

  // Salvar arquivo
  XLSX.writeFile(wb, `pops_detalhadas_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`);
};
