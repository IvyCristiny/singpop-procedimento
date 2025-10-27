import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Catalog, Activity } from "@/types/schema";
import { ActivityEditor } from "./ActivityEditor";
import { useToast } from "@/hooks/use-toast";
import { useCatalog } from "@/hooks/useCatalog";
import { useRole } from "@/hooks/useRole";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ActivityManagerProps {
  functionId: string;
  catalog: Catalog;
  onUpdate: () => void;
}

export const ActivityManager = ({ functionId, catalog, onUpdate }: ActivityManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const { deleteActivity } = useCatalog();
  const { isGerenteGeral, isGerenteZona } = useRole();

  const canEdit = isGerenteGeral || isGerenteZona;
  const currentFunction = catalog?.functions?.find(f => f.id === functionId);
  const activities = currentFunction?.activities || [];

  const handleEdit = (activityId: string) => {
    setEditingId(activityId);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
  };

  const handleDelete = async (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity && confirm(`Tem certeza que deseja deletar a atividade "${activity.name}"?`)) {
      const success = await deleteActivity(functionId, activityId);
      if (success) {
        toast({
          title: "Atividade deletada",
          description: `${activity.name} foi deletada com sucesso`,
        });
        onUpdate();
      }
    }
  };

  const handleSaveComplete = () => {
    setIsAdding(false);
    setEditingId(null);
    onUpdate();
  };

  if (isAdding || editingId) {
    const activity = editingId ? activities.find(a => a.id === editingId) : undefined;
    return (
      <ActivityEditor
        functionId={functionId}
        activity={activity}
        onSave={handleSaveComplete}
        onCancel={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Atividades de {currentFunction?.name}
        </h3>
        {canEdit && (
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Atividade
          </Button>
        )}
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma atividade cadastrada. Clique em "Nova Atividade" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {activities.map((activity, index) => (
            <AccordionItem key={activity.id} value={activity.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3 text-left">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <h4 className="font-semibold">{activity.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.procedure.steps.length} passos
                      </p>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(activity.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-3">
                  <div>
                    <p className="text-sm font-medium">Objetivo:</p>
                    <p className="text-sm text-muted-foreground">{activity.objective}</p>
                  </div>
                  {activity.scope && (
                    <div>
                      <p className="text-sm font-medium">Escopo:</p>
                      <p className="text-sm text-muted-foreground">{activity.scope}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Responsabilidades:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {(activity.responsibilities || []).map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
