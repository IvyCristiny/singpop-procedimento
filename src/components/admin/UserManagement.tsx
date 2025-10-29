import { useUsers } from "@/hooks/useUsers";
import { useZonas } from "@/hooks/useZonas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash2, Filter, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { AppRole } from "@/types/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export const UserManagement = () => {
  const { users, loading, updateUserRole, updateUserZona, deleteUser } = useUsers();
  const { zonas } = useZonas();
  const { isGerenteGeral, isGerenteZona } = useRole();
  const { profile, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("supervisor");
  const [selectedZona, setSelectedZona] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);
  const [roleFilter, setRoleFilter] = useState<AppRole | "all">("all");

  // Filtrar usuários baseado na role do gerente
  let baseFilteredUsers = isGerenteZona && profile?.zona_id
    ? users.filter(u => u.profile.zona_id === profile.zona_id && u.roles.includes("supervisor"))
    : users;

  // Aplicar filtro de role selecionado
  const filteredUsers = roleFilter === "all" 
    ? baseFilteredUsers 
    : baseFilteredUsers.filter(u => u.roles.includes(roleFilter));

  // Contadores
  const totalUsers = users.length;
  const gerentesGerais = users.filter(u => u.roles.includes("gerente_geral")).length;
  const gerentesZona = users.filter(u => u.roles.includes("gerente_zona")).length;
  const supervisores = users.filter(u => u.roles.includes("supervisor")).length;

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

    // ✅ Validação OBRIGATÓRIA: Supervisor E Gerente de Zona devem ter zona atribuída
    if ((selectedRole === "supervisor" || selectedRole === "gerente_zona") && !selectedZona) {
      toast({
        title: "Zona Operativa Obrigatória",
        description: `${selectedRole === "supervisor" ? "Supervisores" : "Gerentes de Zona"} precisam de uma zona operativa atribuída para poder criar POPs e gerenciar condomínios.`,
        variant: "destructive",
        duration: 6000,
      });
      return;
    }

    // Confirmação dupla para mudanças sensíveis
    if (currentRole === "gerente_geral" && selectedRole !== "gerente_geral") {
      const confirmed = confirm(
        `⚠️ ATENÇÃO: Você está rebaixando um Gerente Geral para ${selectedRole}.\n\nEsta é uma ação sensível. Tem certeza?`
      );
      if (!confirmed) return;
    }

    if (currentRole !== selectedRole) {
      const result = await updateUserRole(userId, selectedRole);
      if (result.error) return; // Se deu erro, não continuar
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
      <CardContent className="space-y-4">
        {/* Contadores e Filtros */}
        {isGerenteGeral && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-destructive/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gerentes Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{gerentesGerais}</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gerentes Zona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{gerentesZona}</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-secondary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Supervisores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{supervisores}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={roleFilter} onValueChange={(v) => setRoleFilter(v as AppRole | "all")}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos ({totalUsers})</TabsTrigger>
                <TabsTrigger value="gerente_geral">GG ({gerentesGerais})</TabsTrigger>
                <TabsTrigger value="gerente_zona">GZ ({gerentesZona})</TabsTrigger>
                <TabsTrigger value="supervisor">SUP ({supervisores})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {/* Tabela */}
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
                const semZona = !user.profile.zona_id;
                const isGerenteZonaSemZona = primaryRole === "gerente_zona" && semZona;

                return (
                  <TableRow key={user.id} className={isGerenteZonaSemZona ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.profile.full_name}
                        {isGerenteZonaSemZona && (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.profile.email}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-1">
                          <Select value={selectedZona || ""} onValueChange={setSelectedZona}>
                            <SelectTrigger className={`w-[180px] ${(selectedRole === "supervisor" || selectedRole === "gerente_zona") && !selectedZona ? "border-destructive" : ""}`}>
                              <SelectValue placeholder="Selecione zona *" />
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
                          {(selectedRole === "supervisor" || selectedRole === "gerente_zona") && !selectedZona && (
                            <p className="text-xs text-destructive">⚠️ Obrigatório para {selectedRole === "supervisor" ? "Supervisor" : "Gerente de Zona"}</p>
                          )}
                        </div>
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
