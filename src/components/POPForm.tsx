import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { POP } from "@/types/pop";
import { ProcedureStep } from "@/types/schema";
import { savePOP, generatePOPCode } from "@/utils/storage";
import { downloadPDF } from "@/utils/pdfGenerator";
import { catalog } from "@/data/catalog";
import { FunctionSelector } from "./FunctionSelector";
import { ActivitySelector } from "./ActivitySelector";
import { POPPreviewEnhanced } from "./POPPreviewEnhanced";
import { StepEditor } from "./StepEditor";
import { ArrowLeft, FileDown, Info } from "lucide-react";

interface POPFormProps {
  onBack: () => void;
  onSave: () => void;
}

const turnosDisponiveis = [
  { value: "24h", label: "24 horas" },
  { value: "12h-diurno", label: "12 horas - Diurno (06h-18h)" },
  { value: "12h-noturno", label: "12 horas - Noturno (18h-06h)" },
  { value: "8h", label: "8 horas - Comercial" },
  { value: "n/a", label: "Não aplicável" }
];

export const POPForm = ({ onBack, onSave }: POPFormProps) => {
  const { toast } = useToast();
  
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>("");
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [useCustomSteps, setUseCustomSteps] = useState(false);
  const [customSteps, setCustomSteps] = useState<ProcedureStep[]>([]);
  
  const [formData, setFormData] = useState({
    condominioNome: "",
    versao: "01",
    dataEmissao: new Date().toISOString().split("T")[0],
    responsavelElaboracao: "",
    aprovadoPor: "",
    turno: "",
    observacoes: ""
  });

  useEffect(() => {
    const draft = localStorage.getItem("pop_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed.formData || formData);
        setSelectedFunctionId(parsed.selectedFunctionId || "");
        setSelectedActivityId(parsed.selectedActivityId || "");
        setUseCustomSteps(parsed.useCustomSteps || false);
        setCustomSteps(parsed.customSteps || []);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  useEffect(() => {
    const draft = {
      formData,
      selectedFunctionId,
      selectedActivityId,
      useCustomSteps,
      customSteps
    };
    localStorage.setItem("pop_draft", JSON.stringify(draft));
  }, [formData, selectedFunctionId, selectedActivityId, useCustomSteps, customSteps]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFunctionSelect = (functionId: string) => {
    setSelectedFunctionId(functionId);
    setSelectedActivityId("");
    setUseCustomSteps(false);
    setCustomSteps([]);
  };

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivityId(activityId);
    setUseCustomSteps(false);
    
    const selectedFunction = catalog.functions.find(f => f.id === selectedFunctionId);
    const selectedActivity = selectedFunction?.activities.find(a => a.id === activityId);
    if (selectedActivity) {
      setCustomSteps([...selectedActivity.procedure.steps]);
    }
  };

  const handleGeneratePDF = () => {
    if (!selectedFunctionId || !selectedActivityId) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione uma função e uma atividade antes de gerar o PDF.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.condominioNome || !formData.responsavelElaboracao || !formData.aprovadoPor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de gerar o PDF.",
        variant: "destructive"
      });
      return;
    }

    const selectedFunction = catalog.functions.find(f => f.id === selectedFunctionId);
    const selectedActivity = selectedFunction?.activities.find(a => a.id === selectedActivityId);

    if (!selectedActivity) {
      toast({
        title: "Erro",
        description: "Atividade não encontrada.",
        variant: "destructive"
      });
      return;
    }

    const codigoPOP = generatePOPCode(selectedActivityId);

    const pop: POP = {
      id: Date.now().toString(),
      condominioNome: formData.condominioNome,
      functionId: selectedFunctionId,
      activityId: selectedActivityId,
      codigoPOP,
      versao: formData.versao,
      dataEmissao: formData.dataEmissao,
      responsavelElaboracao: formData.responsavelElaboracao,
      aprovadoPor: formData.aprovadoPor,
      turno: formData.turno,
      observacoes: formData.observacoes,
      customSteps: useCustomSteps ? customSteps : undefined,
      createdAt: new Date().toISOString()
    };

    savePOP(pop);
    downloadPDF(pop, selectedActivity);
    
    localStorage.removeItem("pop_draft");
    
    toast({
      title: "POP gerado com sucesso!",
      description: `Código: ${codigoPOP}`,
    });
    
    onSave();
  };

  const selectedFunction = catalog.functions.find(f => f.id === selectedFunctionId);
  const selectedActivity = selectedFunction?.activities.find(a => a.id === selectedActivityId);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <CardTitle>Novo POP - Sistema Hierárquico</CardTitle>
              <div className="w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FunctionSelector
              functions={catalog.functions}
              selectedFunctionId={selectedFunctionId}
              onSelectFunction={handleFunctionSelect}
            />

            {selectedFunctionId && selectedFunction && (
              <>
                <Separator />
                <ActivitySelector
                  activities={selectedFunction.activities}
                  selectedActivityId={selectedActivityId}
                  onSelectActivity={handleActivitySelect}
                />
              </>
            )}

            {selectedActivity && (
              <>
                <Separator />
                <POPPreviewEnhanced activity={selectedActivity} />
                
                <Separator />
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-sm">Customizar procedimentos?</p>
                      <p className="text-xs text-muted-foreground">
                        Ative para editar os passos conforme necessidades específicas
                      </p>
                    </div>
                  </div>
                  <Switch checked={useCustomSteps} onCheckedChange={setUseCustomSteps} />
                </div>

                {useCustomSteps && <StepEditor steps={customSteps} onStepsChange={setCustomSteps} />}
                
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados do Condomínio</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="condominioNome">Nome do Condomínio *</Label>
                      <Input
                        id="condominioNome"
                        value={formData.condominioNome}
                        onChange={(e) => handleInputChange("condominioNome", e.target.value)}
                        placeholder="Ex: Condomínio Residencial Singular"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="turno">Turno/Jornada</Label>
                      <Select value={formData.turno} onValueChange={(value) => handleInputChange("turno", value)}>
                        <SelectTrigger id="turno">
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {turnosDisponiveis.map((turno) => (
                            <SelectItem key={turno.value} value={turno.value}>
                              {turno.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="versao">Versão</Label>
                      <Input id="versao" value={formData.versao} onChange={(e) => handleInputChange("versao", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataEmissao">Data de Emissão</Label>
                      <Input
                        id="dataEmissao"
                        type="date"
                        value={formData.dataEmissao}
                        onChange={(e) => handleInputChange("dataEmissao", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsavelElaboracao">Responsável pela Elaboração *</Label>
                      <Input
                        id="responsavelElaboracao"
                        value={formData.responsavelElaboracao}
                        onChange={(e) => handleInputChange("responsavelElaboracao", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aprovadoPor">Aprovado Por *</Label>
                      <Input
                        id="aprovadoPor"
                        value={formData.aprovadoPor}
                        onChange={(e) => handleInputChange("aprovadoPor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações Personalizadas</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange("observacoes", e.target.value)}
                      placeholder="Adicione instruções específicas do condomínio (opcional)"
                      rows={4}
                    />
                  </div>
                </div>
                
                <Separator />
                <Button onClick={handleGeneratePDF} className="w-full gap-2" size="lg">
                  <FileDown className="w-5 h-5" />
                  Gerar PDF do POP
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
