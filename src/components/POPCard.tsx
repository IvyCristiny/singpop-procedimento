import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileText } from "lucide-react";
import { POP, tiposPOP } from "@/types/pop";
import { downloadPDF } from "@/utils/pdfGenerator";
import { deletePOP } from "@/utils/storage";

interface POPCardProps {
  pop: POP;
  onDelete: () => void;
}

export const POPCard = ({ pop, onDelete }: POPCardProps) => {
  const tipoLabel = tiposPOP.find((t) => t.value === pop.tipoPOP)?.label || pop.tipoPOP;

  const handleDownload = () => {
    downloadPDF(pop);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este POP?")) {
      deletePOP(pop.id);
      onDelete();
    }
  };

  return (
    <Card className="p-4 hover:shadow-hover transition-shadow duration-300 bg-card border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-card-foreground truncate">
              {pop.condominioNome}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{tipoLabel}</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded">{pop.codigoPOP}</span>
            <span>Versão {pop.versao}</span>
            <span>•</span>
            <span>{new Date(pop.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
