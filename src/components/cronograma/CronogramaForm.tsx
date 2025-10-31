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
import { useToast } from "@/hooks/use-toast";
import { useCronogramas } from "@/hooks/useCronogramas";
import { Cronograma, RotinaHorario, RotinaSemanal, turnosDisponiveis } from "@/types/cronograma";
import { POPSelector } from "./POPSelector";
import { RotinaDiariaEditor } from "./RotinaDiariaEditor";
import { RotinaSemanalEditor } from "./RotinaSemanalEditor";
import { X, Save, Loader2 } from "lucide-react";

interface CronogramaFormProps {
  cronograma?: Cronograma;
  onClose: () => void;
  onSave: () => void;
}

export const CronogramaForm = ({ cronograma, onClose, onSave }: CronogramaFormProps) => {
  const { toast } = useToast();
  const { saveCronograma, updateCronograma } = useCronogramas();
  const [isSaving, setIsSaving] = useState(false);

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

      if (cronograma) {
        // Editando cronograma existente
        await updateCronograma(cronograma.id, data);
        toast({
          title: "Cronograma atualizado!",
          description: `O cronograma "${titulo}" foi atualizado com sucesso.`,
        });
      } else {
        // Criando novo cronograma
        await saveCronograma(data);
        toast({
          title: "Cronograma criado!",
          description: `O cronograma "${titulo}" foi criado com sucesso.`,
        });
        localStorage.removeItem("cronograma_draft");
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
            {/* Seção: Identificação */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">📋 Identificação</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Cronograma de Limpeza - Torre A"
                    maxLength={200}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condominioNome">Nome do Condomínio *</Label>
                    <Input
                      id="condominioNome"
                      value={condominioNome}
                      onChange={(e) => setCondominioNome(e.target.value)}
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

            {/* Seção: Dados Gerais */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">⚙️ Dados Gerais</h3>

                <div className="space-y-2">
                  <Label htmlFor="turno">Turno *</Label>
                  <Select value={turno} onValueChange={setTurno}>
                    <SelectTrigger id="turno">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodicidade">Periodicidade *</Label>
                  <Input
                    id="periodicidade"
                    value={periodicidade}
                    onChange={(e) => setPeriodicidade(e.target.value)}
                    placeholder="Ex: Diária, Semanal, Mensal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável *</Label>
                  <Input
                    id="responsavel"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
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

            {/* Seção: POPs Associados */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">📄 POPs Associados *</h3>
                <POPSelector
                  selectedPOPIds={selectedPOPIds}
                  onSelectionChange={setSelectedPOPIds}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Seção: Rotina Diária */}
            <RotinaDiariaEditor rotinas={rotinaDiaria} onChange={setRotinaDiaria} />

            <Separator />

            {/* Seção: Rotina Semanal */}
            <RotinaSemanalEditor rotinas={rotinaSemanal} onChange={setRotinaSemanal} />

            <Separator />

            {/* Seção: Revisão */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">✅ Revisão</h3>

                <div className="space-y-2">
                  <Label htmlFor="responsavelRevisao">Responsável pela Revisão</Label>
                  <Input
                    id="responsavelRevisao"
                    value={responsavelRevisao}
                    onChange={(e) => setResponsavelRevisao(e.target.value)}
                    placeholder="Nome do responsável (opcional)"
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
          </div>
        </ScrollArea>

        {/* Botões de Ação */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
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
      </SheetContent>
    </Sheet>
  );
};
