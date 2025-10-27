import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cronograma, diasSemana, RotinaHorario, RotinaSemanal } from "@/types/cronograma";
import { Separator } from "@/components/ui/separator";

interface CronogramaPreviewProps {
  data: {
    titulo: string;
    condominio_nome: string;
    turno: string;
    periodicidade: string;
    responsavel: string;
    supervisao?: string;
    versao: string;
    pop_ids: string[];
    rotina_diaria: RotinaHorario[];
    rotina_semanal: RotinaSemanal[];
    zona_id: string | null;
  };
}

export const CronogramaPreview = ({ data }: CronogramaPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisão Final</CardTitle>
        <CardDescription>Revise todas as informações antes de salvar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Informações Gerais</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Título:</span>
              <p className="font-medium">{data.titulo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Condomínio:</span>
              <p className="font-medium">{data.condominio_nome}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Turno:</span>
              <p className="font-medium">{data.turno}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Periodicidade:</span>
              <p className="font-medium">{data.periodicidade}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Responsável:</span>
              <p className="font-medium">{data.responsavel}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Versão:</span>
              <p className="font-medium">{data.versao}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-3">POPs Selecionados</h3>
          <p className="text-sm text-muted-foreground">
            {data.pop_ids.length} POP(s) vinculado(s) a este cronograma
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-3">Rotina Diária</h3>
          {data.rotina_diaria.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade cadastrada</p>
          ) : (
            <div className="space-y-2">
              {data.rotina_diaria.map((rotina, index) => (
                <div key={index} className="text-sm p-3 bg-muted rounded-lg">
                  <div className="font-medium">
                    {rotina.horario_inicio} - {rotina.horario_fim}
                  </div>
                  <div className="text-muted-foreground">{rotina.ambiente_atividade}</div>
                  {rotina.detalhamento && (
                    <div className="text-xs mt-1">{rotina.detalhamento}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    Responsável: {rotina.responsavel}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-3">Rotina Semanal</h3>
          {data.rotina_semanal.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade cadastrada</p>
          ) : (
            <div className="space-y-2">
              {data.rotina_semanal
                .sort((a, b) => a.ordem - b.ordem)
                .map((rotina) => {
                  const dia = diasSemana.find((d) => d.value === rotina.dia_semana);
                  return (
                    <div key={rotina.id} className="text-sm p-3 bg-muted rounded-lg">
                      <div className="font-medium">{dia?.label}</div>
                      <div className="text-muted-foreground">{rotina.atividade}</div>
                      {rotina.observacoes && (
                        <div className="text-xs mt-1">{rotina.observacoes}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
