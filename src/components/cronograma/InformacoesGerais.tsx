import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { turnosDisponiveis } from "@/types/cronograma";

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
}

export const InformacoesGerais = ({ data, onChange }: InformacoesGeraisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
        <CardDescription>Defina as informações básicas do cronograma</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Cronograma *</Label>
          <Input
            id="titulo"
            value={data.titulo}
            onChange={(e) => onChange("titulo", e.target.value)}
            placeholder="Ex: Cronograma de Limpeza - Torre A"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condominio">Condomínio *</Label>
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
          <Label htmlFor="responsavel">Responsável *</Label>
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
