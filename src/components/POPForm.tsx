import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileDown, Info } from "lucide-react";
import { POP, tiposPOP, turnosDisponiveis, popTemplates } from "@/types/pop";
import { savePOP, generatePOPCode } from "@/utils/storage";
import { downloadPDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { POPPreview } from "./POPPreview";

interface POPFormProps {
  onBack: () => void;
  onSave: () => void;
}

export const POPForm = ({ onBack, onSave }: POPFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    condominioNome: "",
    tipoPOP: "",
    versao: "01",
    dataEmissao: new Date().toISOString().split("T")[0],
    responsavelElaboracao: "",
    aprovadoPor: "",
    turno: "",
    observacoes: "",
  });

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("popFormDraft");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Erro ao carregar rascunho:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.condominioNome || formData.tipoPOP) {
      localStorage.setItem("popFormDraft", JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePDF = () => {
    // Validação
    if (!formData.condominioNome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do condomínio.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.tipoPOP) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o tipo de POP.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.responsavelElaboracao.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o responsável pela elaboração.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.aprovadoPor.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe quem aprovou o POP.",
        variant: "destructive",
      });
      return;
    }

    // Criar POP
    const pop: POP = {
      id: crypto.randomUUID(),
      codigoPOP: generatePOPCode(formData.tipoPOP),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    // Salvar
    savePOP(pop);

    // Gerar PDF
    downloadPDF(pop);

    // Limpar rascunho
    localStorage.removeItem("popFormDraft");

    toast({
      title: "POP gerado com sucesso!",
      description: "O PDF foi baixado e o POP foi salvo.",
    });

    onSave();
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Novo Procedimento Operacional Padrão
          </h1>
          <p className="text-muted-foreground">
            Preencha os campos abaixo para gerar o POP automaticamente
          </p>
        </div>

        <Card className="p-6 space-y-6 shadow-card">
          <div className="space-y-2">
            <Label htmlFor="condominio">Nome do Condomínio *</Label>
            <Input
              id="condominio"
              placeholder="Ex: Residencial Parque das Flores"
              value={formData.condominioNome}
              onChange={(e) => handleInputChange("condominioNome", e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de POP *</Label>
            <Select
              value={formData.tipoPOP}
              onValueChange={(value) => handleInputChange("tipoPOP", value)}
            >
              <SelectTrigger id="tipo" className="bg-background">
                <SelectValue placeholder="Selecione o tipo de POP" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {tiposPOP.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview da Estrutura */}
          {formData.tipoPOP && (
            <POPPreview
              template={popTemplates[formData.tipoPOP]}
              tipoPOPLabel={
                tiposPOP.find((t) => t.value === formData.tipoPOP)?.label || ""
              }
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="turno">Turno/Jornada</Label>
            <Select
              value={formData.turno}
              onValueChange={(value) => handleInputChange("turno", value)}
            >
              <SelectTrigger id="turno" className="bg-background">
                <SelectValue placeholder="Selecione o turno (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {turnosDisponiveis.map((turno) => (
                  <SelectItem key={turno.value} value={turno.value}>
                    {turno.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="versao">Versão</Label>
              <Input
                id="versao"
                value={formData.versao}
                onChange={(e) => handleInputChange("versao", e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data de Emissão</Label>
              <Input
                id="data"
                type="date"
                value={formData.dataEmissao}
                onChange={(e) => handleInputChange("dataEmissao", e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável pela Elaboração *</Label>
            <Input
              id="responsavel"
              placeholder="Nome do supervisor responsável"
              value={formData.responsavelElaboracao}
              onChange={(e) =>
                handleInputChange("responsavelElaboracao", e.target.value)
              }
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aprovador">Aprovado Por *</Label>
            <Input
              id="aprovador"
              placeholder="Nome do aprovador"
              value={formData.aprovadoPor}
              onChange={(e) => handleInputChange("aprovadoPor", e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="observacoes">Observações Personalizadas</Label>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <Textarea
              id="observacoes"
              placeholder="Adicione instruções específicas deste condomínio (ex: horários especiais, regras particulares, contatos importantes...)"
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              className="bg-background min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleGeneratePDF}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-6 text-lg shadow-card hover:shadow-hover transition-all duration-300"
          >
            <FileDown className="w-5 h-5 mr-2" />
            Gerar PDF do POP
          </Button>
        </Card>
      </div>
    </div>
  );
};
