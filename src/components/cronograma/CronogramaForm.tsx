import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCronogramas } from "@/hooks/useCronogramas";
import { usePOPs } from "@/hooks/usePOPs";
import { Button } from "@/components/ui/button";
import { CronogramaStepIndicator } from "./CronogramaStepIndicator";
import { InformacoesGerais } from "./InformacoesGerais";
import { POPSelector } from "./POPSelector";
import { RotinaDiariaEditor } from "./RotinaDiariaEditor";
import { RotinaSemanalEditor } from "./RotinaSemanalEditor";
import { CronogramaPreview } from "./CronogramaPreview";
import { RotinaHorario, RotinaSemanal } from "@/types/cronograma";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

interface CronogramaFormProps {
  onBack: () => void;
  onSave: () => void;
}

const steps = [
  "Seleção de POPs",
  "Informações Gerais",
  "Rotina Diária",
  "Rotina Semanal",
  "Revisão",
];

export const CronogramaForm = ({ onBack, onSave }: CronogramaFormProps) => {
  const { profile } = useAuth();
  const { saveCronograma } = useCronogramas();
  const { pops } = usePOPs();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    condominio_nome: "",
    turno: "",
    periodicidade: "",
    responsavel: "",
    supervisao: "",
    versao: "1.0",
    responsavel_revisao: "",
    data_revisao: "",
    pop_ids: [] as string[],
    rotina_diaria: [] as RotinaHorario[],
    rotina_semanal: [] as RotinaSemanal[],
    zona_id: profile?.zona_id || null,
  });

  // Auto-preencher dados quando POPs são selecionados
  useEffect(() => {
    if (formData.pop_ids.length === 0) {
      setAutoFilled(false);
      return;
    }
    
    const selectedPOPs = pops.filter(p => formData.pop_ids.includes(p.id!));
    
    if (selectedPOPs.length > 0 && !formData.condominio_nome) {
      const firstPOP = selectedPOPs[0];
      
      setFormData(prev => ({
        ...prev,
        condominio_nome: prev.condominio_nome || firstPOP.condominioNome,
        responsavel: prev.responsavel || firstPOP.responsavelElaboracao || "",
        titulo: prev.titulo || `Cronograma - ${firstPOP.condominioNome}`,
      }));
      
      setAutoFilled(true);
      
      toast.success("Dados preenchidos automaticamente", {
        description: `Informações extraídas do${selectedPOPs.length > 1 ? 's' : ''} POP${selectedPOPs.length > 1 ? 's' : ''} selecionado${selectedPOPs.length > 1 ? 's' : ''}.`,
      });
    }
  }, [formData.pop_ids, pops]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (formData.pop_ids.length === 0) {
          toast.error("Selecione pelo menos um POP");
          return false;
        }
        return true;
      case 2:
        if (!formData.titulo || !formData.condominio_nome || !formData.turno || 
            !formData.periodicidade || !formData.responsavel || !formData.versao) {
          toast.error("Preencha todos os campos obrigatórios");
          return false;
        }
        return true;
      case 3:
        if (formData.rotina_diaria.length === 0) {
          toast.error("Adicione pelo menos uma atividade na rotina diária");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCronograma(formData);
      toast.success("Cronograma criado com sucesso!");
      onSave();
    } catch (error) {
      console.error("Erro ao salvar cronograma:", error);
      toast.error("Erro ao criar cronograma");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <POPSelector
            selectedPOPIds={formData.pop_ids}
            onSelectionChange={(ids) => handleFieldChange("pop_ids", ids)}
          />
        );
      case 2:
        return <InformacoesGerais data={formData} onChange={handleFieldChange} autoFilled={autoFilled} />;
      case 3:
        return (
          <RotinaDiariaEditor
            rotinas={formData.rotina_diaria}
            onChange={(rotinas) => handleFieldChange("rotina_diaria", rotinas)}
            selectedPOPIds={formData.pop_ids}
          />
        );
      case 4:
        return (
          <RotinaSemanalEditor
            rotinas={formData.rotina_semanal}
            onChange={(rotinas) => handleFieldChange("rotina_semanal", rotinas)}
          />
        );
      case 5:
        return <CronogramaPreview data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <CronogramaStepIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />

      <div className="mt-8">{renderStep()}</div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={handleNext}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Cronograma"}
          </Button>
        )}
      </div>
    </div>
  );
};
