import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Activity, ProcedureStep, Equipment } from "@/types/schema";
import { useCatalog } from "@/hooks/useCatalog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivityEditorProps {
  functionId: string;
  activity?: Activity;
  onSave: () => void;
  onCancel: () => void;
}

export const ActivityEditor = ({ functionId, activity, onSave, onCancel }: ActivityEditorProps) => {
  const [formData, setFormData] = useState<Activity>(
    activity ? {
      ...activity,
      responsibilities: activity.responsibilities || [],
      prerequisites: activity.prerequisites || [],
      procedure: activity.procedure || { steps: [] },
      equipment: activity.equipment || { epc: [], epi: [], tools: [], consumables: [] },
      training: activity.training || { modules: [], refresh_cadence_days: 180 },
      review: activity.review || { kpis: [], audit_frequency_days: 90, auditor_role: "Supervisor" },
      versioning: activity.versioning || { current_version: "1.0", last_review_date: new Date().toISOString().split('T')[0], changelog: [] }
    } : {
      id: `activity_${Date.now()}`,
      name: "",
      objective: "",
      scope: "",
      prerequisites: [],
      responsibilities: [],
      procedure: { steps: [] },
      equipment: { epc: [], epi: [], tools: [], consumables: [] },
      training: { modules: [], refresh_cadence_days: 180 },
      review: { kpis: [], audit_frequency_days: 90, auditor_role: "Supervisor" },
      versioning: { current_version: "1.0", last_review_date: new Date().toISOString().split('T')[0], changelog: [] }
    }
  );
  const { toast } = useToast();
  const { addActivity, updateActivity, catalog } = useCatalog();

  const handleSave = async () => {
    if (!formData.name || !formData.objective) {
      toast({
        title: "Erro",
        description: "Nome e objetivo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    let success = false;

    if (activity) {
      const oldActivity = catalog?.functions
        ?.find(f => f.id === functionId)
        ?.activities.find(a => a.id === activity.id);
      success = await updateActivity(functionId, activity.id, formData, oldActivity);
      if (success) {
        toast({ title: "Atividade atualizada", description: `${formData.name} foi atualizada com sucesso` });
      }
    } else {
      success = await addActivity(functionId, formData);
      if (success) {
        toast({ title: "Atividade adicionada", description: `${formData.name} foi adicionada com sucesso` });
      }
    }
    
    if (success) {
      onSave();
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      procedure: {
        steps: [...formData.procedure.steps, {
          id: `step_${Date.now()}`,
          title: "",
          instruction: "",
          why: "",
          who: "",
          time_estimate_min: 5,
          safety: "",
          quality_check: "",
          evidence: ""
        }]
      }
    });
  };

  const updateStep = (index: number, field: keyof ProcedureStep, value: any) => {
    const newSteps = [...formData.procedure.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, procedure: { steps: newSteps } });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      procedure: { steps: formData.procedure.steps.filter((_, i) => i !== index) }
    });
  };

  const addArrayItem = (field: keyof Activity, value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), value.trim()]
      });
    }
  };

  const removeArrayItem = (field: keyof Activity, index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field] as string[]).filter((_, i) => i !== index)
    });
  };

  const addEquipmentItem = (category: keyof Equipment, value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        equipment: {
          ...formData.equipment,
          [category]: [...formData.equipment[category], value.trim()]
        }
      });
    }
  };

  const removeEquipmentItem = (category: keyof Equipment, index: number) => {
    setFormData({
      ...formData,
      equipment: {
        ...formData.equipment,
        [category]: formData.equipment[category].filter((_, i) => i !== index)
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity ? "Editar Atividade" : "Nova Atividade"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="steps">Passos</TabsTrigger>
            <TabsTrigger value="equipment">Materiais</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da atividade"
              />
            </div>

            <div className="space-y-2">
              <Label>Objetivo *</Label>
              <Textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                placeholder="Objetivo da atividade"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Escopo</Label>
              <Textarea
                value={formData.scope || ""}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                placeholder="Escopo da atividade"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Responsabilidades</Label>
              <Input
                placeholder="Adicione e pressione Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('responsibilities', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <ul className="space-y-1 mt-2">
                {formData.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{resp}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeArrayItem('responsibilities', i)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <Label>Procedimentos ({formData.procedure.steps.length})</Label>
              <Button size="sm" onClick={addStep}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Passo
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.procedure.steps.map((step, index) => (
                <Card key={step.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold">Passo {index + 1}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeStep(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Título do passo"
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Instrução"
                      value={step.instruction}
                      onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Responsável"
                        value={step.who}
                        onChange={(e) => updateStep(index, 'who', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Tempo (min)"
                        value={step.time_estimate_min}
                        onChange={(e) => updateStep(index, 'time_estimate_min', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4 mt-4">
            {(['epc', 'epi', 'tools', 'consumables'] as const).map((category) => (
              <div key={category} className="space-y-2">
                <Label className="capitalize">
                  {category === 'epc' ? 'EPC (Proteção Coletiva)' :
                   category === 'epi' ? 'EPI (Proteção Individual)' :
                   category === 'tools' ? 'Ferramentas' : 'Consumíveis'}
                </Label>
                <Input
                  placeholder="Adicione e pressione Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addEquipmentItem(category, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <ul className="space-y-1">
                  {formData.equipment[category].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{item}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeEquipmentItem(category, i)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="meta" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Versão</Label>
              <Input
                value={formData.versioning.current_version}
                onChange={(e) => setFormData({
                  ...formData,
                  versioning: { ...formData.versioning, current_version: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo do Auditor</Label>
              <Input
                value={formData.review.auditor_role}
                onChange={(e) => setFormData({
                  ...formData,
                  review: { ...formData.review, auditor_role: e.target.value }
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequência de Auditoria (dias)</Label>
                <Input
                  type="number"
                  value={formData.review.audit_frequency_days}
                  onChange={(e) => setFormData({
                    ...formData,
                    review: { ...formData.review, audit_frequency_days: parseInt(e.target.value) || 90 }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cadência de Treinamento (dias)</Label>
                <Input
                  type="number"
                  value={formData.training.refresh_cadence_days}
                  onChange={(e) => setFormData({
                    ...formData,
                    training: { ...formData.training, refresh_cadence_days: parseInt(e.target.value) || 180 }
                  })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
