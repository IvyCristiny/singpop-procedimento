import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RotinaConfig } from "@/types/cronograma";
import { Sparkles, Clock, Coffee, Zap, Calendar } from "lucide-react";

interface RotinaConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: RotinaConfig) => void;
  turno: string;
}

export const RotinaConfigDialog = ({ open, onOpenChange, onConfirm, turno }: RotinaConfigDialogProps) => {
  const [config, setConfig] = useState<RotinaConfig>({
    horarioInicio: "07:00",
    horarioFim: "17:00",
    almocoInicio: "11:00",
    almocoFim: "13:00",
    pausaEntre: 5,
    priorizacao: "sequencial",
    distribuicao: "compacta",
  });

  // Extrair horários do turno selecionado
  useEffect(() => {
    if (turno && turno !== "custom") {
      const match = turno.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (match) {
        const [, inicio, fim] = match;
        setConfig(prev => ({
          ...prev,
          horarioInicio: inicio,
          horarioFim: fim,
        }));
      }

      // Detectar horário de almoço pela descrição
      if (turno.includes("11h00 às 13h00")) {
        setConfig(prev => ({ ...prev, almocoInicio: "11:00", almocoFim: "13:00" }));
      } else if (turno.includes("12h00 às 14h00")) {
        setConfig(prev => ({ ...prev, almocoInicio: "12:00", almocoFim: "14:00" }));
      } else if (turno.includes("1h de almoço")) {
        // Calcular meio do turno para 1h de almoço
        const inicio = parseInt(match?.[1].split(":")[0] || "7");
        const meioTurno = Math.floor((inicio + parseInt(match?.[2].split(":")[0] || "17")) / 2);
        setConfig(prev => ({ 
          ...prev, 
          almocoInicio: `${meioTurno.toString().padStart(2, "0")}:00`,
          almocoFim: `${(meioTurno + 1).toString().padStart(2, "0")}:00`
        }));
      }
    }
  }, [turno]);

  const handleConfirm = () => {
    onConfirm(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Configurar Geração de Rotina
          </DialogTitle>
          <DialogDescription>
            Personalize como as atividades serão distribuídas no cronograma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1">
          {/* Horários */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Horários
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioInicio">Início do Turno</Label>
                <Input
                  id="horarioInicio"
                  type="time"
                  value={config.horarioInicio}
                  onChange={(e) => setConfig({ ...config, horarioInicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioFim">Fim do Turno</Label>
                <Input
                  id="horarioFim"
                  type="time"
                  value={config.horarioFim}
                  onChange={(e) => setConfig({ ...config, horarioFim: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Horário de Almoço */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Coffee className="w-4 h-4" />
              Horário de Almoço (opcional)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="almocoInicio">Início</Label>
                <Input
                  id="almocoInicio"
                  type="time"
                  value={config.almocoInicio || ""}
                  onChange={(e) => setConfig({ ...config, almocoInicio: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="almocoFim">Fim</Label>
                <Input
                  id="almocoFim"
                  type="time"
                  value={config.almocoFim || ""}
                  onChange={(e) => setConfig({ ...config, almocoFim: e.target.value || undefined })}
                />
              </div>
            </div>
          </div>

          {/* Pausa entre Atividades */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap className="w-4 h-4" />
              Pausa entre Atividades
            </div>
            <Select
              value={config.pausaEntre.toString()}
              onValueChange={(value) => setConfig({ ...config, pausaEntre: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sem pausa</SelectItem>
                <SelectItem value="5">5 minutos</SelectItem>
                <SelectItem value="10">10 minutos</SelectItem>
                <SelectItem value="15">15 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priorização */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Priorização das Atividades
            </div>
            <RadioGroup
              value={config.priorizacao}
              onValueChange={(value: any) => setConfig({ ...config, priorizacao: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sequencial" id="sequencial" />
                <Label htmlFor="sequencial" className="font-normal cursor-pointer">
                  <div className="font-medium">Sequencial</div>
                  <div className="text-xs text-muted-foreground">
                    Manter a ordem dos POPs selecionados
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tempo" id="tempo" />
                <Label htmlFor="tempo" className="font-normal cursor-pointer">
                  <div className="font-medium">Por Tempo</div>
                  <div className="text-xs text-muted-foreground">
                    Atividades mais rápidas primeiro
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="funcao" id="funcao" />
                <Label htmlFor="funcao" className="font-normal cursor-pointer">
                  <div className="font-medium">Por Função</div>
                  <div className="text-xs text-muted-foreground">
                    Agrupar atividades por tipo de função
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Distribuição */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Distribuição no Turno</Label>
            <RadioGroup
              value={config.distribuicao}
              onValueChange={(value: any) => setConfig({ ...config, distribuicao: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compacta" id="compacta" />
                <Label htmlFor="compacta" className="font-normal cursor-pointer">
                  <div className="font-medium">Compacta</div>
                  <div className="text-xs text-muted-foreground">
                    Atividades seguidas com pausas mínimas
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="espacada" id="espacada" />
                <Label htmlFor="espacada" className="font-normal cursor-pointer">
                  <div className="font-medium">Espaçada</div>
                  <div className="text-xs text-muted-foreground">
                    Distribuir uniformemente ao longo do turno
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar Rotina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
