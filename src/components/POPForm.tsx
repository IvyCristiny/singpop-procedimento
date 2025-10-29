import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { POP } from "@/types/pop";
import { Activity, ProcedureStep } from "@/types/schema";
import { generatePOPCode } from "@/utils/storage";
import { downloadPDF, downloadMultipleActivitiesPDF } from "@/utils/pdfGenerator";
import { useCatalog } from "@/hooks/useCatalog";
import { usePOPs } from "@/hooks/usePOPs";
import { FunctionSelector } from "./FunctionSelector";
import { ActivitySelector } from "./ActivitySelector";
import { POPPreviewEnhanced } from "./POPPreviewEnhanced";
import { StepEditor } from "./StepEditor";
import { ArrowLeft, FileDown, Info, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";

interface POPFormProps {
  onBack: () => void;
  onSave: () => void;
}

export const POPForm = ({ onBack, onSave }: POPFormProps) => {
  const { toast } = useToast();
  const { catalog, loading } = useCatalog();
  const { savePOP } = usePOPs();
  const { user, profile } = useAuth();
  const { isSupervisor } = useRole();
  
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>("");
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [useCustomSteps, setUseCustomSteps] = useState(false);
  const [customSteps, setCustomSteps] = useState<ProcedureStep[]>([]);
  const [zonaId, setZonaId] = useState<string>("");
  
  // Estados para múltiplas atividades
  const [useMultipleActivities, setUseMultipleActivities] = useState(false);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  
  // Estados para imagens anexas
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    condominioNome: "",
    versao: "01",
    dataRevisao: new Date().toISOString().split("T")[0],
    responsavelElaboracao: "",
    nomeColaborador: "",
    dataApresentacao: new Date().toISOString().split("T")[0],
    observacoes: ""
  });

  // Autopreencher zona e responsável pela elaboração
  useEffect(() => {
    if (profile?.zona_id) {
      setZonaId(profile.zona_id);
    }
    // Preencher responsável pela elaboração automaticamente com o usuário logado
    if (profile && !formData.responsavelElaboracao) {
      const displayName = profile.report_name || profile.full_name;
      setFormData(prev => ({ ...prev, responsavelElaboracao: displayName }));
    }
  }, [profile]);

  useEffect(() => {
    const draft = localStorage.getItem("pop_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const draftData = parsed.formData || formData;
        
        setFormData({ ...formData, ...draftData });
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
    
    const selectedFunction = catalog?.functions?.find(f => f.id === selectedFunctionId);
    const selectedActivity = selectedFunction?.activities.find(a => a.id === activityId);
    if (selectedActivity) {
      setCustomSteps([...selectedActivity.procedure.steps]);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Arquivo inválido",
          description: `${file.name} não é uma imagem válida.`,
          variant: "destructive"
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede 5MB.`,
          variant: "destructive"
        });
        continue;
      }

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      newImages.push(base64);
    }

    setAttachedImages(prev => [...prev, ...newImages]);
    setIsUploadingImage(false);
    
    if (newImages.length > 0) {
      toast({
        title: "Imagens adicionadas",
        description: `${newImages.length} imagem(ns) anexada(s) com sucesso.`
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida dos anexos."
    });
  };

  const handleGeneratePDF = async () => {
    // ✅ Validação detalhada de perfil completo
    if (isSupervisor && !profile?.zona_id) {
      toast({
        title: "❌ Perfil Incompleto - Não é Possível Criar POP",
        description: (
          <div className="space-y-2 mt-2">
            <p className="font-semibold">Seu cadastro está pendente de configuração:</p>
            <div className="space-y-1 ml-4">
              <p>✅ Cargo: <strong>Supervisor</strong></p>
              <p>❌ Zona Operativa: <strong className="text-destructive">Não atribuída</strong></p>
            </div>
            <p className="mt-3 text-sm bg-destructive/10 p-2 rounded">
              Entre em contato com o <strong>Gerente Geral</strong> para completar seu cadastro e atribuir uma zona operativa.
            </p>
          </div>
        ),
        variant: "destructive",
        duration: 15000,
      });
      return;
    }

    if (!selectedFunctionId) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione uma função antes de gerar o PDF.",
        variant: "destructive"
      });
      return;
    }

    if (useMultipleActivities && selectedActivityIds.length === 0) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione pelo menos uma atividade.",
        variant: "destructive"
      });
      return;
    }

    if (!useMultipleActivities && !selectedActivityId) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione uma atividade antes de gerar o PDF.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.condominioNome || !formData.nomeColaborador) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de gerar o PDF.",
        variant: "destructive"
      });
      return;
    }

    const selectedFunction = catalog?.functions?.find(f => f.id === selectedFunctionId);
    
    if (!selectedFunction) {
      toast({
        title: "Erro",
        description: "Função não encontrada.",
        variant: "destructive"
      });
      return;
    }

    if (useMultipleActivities) {
      // Gerar PDF com múltiplas atividades
      const activities = selectedActivityIds
        .map(id => selectedFunction.activities.find(a => a.id === id))
        .filter(Boolean) as Activity[];

      if (activities.length === 0) {
        toast({
          title: "Erro",
          description: "Nenhuma atividade válida selecionada.",
          variant: "destructive"
        });
        return;
      }

      const codigoPOP = generatePOPCode(selectedActivityIds[0]);
      
      const pop = {
        condominioNome: formData.condominioNome,
        functionId: selectedFunctionId,
        activityId: selectedActivityIds[0],
        activityIds: selectedActivityIds,
        codigoPOP,
        versao: formData.versao,
        dataRevisao: formData.dataRevisao,
        responsavelElaboracao: formData.responsavelElaboracao,
        nomeColaborador: formData.nomeColaborador,
        dataApresentacao: formData.dataApresentacao,
        observacoes: formData.observacoes,
      };

      // Separar salvamento e geração de PDF
      try {
        await savePOP(pop);
        console.log("POP salvo com sucesso:", codigoPOP);
        
        toast({
          title: "POP salvo com sucesso!",
          description: `Código: ${codigoPOP}. Gerando PDF...`,
        });
      } catch (saveError: any) {
        console.error("Erro ao salvar POP:", saveError);
        
        let errorMessage = "Erro desconhecido ao salvar";
        
        if (saveError.message === "SESSAO_EXPIRADA") {
          errorMessage = "Sua sessão expirou. Faça login novamente.";
        } else if (saveError.message === "DADOS_FALTANDO") {
          errorMessage = "Dados obrigatórios faltando. Verifique os campos.";
        } else if (saveError.message?.includes("zona")) {
          errorMessage = "Seu perfil está incompleto. Entre em contato com o administrador.";
        } else if (saveError.code === '42501') {
          errorMessage = "Você não tem permissão para realizar esta ação.";
        } else {
          errorMessage = saveError.message || "Erro desconhecido ao salvar";
        }
        
        toast({
          title: "Erro ao salvar POP",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Tentar gerar PDF
      try {
        await downloadMultipleActivitiesPDF(pop as POP, activities);
        console.log("PDF gerado com sucesso");
        
        localStorage.removeItem("pop_draft");
        
        toast({
          title: "PDF gerado com sucesso!",
          description: `${activities.length} atividades incluídas.`,
        });
        
        onSave();
      } catch (pdfError: any) {
        console.error("Erro ao gerar PDF:", pdfError);
        toast({
          title: "POP salvo, mas erro ao gerar PDF",
          description: "O POP foi salvo no sistema. Tente exportar novamente pela lista.",
          variant: "destructive"
        });
        onSave();
      }
    } else {
      // Gerar PDF com uma atividade (modo original)
      const selectedActivity = selectedFunction.activities.find(a => a.id === selectedActivityId);
      
      if (!selectedActivity) {
        toast({
          title: "Erro",
          description: "Atividade não encontrada.",
          variant: "destructive"
        });
        return;
      }

      const codigoPOP = generatePOPCode(selectedActivityId);

      const pop = {
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
        attachedImages: attachedImages.length > 0 ? attachedImages : undefined,
      };

      // Separar salvamento e geração de PDF
      try {
        await savePOP(pop);
        console.log("POP salvo com sucesso:", codigoPOP);
        
        toast({
          title: "POP salvo com sucesso!",
          description: `Código: ${codigoPOP}. Gerando PDF...`,
        });
      } catch (saveError: any) {
        console.error("Erro ao salvar POP:", saveError);
        
        let errorMessage = "Erro desconhecido ao salvar";
        
        if (saveError.message === "SESSAO_EXPIRADA") {
          errorMessage = "Sua sessão expirou. Faça login novamente.";
        } else if (saveError.message === "DADOS_FALTANDO") {
          errorMessage = "Dados obrigatórios faltando. Verifique os campos.";
        } else if (saveError.message?.includes("zona")) {
          errorMessage = "Seu perfil está incompleto. Entre em contato com o administrador.";
        } else if (saveError.code === '42501') {
          errorMessage = "Você não tem permissão para realizar esta ação.";
        } else {
          errorMessage = saveError.message || "Erro desconhecido ao salvar";
        }
        
        toast({
          title: "Erro ao salvar POP",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Tentar gerar PDF
      try {
        await downloadPDF(pop as POP, selectedActivity, attachedImages.length > 0 ? attachedImages : undefined);
        console.log("PDF gerado com sucesso");
        
        localStorage.removeItem("pop_draft");
        
        toast({
          title: "PDF gerado com sucesso!",
          description: "O download deve começar automaticamente.",
        });
        
        onSave();
      } catch (pdfError: any) {
        console.error("Erro ao gerar PDF:", pdfError);
        toast({
          title: "POP salvo, mas erro ao gerar PDF",
          description: "O POP foi salvo no sistema. Tente exportar novamente pela lista.",
          variant: "destructive"
        });
        onSave();
      }
    }
  };

  const selectedFunction = catalog?.functions?.find(f => f.id === selectedFunctionId);
  const selectedActivity = selectedFunction?.activities.find(a => a.id === selectedActivityId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-lg text-muted-foreground">Carregando biblioteca...</p>
      </div>
    );
  }

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
              <Label htmlFor="responsavelElaboracao">
                Responsável pela Elaboração *
                <span className="text-xs text-muted-foreground ml-2">(Preenchido automaticamente)</span>
              </Label>
              <Input
                id="responsavelElaboracao"
                value={formData.responsavelElaboracao}
                disabled
                className="bg-muted cursor-not-allowed"
              />
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
              functions={catalog?.functions || []}
              selectedFunctionId={selectedFunctionId}
              onSelectFunction={handleFunctionSelect}
            />

          {selectedFunctionId && selectedFunction && (
            <>
              <Separator />
              
              {/* Toggle para modo múltiplas atividades */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-sm">Gerar POP com múltiplas atividades?</p>
                    <p className="text-xs text-muted-foreground">
                      Cada atividade será uma página no mesmo PDF. Imagens não disponíveis neste modo.
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={useMultipleActivities} 
                  onCheckedChange={(checked) => {
                    setUseMultipleActivities(checked);
                    if (checked) {
                      setAttachedImages([]);
                      if (selectedActivityId) {
                        setSelectedActivityIds([selectedActivityId]);
                      }
                    } else {
                      if (selectedActivityIds.length > 0) {
                        setSelectedActivityId(selectedActivityIds[0]);
                      }
                      setSelectedActivityIds([]);
                    }
                  }}
                />
              </div>
              
              <Separator />
              
              <ActivitySelector
                activities={selectedFunction.activities}
                selectedActivityId={useMultipleActivities ? undefined : selectedActivityId}
                selectedActivityIds={useMultipleActivities ? selectedActivityIds : undefined}
                onSelectActivity={useMultipleActivities ? undefined : handleActivitySelect}
                onSelectMultipleActivities={useMultipleActivities ? setSelectedActivityIds : undefined}
                multiple={useMultipleActivities}
              />
            </>
          )}

            {selectedActivityId && selectedActivity && !useMultipleActivities && (
              <>
                <Separator />
                <POPPreviewEnhanced activity={selectedActivity} />
              </>
            )}
            
            {/* Seção de Imagens Anexas - apenas para atividade única */}
            {selectedActivityId && !useMultipleActivities && (
              <>
                <Separator />
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Anexar Imagens ao POP
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        As imagens serão adicionadas em páginas separadas ao final do PDF
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-upload">
                      Adicionar imagens (máx. 5MB cada)
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="cursor-pointer"
                    />
                  </div>

                  {attachedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {attachedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img} 
                            alt={`Anexo ${idx + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <p className="text-xs text-center mt-1 text-muted-foreground">
                            Anexo {idx + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedActivityId && selectedActivity && !useMultipleActivities && (
              <>
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
              </>
            )}
            
            {(selectedActivityId || selectedActivityIds.length > 0) && (
              <>
                <Separator />
                <Button 
                  onClick={handleGeneratePDF} 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={useMultipleActivities ? selectedActivityIds.length === 0 : !selectedActivityId}
                >
                  <FileDown className="w-5 h-5" />
                  {useMultipleActivities && selectedActivityIds.length > 0
                    ? `Gerar PDF com ${selectedActivityIds.length} Atividade${selectedActivityIds.length > 1 ? 's' : ''}`
                    : 'Gerar PDF do POP'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
