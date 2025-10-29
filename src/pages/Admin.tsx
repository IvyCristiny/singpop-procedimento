import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, BarChart3, ArrowLeft, GitBranch, FileText, AlertCircle } from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";
import { ZonaManagement } from "@/components/admin/ZonaManagement";
import { Statistics } from "@/components/admin/Statistics";
import { HierarchyOverview } from "@/components/admin/HierarchyOverview";
import { RoleAuditLog } from "@/components/admin/RoleAuditLog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/hooks/useUsers";

export default function Admin() {
  const navigate = useNavigate();
  const { users } = useUsers();
  
  // ✅ Separar usuários em 3 categorias
  const usuariosSemRole = users.filter(u => u.roles.length === 0);
  
  const supervisoresSemZona = users.filter(u => 
    u.roles.includes('supervisor') && !u.profile.zona_id
  );
  
  const gerentesZonaSemZona = users.filter(u =>
    u.roles.includes('gerente_zona') && !u.profile.zona_id
  );
  
  const usuariosIncompletos = [...supervisoresSemZona, ...gerentesZonaSemZona];

  return (
    <div className="min-h-screen bg-gradient-light p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
        </div>
        
        {/* ⚠️ Alerta para usuários sem role (pendentes) */}
        {usuariosSemRole.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">
              🔴 {usuariosSemRole.length} Usuário(s) Sem Cargo Atribuído
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p className="font-semibold">
                Estes usuários criaram conta mas ainda não têm cargo definido:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {usuariosSemRole.map(u => (
                  <li key={u.id}>
                    <strong>{u.profile.full_name}</strong> ({u.profile.email}) - Sem cargo
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-3 bg-background/50 rounded-md border border-destructive/30">
                <p className="text-sm font-medium">
                  ⚠️ Estes usuários NÃO podem acessar o sistema até receberem um cargo e zona na aba "Usuários".
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* ⚠️ Alerta para supervisores/gerentes COM cargo mas SEM zona */}
        {usuariosIncompletos.length > 0 && (
          <Alert variant="destructive" className="mb-6 border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">
              🟡 {usuariosIncompletos.length} Usuário(s) com Cargo mas Sem Zona Operativa
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p className="font-semibold">
                Estes usuários têm cargo atribuído mas estão sem zona operativa:
              </p>
              
              {supervisoresSemZona.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">📋 Supervisores sem Zona ({supervisoresSemZona.length}):</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {supervisoresSemZona.map(u => (
                      <li key={u.id}>
                        <strong>{u.profile.full_name}</strong> ({u.profile.email})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {gerentesZonaSemZona.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">👔 Gerentes de Zona sem Zona ({gerentesZonaSemZona.length}):</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {gerentesZonaSemZona.map(u => (
                      <li key={u.id}>
                        <strong>{u.profile.full_name}</strong> ({u.profile.email})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/40">
                <p className="text-sm font-bold text-destructive">
                  ⛔ CRÍTICO: Estes usuários NÃO podem criar POPs ou gerenciar condomínios até que uma zona seja atribuída!
                </p>
                <p className="text-sm mt-2">
                  Vá para a aba "Usuários" abaixo e atribua uma zona operativa para cada um.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="gap-2">
              <GitBranch className="w-4 h-4" />
              Hierarquia
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <FileText className="w-4 h-4" />
              Auditoria
            </TabsTrigger>
            <TabsTrigger value="zonas" className="gap-2">
              <MapPin className="w-4 h-4" />
              Zonas
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="hierarchy">
            <HierarchyOverview />
          </TabsContent>

          <TabsContent value="audit">
            <RoleAuditLog />
          </TabsContent>

          <TabsContent value="zonas">
            <ZonaManagement />
          </TabsContent>

          <TabsContent value="stats">
            <Statistics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
