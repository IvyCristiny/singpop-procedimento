import { useZonas } from "@/hooks/useZonas";
import { useUsers } from "@/hooks/useUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X, Shield, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { useRole } from "@/contexts/RoleContext";

export const ZonaManagement = () => {
  const { zonas, loading, createZona, updateZona, deleteZona } = useZonas();
  const { users, loading: usersLoading } = useUsers();
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

  if (loading || usersLoading) {
    return <div className="text-center py-8">Carregando zonas...</div>;
  }

  const getUsersInZona = (zonaId: string) => {
    return users.filter(u => u.profile.zona_id === zonaId);
  };

  const getGerenteZona = (zonaId: string) => {
    return users.find(u => 
      u.profile.zona_id === zonaId && 
      u.roles.includes("gerente_zona")
    );
  };

  const getSupervisors = (zonaId: string) => {
    return users.filter(u => 
      u.profile.zona_id === zonaId && 
      u.roles.includes("supervisor")
    );
  };

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
            const membersCount = getUsersInZona(zona.id).length;
            const gerente = getGerenteZona(zona.id);
            const supervisors = getSupervisors(zona.id);

            return (
              <Card key={zona.id} className={isEditing ? "border-primary" : ""}>
                <CardContent className="pt-6 space-y-4">
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
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {zona.nome}
                            <span className="text-sm text-muted-foreground font-normal">
                              ({membersCount} {membersCount === 1 ? "membro" : "membros"})
                            </span>
                          </h3>
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

                      {/* Accordion com membros */}
                      {membersCount > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="members" className="border-none">
                            <AccordionTrigger className="text-sm font-medium hover:no-underline">
                              Ver membros da zona
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                {/* Gerente de Zona */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    <h4 className="text-sm font-semibold">Gerente de Zona</h4>
                                  </div>
                                  {gerente ? (
                                    <div className="ml-6 p-3 bg-muted/50 rounded-md">
                                      <p className="text-sm font-medium">{gerente.profile.full_name}</p>
                                      <p className="text-xs text-muted-foreground">{gerente.profile.email}</p>
                                    </div>
                                  ) : (
                                    <p className="ml-6 text-sm text-muted-foreground italic">
                                      Nenhum gerente atribuído
                                    </p>
                                  )}
                                </div>

                                {/* Supervisores */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <UsersIcon className="w-4 h-4 text-primary" />
                                    <h4 className="text-sm font-semibold">
                                      Supervisores ({supervisors.length})
                                    </h4>
                                  </div>
                                  {supervisors.length > 0 ? (
                                    <div className="ml-6 space-y-2">
                                      {supervisors.map(supervisor => (
                                        <div key={supervisor.id} className="p-3 bg-muted/50 rounded-md">
                                          <p className="text-sm font-medium">{supervisor.profile.full_name}</p>
                                          <p className="text-xs text-muted-foreground">{supervisor.profile.email}</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="ml-6 text-sm text-muted-foreground italic">
                                      Nenhum supervisor atribuído
                                    </p>
                                  )}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </>
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
