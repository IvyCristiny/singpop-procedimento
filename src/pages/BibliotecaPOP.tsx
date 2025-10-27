import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, RotateCcw } from "lucide-react";
import { FunctionManager } from "@/components/biblioteca/FunctionManager";
import { ActivityManager } from "@/components/biblioteca/ActivityManager";
import { CatalogHistory } from "@/components/biblioteca/CatalogHistory";
import { useToast } from "@/hooks/use-toast";
import { useCatalog } from "@/hooks/useCatalog";
import { useRole } from "@/hooks/useRole";

export const BibliotecaPOP = () => {
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const { toast } = useToast();
  const { catalog, loading, resetToDefault, refetch } = useCatalog();
  const { isGerenteGeral } = useRole();

  const handleResetToDefault = async () => {
    if (confirm("Tem certeza que deseja restaurar o catálogo padrão? Todas as suas alterações serão perdidas.")) {
      const success = await resetToDefault();
      if (success) {
        setSelectedFunction(null);
        toast({
          title: "Catálogo restaurado",
          description: "O catálogo foi restaurado para os valores padrão.",
        });
        refetch();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Biblioteca POP</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie funções, atividades, materiais e responsabilidades
            </p>
          </div>
        </div>
        <Button
          onClick={handleResetToDefault}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar Padrão
        </Button>
      </div>

      <Tabs defaultValue="functions" className="w-full">
        <TabsList className={`grid w-full ${isGerenteGeral ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="functions">Funções</TabsTrigger>
          <TabsTrigger value="activities" disabled={!selectedFunction}>
            Atividades {selectedFunction && `(${catalog.functions.find(f => f.id === selectedFunction)?.name})`}
          </TabsTrigger>
          {isGerenteGeral && (
            <TabsTrigger value="history">Histórico</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="functions" className="space-y-4">
          <FunctionManager
            catalog={catalog}
            onUpdate={refetch}
            onSelectFunction={setSelectedFunction}
            selectedFunction={selectedFunction}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          {selectedFunction ? (
            <ActivityManager
              functionId={selectedFunction}
              catalog={catalog}
              onUpdate={refetch}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Selecione uma função para gerenciar suas atividades
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isGerenteGeral && (
          <TabsContent value="history" className="space-y-4">
            <CatalogHistory />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
