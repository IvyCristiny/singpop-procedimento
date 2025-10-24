import { useUsers } from "@/hooks/useUsers";
import { useZonas } from "@/hooks/useZonas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { AppRole } from "@/types/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const UserManagement = () => {
  const { users, loading, updateUserRole, updateUserZona } = useUsers();
  const { zonas } = useZonas();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("supervisor");
  const [selectedZona, setSelectedZona] = useState<string | null>(null);

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

  if (loading) {
    return <div className="text-center py-8">Carregando usuários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Usuários</CardTitle>
        <CardDescription>Gerencie roles e zonas dos usuários do sistema</CardDescription>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
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
                        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="gerente_zona">Gerente de Zona</SelectItem>
                            <SelectItem value="gerente_geral">Gerente Geral</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <RoleBadge role={primaryRole} />
                      )}
                    </TableCell>
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(user.id, primaryRole, user.profile.zona_id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
