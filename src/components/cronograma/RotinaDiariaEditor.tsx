import { RotinaHorario } from "@/types/cronograma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface RotinaDiariaEditorProps {
  rotinas: RotinaHorario[];
  onChange: (rotinas: RotinaHorario[]) => void;
}

export const RotinaDiariaEditor = ({ rotinas, onChange }: RotinaDiariaEditorProps) => {
  const validateTime = (horarioInicio: string, horarioFim: string): boolean => {
    const [hI, mI] = horarioInicio.split(':').map(Number);
    const [hF, mF] = horarioFim.split(':').map(Number);
    const inicio = hI * 60 + mI;
    const fim = hF * 60 + mF;
    return fim > inicio;
  };

  const checkOverlap = (newRotina: RotinaHorario, index: number): boolean => {
    for (let i = 0; i < rotinas.length; i++) {
      if (i === index) continue;
      const existing = rotinas[i];
      
      const [hI1, mI1] = newRotina.horario_inicio.split(':').map(Number);
      const [hF1, mF1] = newRotina.horario_fim.split(':').map(Number);
      const [hI2, mI2] = existing.horario_inicio.split(':').map(Number);
      const [hF2, mF2] = existing.horario_fim.split(':').map(Number);
      
      const inicio1 = hI1 * 60 + mI1;
      const fim1 = hF1 * 60 + mF1;
      const inicio2 = hI2 * 60 + mI2;
      const fim2 = hF2 * 60 + mF2;
      
      if ((inicio1 < fim2 && fim1 > inicio2)) {
        return true;
      }
    }
    return false;
  };

  const handleAdd = () => {
    const newRotina: RotinaHorario = {
      id: crypto.randomUUID(),
      horario_inicio: "07:00",
      horario_fim: "08:00",
      ambiente_atividade: "",
      detalhamento: "",
      responsavel: "",
      ordem: rotinas.length + 1,
    };
    onChange([...rotinas, newRotina]);
  };

  const handleRemove = (index: number) => {
    const updated = rotinas.filter((_, i) => i !== index);
    onChange(updated.map((r, i) => ({ ...r, ordem: i + 1 })));
  };

  const handleChange = (index: number, field: keyof RotinaHorario, value: any) => {
    const updated = [...rotinas];
    updated[index] = { ...updated[index], [field]: value };

    // Validate time if changing horarios
    if (field === 'horario_inicio' || field === 'horario_fim') {
      if (!validateTime(updated[index].horario_inicio, updated[index].horario_fim)) {
        toast.error("Horário de fim deve ser maior que horário de início");
        return;
      }
      if (checkOverlap(updated[index], index)) {
        toast.error("Este horário sobrepõe outro existente");
        return;
      }
    }

    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rotina Diária</CardTitle>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Horário
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rotinas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma atividade adicionada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rotinas.map((rotina, index) => (
              <div key={rotina.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Atividade #{index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Início</label>
                    <Input
                      type="time"
                      value={rotina.horario_inicio}
                      onChange={(e) => handleChange(index, 'horario_inicio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Fim</label>
                    <Input
                      type="time"
                      value={rotina.horario_fim}
                      onChange={(e) => handleChange(index, 'horario_fim', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Ambiente/Atividade</label>
                  <Input
                    value={rotina.ambiente_atividade}
                    onChange={(e) => handleChange(index, 'ambiente_atividade', e.target.value)}
                    placeholder="Ex: Recepção - Limpeza geral"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Detalhamento</label>
                  <Input
                    value={rotina.detalhamento}
                    onChange={(e) => handleChange(index, 'detalhamento', e.target.value)}
                    placeholder="Ex: Varrer, passar pano, organizar"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Responsável</label>
                  <Input
                    value={rotina.responsavel}
                    onChange={(e) => handleChange(index, 'responsavel', e.target.value)}
                    placeholder="Ex: Zelador"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
