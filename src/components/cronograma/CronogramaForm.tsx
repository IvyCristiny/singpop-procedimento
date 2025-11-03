import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCronogramas } from "@/hooks/useCronogramas";
import { usePOPs } from "@/hooks/usePOPs";
import { Cronograma, RotinaHorario, RotinaSemanal, turnosDisponiveis, RotinaConfig } from "@/types/cronograma";
import { POPSelector } from "./POPSelector";
import { RotinaDiariaEditor } from "./RotinaDiariaEditor";
import { RotinaSemanalEditor } from "./RotinaSemanalEditor";
import { RotinaConfigDialog } from "./RotinaConfigDialog";
import { generateRotinaFromPOPs } from "@/utils/cronogramaGenerator";
import { catalog } from "@/data/catalog";
import { exportCronogramaPDF } from "@/utils/exportCronogramaPDF";
import { X, Save, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface CronogramaFormProps {
  cronograma?: Cronograma;
  onClose: () => void;
  onSave: () => void;
}

export const CronogramaForm = ({ cronograma, onClose, onSave }: CronogramaFormProps) => {
  const { toast } = useToast();
  const { saveCronograma, updateCronograma } = useCronogramas();
  const { pops } = usePOPs();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoFilled, setAutoFilled] = useState<string[]>([]);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Estados do formulário
  const [titulo, setTitulo] = useState(cronograma?.titulo || "");
  const [condominioNome, setCondominioNome] = useState(cronograma?.condominio_nome || "");
  const [versao, setVersao] = useState(cronograma?.versao || "1");
  const [turno, setTurno] = useState(cronograma?.turno || "");
  const [periodicidade, setPeriodicidade] = useState(cronograma?.periodicidade || "");
  const [responsavel, setResponsavel] = useState(cronograma?.responsavel || "");
  const [supervisao, setSupervisao] = useState(cronograma?.supervisao || "");
  const [selectedPOPIds, setSelectedPOPIds] = useState<string[]>(cronograma?.pop_ids || []);
  const [rotinaDiaria, setRotinaDiaria] = useState<RotinaHorario[]>(cronograma?.rotina_diaria || []);
  const [rotinaSemanal, setRotinaSemanal] = useState<RotinaSemanal[]>(cronograma?.rotina_semanal || []);
  const [responsavelRevisao, setResponsavelRevisao] = useState(cronograma?.responsavel_revisao || "");
  const [dataRevisao, setDataRevisao] = useState(
    cronograma?.data_revisao || new Date().toISOString().split("T")[0]
  );
  const [observacoes, setObservacoes] = useState(cronograma?.observacoes || "");

  // Salvar rascunho no localStorage
  useEffect(() => {
    if (!cronograma) {
      const draft = {
        titulo,
        condominioNome,
        versao,
        turno,
        periodicidade,
        responsavel,
        supervisao,
        selectedPOPIds,
        rotinaDiaria,
        rotinaSemanal,
        responsavelRevisao,
        dataRevisao,
        observacoes,
      };
      localStorage.setItem("cronograma_draft", JSON.stringify(draft));
    }
  }, [
    titulo,
    condominioNome,
    versao,
    turno,
    periodicidade,
    responsavel,
    supervisao,
    selectedPOPIds,
    rotinaDiaria,
    rotinaSemanal,
    responsavelRevisao,
    dataRevisao,
    observacoes,
    cronograma,
  ]);

  // Carregar rascunho ao montar (apenas se não estiver editando)
  useEffect(() => {
    if (!cronograma) {
      const draft = localStorage.getItem("cronograma_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setTitulo(parsed.titulo || "");
          setCondominioNome(parsed.condominioNome || "");
          setVersao(parsed.versao || "1");
          setTurno(parsed.turno || "");
          setPeriodicidade(parsed.periodicidade || "");
          setResponsavel(parsed.responsavel || "");
          setSupervisao(parsed.supervisao || "");
          setSelectedPOPIds(parsed.selectedPOPIds || []);
          setRotinaDiaria(parsed.rotinaDiaria || []);
          setRotinaSemanal(parsed.rotinaSemanal || []);
          setResponsavelRevisao(parsed.responsavelRevisao || "");
          setDataRevisao(parsed.dataRevisao || new Date().toISOString().split("T")[0]);
          setObservacoes(parsed.observacoes || "");
        } catch (error) {
          console.error("Erro ao carregar rascunho:", error);
        }
      }
    }
  }, [cronograma]);

  const validateForm = (): boolean => {
    if (!titulo.trim() || titulo.length < 5) {
      toast({
        title: "Título inválido",
        description: "O título deve ter pelo menos 5 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    if (!condominioNome.trim() || condominioNome.length < 2) {
      toast({
        title: "Nome do condomínio inválido",
        description: "O nome do condomínio deve ter pelo menos 2 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    if (!turno) {
      toast({
        title: "Turno obrigatório",
        description: "Selecione um turno de trabalho.",
        variant: "destructive",
      });
      return false;
    }

    if (!periodicidade.trim()) {
      toast({
        title: "Periodicidade obrigatória",
        description: "Informe a periodicidade (ex: Diária, Semanal, etc).",
        variant: "destructive",
      });
      return false;
    }

    if (!responsavel.trim()) {
      toast({
        title: "Responsável obrigatório",
        description: "Informe o nome do responsável.",
        variant: "destructive",
      });
      return false;
    }

    if (selectedPOPIds.length === 0) {
      toast({
        title: "POPs obrigatórios",
        description: "Selecione pelo menos uma POP associada.",
        variant: "destructive",
      });
      return false;
    }

    if (rotinaDiaria.length === 0) {
      toast({
        title: "Rotina diária obrigatória",
        description: "Adicione pelo menos uma atividade na rotina diária.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Auto-preencher campos quando POPs são selecionados
  useEffect(() => {
    if (selectedPOPIds.length > 0 && !cronograma) {
      const selectedPOPs = pops.filter((pop) => selectedPOPIds.includes(pop.id));
      if (selectedPOPs.length > 0) {
        const firstPOP = selectedPOPs[0];
        const newAutoFilled: string[] = [];

        // Sugerir condomínio se estiver vazio
        if (!condominioNome && firstPOP.condominioNome) {
          setCondominioNome(firstPOP.condominioNome);
          newAutoFilled.push("condominioNome");
        }

        // Sugerir responsável se estiver vazio
        if (!responsavel && (firstPOP.responsavelElaboracao || firstPOP.nomeColaborador)) {
          setResponsavel(firstPOP.responsavelElaboracao || firstPOP.nomeColaborador);
          newAutoFilled.push("responsavel");
        }

        setAutoFilled(newAutoFilled);
      }
    }
  }, [selectedPOPIds, pops, cronograma, condominioNome, responsavel]);

  const handleGenerateRotina = (config: RotinaConfig) => {
    if (selectedPOPIds.length === 0) {
      toast({
        title: "Nenhum POP selecionado",
        description: "Selecione pelo menos um POP para gerar a rotina automaticamente.",
        variant: "destructive",
      });
      return;
    }

    if (!turno) {
      toast({
        title: "Turno não selecionado",
        description: "Selecione um turno antes de gerar a rotina.",
        variant: "destructive",
      });
      return;
    }

    // Confirmar se já existe rotina
    if (rotinaDiaria.length > 0) {
      const confirmed = window.confirm(
        "Já existe uma rotina diária cadastrada. Deseja substituí-la pela rotina gerada automaticamente?"
      );
      if (!confirmed) {
        setShowConfigDialog(false);
        return;
      }
    }

    setIsGenerating(true);

    try {
      const result = generateRotinaFromPOPs(selectedPOPIds, pops, catalog, config);

      // Aplicar rotina gerada
      setRotinaDiaria(result.rotinaDiaria);

      // Aplicar sugestões
      const newAutoFilled: string[] = [...autoFilled];

      if (!responsavel && result.sugestoes.responsavel) {
        setResponsavel(result.sugestoes.responsavel);
        newAutoFilled.push("responsavel");
      }

      if (!condominioNome && result.sugestoes.condominio) {
        setCondominioNome(result.sugestoes.condominio);
        newAutoFilled.push("condominioNome");
      }

      if (!periodicidade && result.sugestoes.periodicidade) {
        setPeriodicidade(result.sugestoes.periodicidade);
        newAutoFilled.push("periodicidade");
      }

      // ✨ Auto-sugerir título
      if (!titulo) {
        const suggestedTitle = `Cronograma ${result.sugestoes.periodicidade} - ${result.sugestoes.condominio}`;
        setTitulo(suggestedTitle);
        newAutoFilled.push("titulo");
      }

      setAutoFilled(newAutoFilled);
      setCurrentStep(4); // Avançar para etapa 4

      toast({
        title: "✨ Rotina gerada com sucesso!",
        description: `${result.rotinaDiaria.length} atividades foram adicionadas. Agora complete as configurações restantes.`,
      });

      setShowConfigDialog(false);

      // Scroll suave para seção de configurações
      setTimeout(() => {
        const element = document.getElementById("step-4");
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (error) {
      console.error("Erro ao gerar rotina:", error);
      toast({
        title: "Erro ao gerar rotina",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao gerar a rotina.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll automático entre etapas
  useEffect(() => {
    if (currentStep > 1 && currentStep !== 4) {
      const element = document.getElementById(`step-${currentStep}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep]);

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const data = {
        titulo,
        condominio_nome: condominioNome,
        versao,
        turno,
        periodicidade,
        responsavel,
        supervisao,
        pop_ids: selectedPOPIds,
        rotina_diaria: rotinaDiaria,
        rotina_semanal: rotinaSemanal,
        responsavel_revisao: responsavelRevisao || undefined,
        data_revisao: dataRevisao || undefined,
        observacoes: observacoes || undefined,
      };

      let cronogramaParaExportar: Cronograma;

      if (cronograma) {
        // Editando cronograma existente
        await updateCronograma(cronograma.id, data);
        
        // Montar cronograma atualizado para exportação
        cronogramaParaExportar = {
          ...cronograma,
          ...data,
          codigo: cronograma.codigo,
          created_at: cronograma.created_at,
          updated_at: new Date().toISOString(),
        } as Cronograma;
        
        toast({
          title: "Cronograma atualizado!",
          description: `O cronograma "${titulo}" foi atualizado com sucesso.`,
        });
      } else {
        // Criando novo cronograma
        const savedCronograma = await saveCronograma(data);
        
        if (savedCronograma) {
          cronogramaParaExportar = {
            id: savedCronograma.id,
            titulo: savedCronograma.titulo,
            condominio_nome: savedCronograma.condominio_nome,
            codigo: savedCronograma.codigo,
            versao: savedCronograma.versao,
            turno: savedCronograma.turno,
            periodicidade: savedCronograma.periodicidade,
            responsavel: savedCronograma.responsavel,
            supervisao: savedCronograma.supervisao,
            pop_ids: Array.isArray(savedCronograma.pop_ids) ? (savedCronograma.pop_ids as unknown as string[]) : [],
            rotina_diaria: Array.isArray(savedCronograma.rotina_diaria) ? (savedCronograma.rotina_diaria as unknown as RotinaHorario[]) : [],
            rotina_semanal: Array.isArray(savedCronograma.rotina_semanal) ? (savedCronograma.rotina_semanal as unknown as RotinaSemanal[]) : [],
            responsavel_revisao: savedCronograma.responsavel_revisao,
            data_revisao: savedCronograma.data_revisao,
            observacoes: savedCronograma.observacoes,
            created_at: savedCronograma.created_at,
            updated_at: savedCronograma.updated_at,
          };
        }
        
        toast({
          title: "Cronograma criado!",
          description: `O cronograma "${titulo}" foi criado com sucesso.`,
        });
        localStorage.removeItem("cronograma_draft");
      }

      // Exportar PDF automaticamente
      if (cronogramaParaExportar) {
        setTimeout(() => {
          exportCronogramaPDF(cronogramaParaExportar);
          toast({
            title: "PDF baixado!",
            description: "O PDF do cronograma foi baixado automaticamente.",
          });
        }, 500);
      }

      onSave();
    } catch (error) {
      console.error("Erro ao salvar cronograma:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o cronograma. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-3xl p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>
              {cronograma ? "Editar Cronograma" : "Novo Cronograma"}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="px-6 py-4 space-y-6">
            {/* ETAPA 1: Seleção de POPs - SEMPRE VISÍVEL */}
            <Card id="step-1" className={currentStep === 1 ? "border-primary border-2" : ""}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </span>
                    Selecione os POPs
                  </h3>
                  {selectedPOPIds.length > 0 && (
                    <Badge variant="secondary" className="text-sm bg-green-500/10 text-green-700 dark:text-green-400">
                      ✓ {selectedPOPIds.length} selecionados
                    </Badge>
                  )}
                </div>
                <POPSelector
                  selectedPOPIds={selectedPOPIds}
                  onSelectionChange={(ids) => {
                    setSelectedPOPIds(ids);
                    if (ids.length > 0) setCurrentStep(2);
                  }}
                />
              </CardContent>
            </Card>

            {/* Mensagem de orientação quando nenhum POP selecionado */}
            {selectedPOPIds.length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                <p className="text-lg">👆 Selecione pelo menos um POP para começar</p>
              </div>
            )}

            {/* ETAPA 2: Definir Turno - SÓ APARECE SE POPS SELECIONADOS */}
            {selectedPOPIds.length > 0 && (
              <Card id="step-2" className={currentStep === 2 ? "border-primary border-2" : ""}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        2
                      </span>
                      Defina o Turno de Trabalho
                    </h3>
                    {turno && (
                      <Badge variant="secondary" className="text-sm bg-green-500/10 text-green-700 dark:text-green-400">
                        ✓ Definido
                      </Badge>
                    )}
                  </div>
                  <Select
                    value={turno}
                    onValueChange={(value) => {
                      setTurno(value);
                      if (value) setCurrentStep(3);
                    }}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {turnosDisponiveis.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Mensagem de orientação quando POPs selecionados mas sem turno */}
            {selectedPOPIds.length > 0 && !turno && (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                <p className="text-lg">👆 Agora defina o turno de trabalho</p>
              </div>
            )}

            {/* ETAPA 3: Botão de Geração - SÓ APARECE SE POPS E TURNO */}
            {selectedPOPIds.length > 0 && turno && (
              <Card id="step-3" className="border-primary/50 bg-primary/5 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      3
                    </span>
                    <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Gerar Cronograma Automaticamente
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>{selectedPOPIds.length} POP(s)</strong> selecionado(s) | Turno:{" "}
                        <strong>{turnosDisponiveis.find((t) => t.value === turno)?.label}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Configure as preferências e gere a rotina inteligente
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => setShowConfigDialog(true)}
                      disabled={isGenerating}
                      className="w-full max-w-md h-16 text-lg font-semibold"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                          Gerando Rotina...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-2" />
                          Configurar e Gerar Rotina
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensagem de orientação quando tudo pronto mas rotina não gerada */}
            {selectedPOPIds.length > 0 && turno && rotinaDiaria.length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                <p className="text-lg">👆 Clique no botão para gerar o cronograma automaticamente</p>
              </div>
            )}

            {/* ETAPA 4: Configurações Complementares - SÓ APARECEM APÓS ROTINA GERADA */}
            {rotinaDiaria.length > 0 && (
              <>
                <Separator className="my-8" />

                <div id="step-4" className="flex items-center gap-2 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    4
                  </span>
                  <h3 className="text-xl font-bold">Complete as Configurações</h3>
                  <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-700 dark:text-green-400">
                    Rotina gerada com sucesso! ✓
                  </Badge>
                </div>

                {/* Identificação */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold">📋 Identificação</h4>

                    <div className="space-y-2">
                      <Label htmlFor="titulo" className="flex items-center gap-2">
                        Título *
                        {autoFilled.includes("titulo") && (
                          <Badge variant="secondary" className="text-xs">
                            Auto-sugerido
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id="titulo"
                        value={titulo}
                        onChange={(e) => {
                          setTitulo(e.target.value);
                          setAutoFilled(autoFilled.filter((f) => f !== "titulo"));
                        }}
                        placeholder="Ex: Cronograma de Limpeza - Torre A"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="condominioNome" className="flex items-center gap-2">
                          Condomínio *
                          {autoFilled.includes("condominioNome") && (
                            <Badge variant="secondary" className="text-xs">
                              Auto-preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id="condominioNome"
                          value={condominioNome}
                          onChange={(e) => {
                            setCondominioNome(e.target.value);
                            setAutoFilled(autoFilled.filter((f) => f !== "condominioNome"));
                          }}
                          placeholder="Ex: Residencial Singular"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="versao">Versão</Label>
                        <Input
                          id="versao"
                          value={versao}
                          onChange={(e) => setVersao(e.target.value)}
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dados Gerais */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold">⚙️ Dados Gerais</h4>

                    <div className="space-y-2">
                      <Label htmlFor="periodicidade" className="flex items-center gap-2">
                        Periodicidade *
                        {autoFilled.includes("periodicidade") && (
                          <Badge variant="secondary" className="text-xs">
                            Auto-preenchido
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id="periodicidade"
                        value={periodicidade}
                        onChange={(e) => {
                          setPeriodicidade(e.target.value);
                          setAutoFilled(autoFilled.filter((f) => f !== "periodicidade"));
                        }}
                        placeholder="Ex: Diária, Semanal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsavel" className="flex items-center gap-2">
                        Responsável *
                        {autoFilled.includes("responsavel") && (
                          <Badge variant="secondary" className="text-xs">
                            Auto-preenchido
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id="responsavel"
                        value={responsavel}
                        onChange={(e) => {
                          setResponsavel(e.target.value);
                          setAutoFilled(autoFilled.filter((f) => f !== "responsavel"));
                        }}
                        placeholder="Nome do responsável"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supervisao">Supervisão</Label>
                      <Input
                        id="supervisao"
                        value={supervisao}
                        onChange={(e) => setSupervisao(e.target.value)}
                        placeholder="Nome do supervisor (opcional)"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Rotina Diária (editável) */}
                <RotinaDiariaEditor rotinas={rotinaDiaria} onChange={setRotinaDiaria} />

                <Separator />

                {/* Rotina Semanal (opcional) */}
                <RotinaSemanalEditor rotinas={rotinaSemanal} onChange={setRotinaSemanal} />

                <Separator />

                {/* Revisão */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold">✅ Revisão</h4>

                    <div className="space-y-2">
                      <Label htmlFor="responsavelRevisao">Responsável pela Revisão</Label>
                      <Input
                        id="responsavelRevisao"
                        value={responsavelRevisao}
                        onChange={(e) => setResponsavelRevisao(e.target.value)}
                        placeholder="Nome (opcional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataRevisao">Data de Revisão</Label>
                      <Input
                        id="dataRevisao"
                        type="date"
                        value={dataRevisao}
                        onChange={(e) => setDataRevisao(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Observações gerais (opcional)"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Finalização */}
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <h4 className="text-xl font-bold">Pronto para Salvar!</h4>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Revise as configurações acima e clique no botão abaixo para salvar o cronograma.
                      </p>
                      <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={isSaving || !titulo || !condominioNome || !periodicidade || !responsavel}
                        className="w-full max-w-md h-14 text-lg font-semibold"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Salvando Cronograma...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Salvar Cronograma
                          </>
                        )}
                      </Button>
                      {(!titulo || !condominioNome || !periodicidade || !responsavel) && (
                        <p className="text-xs text-destructive">
                          ⚠️ Preencha os campos obrigatórios (*) antes de salvar
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Botões de Ação */}
        <div className="px-6 py-4 border-t space-y-2">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || rotinaDiaria.length === 0}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Cronograma
                </>
              )}
            </Button>
          </div>
          {rotinaDiaria.length === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              ⚠️ Gere a rotina diária primeiro para poder salvar
            </p>
          )}
        </div>
      </SheetContent>

      {/* Dialog de Configuração */}
      <RotinaConfigDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        onConfirm={handleGenerateRotina}
        turno={turno}
      />
    </Sheet>
  );
};
