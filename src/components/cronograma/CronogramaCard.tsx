import { Cronograma } from "@/types/cronograma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Trash2, Download, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePOPs } from "@/hooks/usePOPs";

interface CronogramaCardProps {
  cronograma: Cronograma;
  onDelete: (id: string) => void;
  onEdit: (cronograma: Cronograma) => void;
  onExportPDF: (cronograma: Cronograma) => void;
  onExportExcel: (cronograma: Cronograma) => void;
}

export const CronogramaCard = ({
  cronograma,
  onDelete,
  onEdit,
  onExportPDF,
  onExportExcel,
}: CronogramaCardProps) => {
  const { pops } = usePOPs();

  const handleExportPDF = () => {
    onExportPDF(cronograma);
  };

  const handleExportExcel = () => {
    onExportExcel(cronograma);
  };
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{cronograma.titulo}</CardTitle>
            <Badge variant="outline">{cronograma.codigo}</Badge>
          </div>
          <Badge>{cronograma.versao}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{cronograma.condominio_nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{cronograma.turno}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{cronograma.periodicidade}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{cronograma.pop_ids.length} POPs</Badge>
            <Badge variant="secondary">{cronograma.rotina_diaria.length} atividades diárias</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(cronograma)}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportExcel}>
            <Download className="w-4 h-4 mr-1" />
            Excel
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="w-4 h-4 mr-1" />
                Deletar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o cronograma "{cronograma.titulo}"?
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(cronograma.id)}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
