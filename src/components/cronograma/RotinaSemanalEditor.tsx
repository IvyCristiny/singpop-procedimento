import { RotinaSemanal, diasSemana } from "@/types/cronograma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface RotinaSemanalEditorProps {
  rotinas: RotinaSemanal[];
  onChange: (rotinas: RotinaSemanal[]) => void;
}

export const RotinaSemanalEditor = ({ rotinas, onChange }: RotinaSemanalEditorProps) => {
  const handleChange = (dia: string, field: 'atividade' | 'observacoes', value: string) => {
    const existing = rotinas.find((r) => r.dia_semana === dia);
    
    if (existing) {
      // Update existing
      const updated = rotinas.map((r) =>
        r.dia_semana === dia ? { ...r, [field]: value } : r
      );
      onChange(updated);
    } else {
      // Add new
      const diaInfo = diasSemana.find((d) => d.value === dia);
      const newRotina: RotinaSemanal = {
        id: crypto.randomUUID(),
        dia_semana: dia as any,
        atividade: field === 'atividade' ? value : '',
        observacoes: field === 'observacoes' ? value : '',
        ordem: diaInfo?.ordem || 1,
      };
      onChange([...rotinas, newRotina]);
    }
  };

  const getRotinaForDia = (dia: string): RotinaSemanal | undefined => {
    return rotinas.find((r) => r.dia_semana === dia);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rotina Semanal</CardTitle>
        <p className="text-sm text-muted-foreground">
          Atividades especiais para cada dia da semana (opcional)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {diasSemana.map((dia) => {
          const rotina = getRotinaForDia(dia.value);
          return (
            <Card key={dia.value}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dia.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Atividade</label>
                  <Input
                    value={rotina?.atividade || ''}
                    onChange={(e) => handleChange(dia.value, 'atividade', e.target.value)}
                    placeholder="Ex: Limpeza profunda da piscina"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Observações</label>
                  <Textarea
                    value={rotina?.observacoes || ''}
                    onChange={(e) => handleChange(dia.value, 'observacoes', e.target.value)}
                    placeholder="Detalhes adicionais..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};
