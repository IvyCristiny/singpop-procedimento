import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { turnosDisponiveis } from "@/types/cronograma";
import { Info } from "lucide-react";

interface InformacoesGeraisProps {
  data: {
    titulo: string;
    condominio_nome: string;
    turno: string;
    periodicidade: string;
    responsavel: string;
    supervisao: string;
    versao: string;
  };
  onChange: (field: string, value: string) => void;
  autoFilled?: boolean;
}

export const InformacoesGerais = ({ data, onChange, autoFilled = false }: InformacoesGeraisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
        <CardDescription>Defina as informações básicas do cronograma</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {autoFilled && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <Info className="w-5 h-5 text-primary" />
            <p className="text-sm text-foreground">
              Alguns campos foram preenchidos automaticamente dos POPs selecionados. Você pode editá-los se necessário.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="titulo">Título do Cronograma *</Label>
            {autoFilled && data.titulo && (
              <Badge variant="secondary" className="text-xs">
                Auto-preenchido
              </Badge>
            )}
          </div>
          <Input
            id="titulo"
            value={data.titulo}
            onChange={(e) => onChange("titulo", e.target.value)}
            placeholder="Ex: Cronograma de Limpeza - Torre A"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="condominio">Condomínio *</Label>
            {autoFilled && data.condominio_nome && (
              <Badge variant="secondary" className="text-xs">
                Auto-preenchido
              </Badge>
            )}
          </div>
          <Input
            id="condominio"
            value={data.condominio_nome}
            onChange={(e) => onChange("condominio_nome", e.target.value)}
            placeholder="Nome do condomínio"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="turno">Turno *</Label>
            <Select value={data.turno} onValueChange={(value) => onChange("turno", value)}>
              <SelectTrigger id="turno">
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                {turnosDisponiveis.map((turno) => (
                  <SelectItem key={turno.value} value={turno.value}>
                    {turno.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodicidade">Periodicidade *</Label>
            <Select value={data.periodicidade} onValueChange={(value) => onChange("periodicidade", value)}>
              <SelectTrigger id="periodicidade">
                <SelectValue placeholder="Selecione a periodicidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diária</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="quinzenal">Quinzenal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="responsavel">Responsável *</Label>
            {autoFilled && data.responsavel && (
              <Badge variant="secondary" className="text-xs">
                Auto-preenchido
              </Badge>
            )}
          </div>
          <Input
            id="responsavel"
            value={data.responsavel}
            onChange={(e) => onChange("responsavel", e.target.value)}
            placeholder="Nome do responsável"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supervisao">Supervisão</Label>
          <Input
            id="supervisao"
            value={data.supervisao}
            onChange={(e) => onChange("supervisao", e.target.value)}
            placeholder="Nome do supervisor (opcional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="versao">Versão *</Label>
          <Input
            id="versao"
            value={data.versao}
            onChange={(e) => onChange("versao", e.target.value)}
            placeholder="Ex: 1.0"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
