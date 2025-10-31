import { useState } from "react";
import { usePOPs } from "@/hooks/usePOPs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface POPSelectorProps {
  selectedPOPIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const POPSelector = ({ selectedPOPIds, onSelectionChange }: POPSelectorProps) => {
  const { pops, loading } = usePOPs();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Obter condomínio dos POPs selecionados
  const selectedCondominio = selectedPOPIds.length > 0
    ? pops.find((p) => selectedPOPIds.includes(p.id))?.condominioNome
    : null;

  const filteredPOPs = pops.filter((pop) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pop.condominioNome.toLowerCase().includes(searchLower) ||
      pop.codigoPOP.toLowerCase().includes(searchLower) ||
      pop.functionId.toLowerCase().includes(searchLower)
    );
  });

  const handleToggle = (popId: string) => {
    const pop = pops.find((p) => p.id === popId);
    if (!pop) return;

    // Se já há POPs selecionados, verificar condomínio
    if (selectedPOPIds.length > 0 && !selectedPOPIds.includes(popId)) {
      const selectedPOPs = pops.filter((p) => selectedPOPIds.includes(p.id));
      const condominioAtual = selectedPOPs[0].condominioNome;

      if (pop.condominioNome !== condominioAtual) {
        // Mostrar alerta
        toast({
          title: "Condomínio diferente!",
          description: `Este POP é do condomínio "${pop.condominioNome}", mas você já selecionou POPs do condomínio "${condominioAtual}". Apenas POPs do mesmo condomínio podem ser combinados.`,
          variant: "destructive",
        });
        return; // Não adicionar
      }
    }

    // Prosseguir com seleção normal
    const newSelection = selectedPOPIds.includes(popId)
      ? selectedPOPIds.filter((id) => id !== popId)
      : [...selectedPOPIds, popId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedPOPIds.length === filteredPOPs.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredPOPs.map((pop) => pop.id));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selecionar POPs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Selecionar POPs</CardTitle>
          <div className="flex items-center gap-2">
            {selectedCondominio && (
              <Badge variant="outline" className="text-xs">
                {selectedCondominio}
              </Badge>
            )}
            <Badge variant="secondary">{selectedPOPIds.length} selecionados</Badge>
          </div>
        </div>
        {selectedCondominio && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            <AlertCircle className="w-3 h-3" />
            Apenas POPs do condomínio "{selectedCondominio}" podem ser selecionados
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por condomínio, código ou função..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredPOPs.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary hover:underline"
          >
            {selectedPOPIds.length === filteredPOPs.length ? "Desselecionar todos" : "Selecionar todos"}
          </button>
        )}

        <ScrollArea className="h-[400px] rounded-md border p-4">
          {filteredPOPs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum POP encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPOPs.map((pop) => {
                const isDisabled =
                  selectedCondominio &&
                  pop.condominioNome !== selectedCondominio &&
                  !selectedPOPIds.includes(pop.id);

                return (
                  <div
                    key={pop.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed bg-muted"
                        : "hover:bg-accent cursor-pointer"
                    }`}
                    onClick={() => !isDisabled && handleToggle(pop.id)}
                  >
                    <Checkbox
                      checked={selectedPOPIds.includes(pop.id)}
                      disabled={isDisabled}
                      onCheckedChange={() => !isDisabled && handleToggle(pop.id)}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pop.condominioNome}</span>
                        <Badge variant="outline" className="text-xs">
                          {pop.codigoPOP}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pop.functionId} • Versão {pop.versao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
