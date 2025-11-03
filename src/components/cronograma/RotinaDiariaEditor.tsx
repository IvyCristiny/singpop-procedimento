import { RotinaHorario } from "@/types/cronograma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Clock, AlertCircle, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RotinaDiariaEditorProps {
  rotinas: RotinaHorario[];
  onChange: (rotinas: RotinaHorario[]) => void;
}

export const RotinaDiariaEditor = ({ rotinas, onChange }: RotinaDiariaEditorProps) => {
  const validateTime = (horarioInicio: string, horarioFim: string): boolean => {
    const [hI, mI] = horarioInicio.split(':').map(Number);
    const [hF, mF] = horarioFim.split(':').map(Number);
    return (hF * 60 + mF) > (hI * 60 + mI);
  };

  const checkOverlap = (newRotina: RotinaHorario, index: number): boolean => {
    if (newRotina.tipo_horario !== 'fixo' && newRotina.tipo_horario) return false;
    
    return rotinas.some((rotina, i) => {
      if (i === index || (rotina.tipo_horario !== 'fixo' && rotina.tipo_horario)) return false;
      
      const [hI1, mI1] = newRotina.horario_inicio.split(':').map(Number);
      const [hF1, mF1] = newRotina.horario_fim.split(':').map(Number);
      const [hI2, mI2] = rotina.horario_inicio.split(':').map(Number);
      const [hF2, mF2] = rotina.horario_fim.split(':').map(Number);
      
      const inicio1 = hI1 * 60 + mI1;
      const fim1 = hF1 * 60 + mF1;
      const inicio2 = hI2 * 60 + mI2;
      const fim2 = hF2 * 60 + mF2;
      
      return (inicio1 < fim2 && fim1 > inicio2);
    });
  };

  const getValidationWarnings = (rotina: RotinaHorario, index: number): string[] => {
    const warnings: string[] = [];
    
    if (rotina.tipo_horario === 'fixo' || !rotina.tipo_horario) {
      if (!validateTime(rotina.horario_inicio, rotina.horario_fim)) {
        warnings.push('Horário de fim deve ser maior que início');
      }
      
      if (checkOverlap(rotina, index)) {
        warnings.push('Horário sobrepõe outra atividade');
      }
    }
    
    return warnings;
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Atividade #{index + 1}
                    </span>
                    {getValidationWarnings(rotina, index).length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {getValidationWarnings(rotina, index).length} aviso(s)
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {getValidationWarnings(rotina, index).length > 0 && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <ul className="list-disc pl-4">
                        {getValidationWarnings(rotina, index).map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo de Horário</label>
                  <Select
                    value={rotina.tipo_horario || 'fixo'}
                    onValueChange={(value) => handleChange(index, 'tipo_horario', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixo">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Horário Fixo</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="flexivel">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>Horário Flexível</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sincrono">
                        <div className="flex items-center gap-2">
                          <ArrowRightLeft className="w-4 h-4" />
                          <span>Atividade Síncrona</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rotina.tipo_horario === 'flexivel' && 'Pode ser realizado a qualquer momento do turno'}
                    {rotina.tipo_horario === 'sincrono' && 'Acontece simultaneamente com outras atividades'}
                    {(!rotina.tipo_horario || rotina.tipo_horario === 'fixo') && 'Deve ser realizado no horário especificado'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Início</label>
                    <Input
                      type="time"
                      value={rotina.horario_inicio}
                      onChange={(e) => handleChange(index, 'horario_inicio', e.target.value)}
                      disabled={rotina.tipo_horario !== 'fixo' && rotina.tipo_horario !== undefined}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Fim</label>
                    <Input
                      type="time"
                      value={rotina.horario_fim}
                      onChange={(e) => handleChange(index, 'horario_fim', e.target.value)}
                      disabled={rotina.tipo_horario !== 'fixo' && rotina.tipo_horario !== undefined}
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
