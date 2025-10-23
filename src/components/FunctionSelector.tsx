import { Function } from "@/types/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Trees, Wrench, Eye, Waves, UserCheck, Briefcase, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FunctionSelectorProps {
  functions: Function[];
  selectedFunctionId?: string;
  onSelectFunction: (functionId: string) => void;
}

const iconMap: Record<string, any> = {
  ShieldCheck,
  Sparkles,
  Trees,
  Wrench,
  Eye,
  Waves,
  UserCheck,
  Briefcase,
  Shield
};

export const FunctionSelector = ({ functions, selectedFunctionId, onSelectFunction }: FunctionSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">1️⃣ Selecione a Função</h3>
        <p className="text-sm text-muted-foreground">Escolha a área de atuação do colaborador</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {functions.map((func) => {
          const IconComponent = iconMap[func.icon] || ShieldCheck;
          const isSelected = selectedFunctionId === func.id;
          
          return (
            <Card
              key={func.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
              onClick={() => onSelectFunction(func.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{func.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">{func.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {func.activities.length} {func.activities.length === 1 ? 'atividade' : 'atividades'}
                  </Badge>
                  {isSelected && (
                    <Badge className="text-xs">Selecionada</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
