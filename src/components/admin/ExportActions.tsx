import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FileDown, FileSpreadsheet, RotateCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { exportToPDF } from "@/utils/exportPDF";
import { exportToExcel } from "@/utils/exportExcel";
import { exportPOPsToExcel } from "@/utils/exportPOPsExcel";
import { DetailedPOP } from "./POPsTable";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalPOPs: number;
  totalZonas: number;
  usersByRole: { role: string; count: number }[];
  popsByZona: { zona: string; count: number }[];
  popsBySupervisor: { supervisor: string; zona: string; count: number }[];
  popsByFunction: { function: string; count: number }[];
}

interface ExportActionsProps {
  stats: Stats;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  detailedPOPs?: DetailedPOP[];
}

export const ExportActions = ({ stats, dateRange, setDateRange, detailedPOPs = [] }: ExportActionsProps) => {
  const { isGerenteGeral } = useRole();
  const [isExporting, setIsExporting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleQuickRange = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date()
    });
    setDatePickerOpen(false);
  };

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date()
    });
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportToPDF(stats, dateRange);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(stats, dateRange);
      toast.success("Excel exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Erro ao exportar Excel");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPOPsExcel = async () => {
    try {
      setIsExporting(true);
      await exportPOPsToExcel(detailedPOPs, dateRange);
      toast.success("POPs detalhadas exportadas com sucesso!");
    } catch (error) {
      console.error("Error exporting POPs Excel:", error);
      toast.error("Erro ao exportar POPs detalhadas");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDateRange = () => {
    return `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Período:</span>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="font-normal">
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col space-y-2 p-3 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickRange(7)}
                className="justify-start"
              >
                Últimos 7 dias
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickRange(30)}
                className="justify-start"
              >
                Últimos 30 dias
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickRange(90)}
                className="justify-start"
              >
                Últimos 90 dias
              </Button>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                <label className="text-xs font-medium">Data Inicial</label>
                <CalendarComponent
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                  locale={ptBR}
                  className={cn("pointer-events-auto")}
                />
              </div>
              <div className="space-y-2 mt-3">
                <label className="text-xs font-medium">Data Final</label>
                <CalendarComponent
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                  locale={ptBR}
                  className={cn("pointer-events-auto")}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          title="Resetar filtros"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          size="sm"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
        <Button
          onClick={handleExportExcel}
          disabled={isExporting}
          variant="outline"
          size="sm"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
        {isGerenteGeral && detailedPOPs.length > 0 && (
          <Button
            onClick={handleExportPOPsExcel}
            disabled={isExporting}
            variant="outline"
            size="sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar POPs Detalhadas
          </Button>
        )}
      </div>
    </div>
  );
};