import { useZonas } from "@/hooks/useZonas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRole } from "@/hooks/useRole";

export const ZonaManagement = () => {
  const { zonas, loading, createZona, updateZona, deleteZona } = useZonas();
  const { isGerenteGeral } = useRole();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zonaToDelete, setZonaToDelete] = useState<{ id: string; nome: string } | null>(null);
  const [formData, setFormData] = useState({ nome: "", descricao: "" });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ nome: "", descricao: "" });
  };

  const handleEdit = (id: string, nome: string, descricao?: string) => {
    setEditingId(id);
    setFormData({ nome, descricao: descricao || "" });
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    if (isAdding) {
      await createZona(formData.nome, formData.descricao);
      setIsAdding(false);
    } else if (editingId) {
      await updateZona(editingId, formData.nome, formData.descricao);
      setEditingId(null);
    }
    setFormData({ nome: "", descricao: "" });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ nome: "", descricao: "" });
  };

  const handleDeleteClick = (id: string, nome: string) => {
    setZonaToDelete({ id, nome });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (zonaToDelete) {
      await deleteZona(zonaToDelete.id);
      setDeleteDialogOpen(false);
      setZonaToDelete(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando zonas...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Zonas Operativas</CardTitle>
              <CardDescription>
                {isGerenteGeral 
                  ? "Adicione, edite ou remova zonas operativas" 
                  : "Visualize as zonas operativas do sistema"}
              </CardDescription>
            </div>
            {isGerenteGeral && (
              <Button onClick={handleAdd} disabled={isAdding || editingId !== null}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Zona
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <Card className="border-primary">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da Zona</label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Zona Operativa 5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrição (opcional)</label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição da zona..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {zonas.map((zona) => {
            const isEditing = editingId === zona.id;

            return (
              <Card key={zona.id} className={isEditing ? "border-primary" : ""}>
                <CardContent className="pt-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nome da Zona</label>
                        <Input
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Descrição (opcional)</label>
                        <Textarea
                          value={formData.descricao}
                          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{zona.nome}</h3>
                        {zona.descricao && (
                          <p className="text-sm text-muted-foreground mt-1">{zona.descricao}</p>
                        )}
                      </div>
                      {isGerenteGeral && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(zona.id, zona.nome, zona.descricao)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(zona.id, zona.nome)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a zona "{zonaToDelete?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
