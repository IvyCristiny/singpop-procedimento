import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, RotateCcw } from "lucide-react";
import { getCustomCatalog, resetToDefaultCatalog } from "@/utils/catalogStorage";
import { FunctionManager } from "@/components/biblioteca/FunctionManager";
import { ActivityManager } from "@/components/biblioteca/ActivityManager";
import { useToast } from "@/hooks/use-toast";

export const BibliotecaPOP = () => {
  const [catalog, setCatalog] = useState(getCustomCatalog());
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshCatalog = () => {
    setCatalog(getCustomCatalog());
  };

  const handleResetToDefault = () => {
    if (confirm("Tem certeza que deseja restaurar o catálogo padrão? Todas as suas alterações serão perdidas.")) {
      resetToDefaultCatalog();
      refreshCatalog();
      setSelectedFunction(null);
      toast({
        title: "Catálogo restaurado",
        description: "O catálogo foi restaurado para os valores padrão.",
      });
    }
  };

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="functions">Funções</TabsTrigger>
          <TabsTrigger value="activities" disabled={!selectedFunction}>
            Atividades {selectedFunction && `(${catalog.functions.find(f => f.id === selectedFunction)?.name})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-4">
          <FunctionManager
            catalog={catalog}
            onUpdate={refreshCatalog}
            onSelectFunction={setSelectedFunction}
            selectedFunction={selectedFunction}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          {selectedFunction ? (
            <ActivityManager
              functionId={selectedFunction}
              catalog={catalog}
              onUpdate={refreshCatalog}
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
      </Tabs>
    </div>
  );
};
