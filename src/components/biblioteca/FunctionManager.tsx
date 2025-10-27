import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Catalog, Function as FunctionType } from "@/types/schema";
import { useCatalog } from "@/hooks/useCatalog";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/hooks/useRole";

interface FunctionManagerProps {
  catalog: Catalog;
  onUpdate: () => void;
  onSelectFunction: (id: string | null) => void;
  selectedFunction: string | null;
}

export const FunctionManager = ({ catalog, onUpdate, onSelectFunction, selectedFunction }: FunctionManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<FunctionType>>({
    name: "",
    description: "",
    icon: "Briefcase",
    tags: [],
    activities: []
  });
  const { toast } = useToast();
  const { addFunction, updateFunction, deleteFunction } = useCatalog();
  const { isGerenteGeral, isGerenteZona } = useRole();

  const canEdit = isGerenteGeral || isGerenteZona;

  const handleEdit = (func: FunctionType) => {
    setEditingId(func.id);
    setFormData({
      ...func,
      tags: [...func.tags]
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      icon: "Briefcase",
      tags: [],
      activities: []
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    let success = false;

    if (isAdding) {
      const newFunction: FunctionType = {
        id: `func_${Date.now()}`,
        name: formData.name!,
        description: formData.description!,
        icon: formData.icon || "Briefcase",
        tags: formData.tags || [],
        activities: []
      };
      success = await addFunction(newFunction);
      if (success) {
        toast({
          title: "Função adicionada",
          description: `${newFunction.name} foi adicionada com sucesso`,
        });
      }
    } else if (editingId) {
      const oldFunction = catalog?.functions?.find(f => f.id === editingId);
      const updatedFunction: FunctionType = {
        id: editingId,
        name: formData.name!,
        description: formData.description!,
        icon: formData.icon || "Briefcase",
        tags: formData.tags || [],
        activities: oldFunction?.activities || []
      };
      success = await updateFunction(editingId, updatedFunction, oldFunction);
      if (success) {
        toast({
          title: "Função atualizada",
          description: `${updatedFunction.name} foi atualizada com sucesso`,
        });
      }
    }

    if (success) {
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", description: "", icon: "Briefcase", tags: [], activities: [] });
      onUpdate();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar a função "${name}"? Todas as atividades relacionadas serão perdidas.`)) {
      const success = await deleteFunction(id);
      if (success) {
        if (selectedFunction === id) {
          onSelectFunction(null);
        }
        toast({
          title: "Função deletada",
          description: `${name} foi deletada com sucesso`,
        });
        onUpdate();
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", description: "", icon: "Briefcase", tags: [], activities: [] });
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tag] });
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciar Funções</h3>
        {canEdit && !isAdding && !editingId && (
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Função
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{isAdding ? "Nova Função" : "Editar Função"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Portaria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a função..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Ícone (Lucide React)</Label>
              <Input
                id="icon"
                value={formData.icon || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Ex: Briefcase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (pressione Enter para adicionar)</Label>
              <Input
                id="tags"
                placeholder="Ex: segurança"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog?.functions?.map((func) => (
          <Card
            key={func.id}
            className={`cursor-pointer transition-all ${
              selectedFunction === func.id ? "border-primary shadow-md" : ""
            }`}
            onClick={() => onSelectFunction(func.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{func.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {func.activities.length} atividades
                  </CardDescription>
                </div>
                {canEdit && (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(func)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(func.id, func.name)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {func.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {func.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
