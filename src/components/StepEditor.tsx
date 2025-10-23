import { ProcedureStep } from "@/types/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StepEditorProps {
  steps: ProcedureStep[];
  onStepsChange: (steps: ProcedureStep[]) => void;
}

export const StepEditor = ({ steps, onStepsChange }: StepEditorProps) => {
  const handleStepChange = (index: number, field: keyof ProcedureStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onStepsChange(newSteps);
  };

  const handleAddStep = () => {
    const newStep: ProcedureStep = {
      id: `S${steps.length + 1}`,
      title: "",
      instruction: "",
      why: "",
      who: "",
      time_estimate_min: 0,
      safety: "",
      quality_check: "",
      evidence: ""
    };
    onStepsChange([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onStepsChange(newSteps);
  };

  const totalTime = steps.reduce((sum, step) => sum + (step.time_estimate_min || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">3️⃣ Customizar Procedimentos (Opcional)</h3>
          <p className="text-sm text-muted-foreground">
            Edite os passos conforme necessidades específicas do condomínio
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Tempo total: {totalTime} min
        </Badge>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  Etapa {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStep(index)}
                  className="h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Título da Etapa</Label>
                  <Input
                    id={`title-${index}`}
                    value={step.title}
                    onChange={(e) => handleStepChange(index, "title", e.target.value)}
                    placeholder="Ex: Acolhimento e triagem"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`time-${index}`}>Tempo Estimado (min)</Label>
                  <Input
                    id={`time-${index}`}
                    type="number"
                    value={step.time_estimate_min}
                    onChange={(e) => handleStepChange(index, "time_estimate_min", parseFloat(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`instruction-${index}`}>O que fazer</Label>
                <Textarea
                  id={`instruction-${index}`}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(index, "instruction", e.target.value)}
                  placeholder="Descreva o que deve ser feito nesta etapa"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`why-${index}`}>Por quê</Label>
                  <Textarea
                    id={`why-${index}`}
                    value={step.why}
                    onChange={(e) => handleStepChange(index, "why", e.target.value)}
                    placeholder="Justificativa desta etapa"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`who-${index}`}>Responsável</Label>
                  <Input
                    id={`who-${index}`}
                    value={step.who}
                    onChange={(e) => handleStepChange(index, "who", e.target.value)}
                    placeholder="Ex: Porteiro"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`safety-${index}`}>Segurança</Label>
                <Textarea
                  id={`safety-${index}`}
                  value={step.safety}
                  onChange={(e) => handleStepChange(index, "safety", e.target.value)}
                  placeholder="Orientações de segurança"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`quality-${index}`}>Controle de Qualidade</Label>
                  <Textarea
                    id={`quality-${index}`}
                    value={step.quality_check}
                    onChange={(e) => handleStepChange(index, "quality_check", e.target.value)}
                    placeholder="Como verificar se foi bem feito"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`evidence-${index}`}>Evidência</Label>
                  <Textarea
                    id={`evidence-${index}`}
                    value={step.evidence}
                    onChange={(e) => handleStepChange(index, "evidence", e.target.value)}
                    placeholder="Como comprovar a execução"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleAddStep} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Nova Etapa
      </Button>
    </div>
  );
};
