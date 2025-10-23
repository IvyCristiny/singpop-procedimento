import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Trash2, ShieldCheck, Eye, Sparkles, Shield, Trees, Waves, Wrench, UserCheck, Briefcase, Clock, FileText } from "lucide-react";
import { POP } from "@/types/pop";
import { downloadPDF } from "@/utils/pdfGenerator";
import { deletePOP } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { catalog } from "@/data/catalog";

const iconMap: Record<string, any> = {
  ShieldCheck,
  Eye,
  Sparkles,
  Shield,
  Trees,
  Waves,
  Wrench,
  UserCheck,
  Briefcase,
};

interface POPCardProps {
  pop: POP;
  onDelete: () => void;
}

export const POPCard = ({ pop, onDelete }: POPCardProps) => {
  const { toast } = useToast();
  
  // Buscar função e atividade do catálogo
  const func = catalog.functions.find(f => f.id === pop.functionId);
  const activity = func?.activities.find(a => a.id === pop.activityId);
  
  // Fallback para POPs migrados sem match
  const displayName = activity ? activity.name : "Atividade não encontrada";
  const functionName = func?.name || "Função desconhecida";
  
  // Usar ícone da função
  const IconComponent = func?.icon ? iconMap[func.icon] : FileText;

  const handleDownload = async () => {
    // Find activity from catalog
    const func = catalog.functions.find(f => f.id === pop.functionId);
    const activity = func?.activities.find(a => a.id === pop.activityId);
    
    if (activity) {
      await downloadPDF(pop, activity);
    } else {
      toast({
        title: "Erro ao gerar PDF",
        description: "Atividade não encontrada no catálogo.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este POP?")) {
      deletePOP(pop.id);
      toast({ title: "POP excluído com sucesso!" });
      onDelete();
    }
  };

  return (
    <Card className="p-4 hover:shadow-hover transition-shadow duration-300 border-l-4 border-l-primary">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg mb-1">
                {pop.condominioNome}
              </h3>
              <p className="text-sm text-muted-foreground">{functionName} - {displayName}</p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">v{pop.versao}</Badge>
        </div>

        {pop.turno && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              {pop.turno === "24h" ? "24 horas" :
               pop.turno === "12h-diurno" ? "12h diurno" :
               pop.turno === "12h-noturno" ? "12h noturno" :
               pop.turno === "8h-comercial" ? "8h comercial" : "Não aplicável"}
            </span>
          </div>
        )}

        <div className="space-y-1 text-xs text-muted-foreground">
          <p><span className="font-medium">Código:</span> {pop.codigoPOP}</p>
          <p><span className="font-medium">Criado em:</span> {new Date(pop.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleDownload} variant="outline" size="sm" className="flex-1">
            <FileDown className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
          <Button onClick={handleDelete} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
