import { useUsers } from "@/hooks/useUsers";
import { useZonas } from "@/hooks/useZonas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppRole } from "@/types/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const UserManagement = () => {
  const { users, loading, updateUserRole, updateUserZona, deleteUser } = useUsers();
  const { zonas } = useZonas();
  const { isGerenteGeral, isGerenteZona } = useRole();
  const { profile, user: currentUser } = useAuth();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("supervisor");
  const [selectedZona, setSelectedZona] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);

  // Filtrar usuários baseado na role
  const filteredUsers = isGerenteZona && profile?.zona_id
    ? users.filter(u => u.profile.zona_id === profile.zona_id && u.roles.includes("supervisor"))
    : users;

  const handleEdit = (userId: string, currentRole: AppRole, currentZonaId: string | null | undefined) => {
    setEditingUser(userId);
    setSelectedRole(currentRole);
    setSelectedZona(currentZonaId || null);
  };

  const handleSave = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const currentRole = user.roles[0];
    const currentZonaId = user.profile.zona_id;

    if (currentRole !== selectedRole) {
      await updateUserRole(userId, selectedRole);
    }

    if (currentZonaId !== selectedZona) {
      await updateUserZona(userId, selectedZona);
    }

    setEditingUser(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setDeletingUser({ id: userId, name: userName });
  };

  const handleDeleteConfirm = async () => {
    if (deletingUser) {
      await deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando usuários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Usuários</CardTitle>
        <CardDescription>
          {isGerenteZona 
            ? "Gerencie os supervisores da sua zona operativa" 
            : "Gerencie roles e zonas dos usuários do sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Role</TableHead>
                {isGerenteGeral && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const isEditing = editingUser === user.id;
                const primaryRole = user.roles[0] || "supervisor";

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.profile.full_name}</TableCell>
                    <TableCell>{user.profile.email}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select value={selectedZona || ""} onValueChange={setSelectedZona}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione zona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="null">Sem zona</SelectItem>
                            {zonas.map((zona) => (
                              <SelectItem key={zona.id} value={zona.id}>
                                {zona.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{user.profile.zona?.nome || "—"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select 
                          value={selectedRole} 
                          onValueChange={(value) => setSelectedRole(value as AppRole)}
                          disabled={isGerenteZona}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            {isGerenteGeral && <SelectItem value="gerente_zona">Gerente de Zona</SelectItem>}
                            {isGerenteGeral && <SelectItem value="gerente_geral">Gerente Geral</SelectItem>}
                          </SelectContent>
                        </Select>
                      ) : (
                        <RoleBadge role={primaryRole} />
                      )}
                    </TableCell>
                    {isGerenteGeral && (
                      <TableCell className="text-right">
                        {isEditing ? (
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => handleSave(user.id)}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(user.id, primaryRole, user.profile.zona_id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(user.id, user.profile.full_name)}
                              disabled={currentUser?.id === user.id}
                              className="text-destructive hover:text-destructive disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{deletingUser?.name}</strong>?
              Esta ação não pode ser desfeita e todos os dados do usuário serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
