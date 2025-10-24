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
import { getCustomCatalog } from "@/utils/catalogStorage";
import { FunctionSelector } from "./FunctionSelector";
import { ActivitySelector } from "./ActivitySelector";
import { POPPreviewEnhanced } from "./POPPreviewEnhanced";
import { StepEditor } from "./StepEditor";
import { ArrowLeft, FileDown, Info } from "lucide-react";
import { useZonas } from "@/hooks/useZonas";
import { useAuth } from "@/contexts/AuthContext";

interface POPFormProps {
  onBack: () => void;
  onSave: () => void;
}

export const POPForm = ({ onBack, onSave }: POPFormProps) => {
  const { toast } = useToast();
  const catalog = getCustomCatalog();
  const { zonas } = useZonas();
  const { profile } = useAuth();
  
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>("");
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [useCustomSteps, setUseCustomSteps] = useState(false);
  const [customSteps, setCustomSteps] = useState<ProcedureStep[]>([]);
  const [zonaId, setZonaId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    condominioNome: "",
    versao: "01",
    dataRevisao: new Date().toISOString().split("T")[0],
    responsavelElaboracao: "",
    nomeColaborador: "",
    dataApresentacao: new Date().toISOString().split("T")[0],
    observacoes: ""
  });

  // Autopreencher zona e responsável pela elaboração do usuário logado
  useEffect(() => {
    if (profile?.zona_id) {
      setZonaId(profile.zona_id);
    }
    if (profile?.full_name) {
      setFormData(prev => ({
        ...prev,
        responsavelElaboracao: profile.full_name
      }));
    }
  }, [profile]);

  useEffect(() => {
    const draft = localStorage.getItem("pop_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const draftData = parsed.formData || formData;
        // Remover responsavelElaboracao do draft para sempre usar o do profile
        const { responsavelElaboracao, ...restFormData } = draftData;
        setFormData({ ...formData, ...restFormData });
        setSelectedFunctionId(parsed.selectedFunctionId || "");
        setSelectedActivityId(parsed.selectedActivityId || "");
        setUseCustomSteps(parsed.useCustomSteps || false);
        setCustomSteps(parsed.customSteps || []);
        // Não carregar zonaId e responsavelElaboracao do draft, sempre usar do profile
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
      customSteps,
      zonaId
    };
    localStorage.setItem("pop_draft", JSON.stringify(draft));
  }, [formData, selectedFunctionId, selectedActivityId, useCustomSteps, customSteps, zonaId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDataApresentacaoChange = (value: string) => {
    const dataRevisao = new Date(formData.dataRevisao);
    const dataApresentacao = new Date(value);
    const diffDays = Math.ceil((dataApresentacao.getTime() - dataRevisao.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) {
      toast({
        title: "Data inválida",
        description: "A data de apresentação não pode ser mais de 7 dias após a data de revisão.",
        variant: "destructive"
      });
      return;
    }
    
    handleInputChange("dataApresentacao", value);
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

  const handleGeneratePDF = async () => {
    if (!selectedFunctionId || !selectedActivityId) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione uma função e uma atividade antes de gerar o PDF.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.condominioNome || !formData.responsavelElaboracao || !formData.nomeColaborador || !zonaId) {
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
      dataRevisao: formData.dataRevisao,
      responsavelElaboracao: formData.responsavelElaboracao,
      nomeColaborador: formData.nomeColaborador,
      dataApresentacao: formData.dataApresentacao,
      observacoes: formData.observacoes,
      customSteps: useCustomSteps ? customSteps : undefined,
      createdAt: new Date().toISOString()
    };

    savePOP(pop);
    await downloadPDF(pop, selectedActivity!);
    
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
                  <Label htmlFor="versao">Versão</Label>
                  <Input id="versao" value={formData.versao} onChange={(e) => handleInputChange("versao", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRevisao">Revisado em</Label>
                  <Input
                    id="dataRevisao"
                    type="date"
                    value={formData.dataRevisao}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Data de revisão é automaticamente definida como hoje
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataApresentacao">Data de Apresentação *</Label>
                  <Input
                    id="dataApresentacao"
                    type="date"
                    value={formData.dataApresentacao}
                    onChange={(e) => handleDataApresentacaoChange(e.target.value)}
                    min={formData.dataRevisao}
                    max={(() => {
                      const maxDate = new Date(formData.dataRevisao);
                      maxDate.setDate(maxDate.getDate() + 7);
                      return maxDate.toISOString().split("T")[0];
                    })()}
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo: 7 dias após a data de revisão
                  </p>
                </div>

            <div className="space-y-2">
              <Label htmlFor="responsavelElaboracao">Responsável pela Elaboração</Label>
              <Input
                id="responsavelElaboracao"
                value={formData.responsavelElaboracao}
                disabled
                className="bg-muted cursor-not-allowed"
                placeholder="Nome será preenchido automaticamente"
              />
              <p className="text-xs text-muted-foreground">
                Nome do usuário logado: {profile?.full_name || "Carregando..."}
              </p>
            </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeColaborador">Nome do Colaborador *</Label>
                  <Input
                    id="nomeColaborador"
                    value={formData.nomeColaborador}
                    onChange={(e) => handleInputChange("nomeColaborador", e.target.value)}
                    placeholder="Nome completo do colaborador"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zona">Zona Operativa</Label>
                  <Select value={zonaId} onValueChange={setZonaId} disabled>
                    <SelectTrigger id="zona" className="bg-muted cursor-not-allowed">
                      <SelectValue placeholder="Zona será preenchida automaticamente" />
                    </SelectTrigger>
                    <SelectContent>
                      {zonas.map((zona) => (
                        <SelectItem key={zona.id} value={zona.id}>
                          {zona.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Zona atribuída ao seu perfil: {zonas.find(z => z.id === zonaId)?.nome || "Carregando..."}
                  </p>
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
