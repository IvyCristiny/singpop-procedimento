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
  
  // Verificar supervisores sem zona
  const usuariosSemZona = users.filter(u => 
    u.roles.includes('supervisor') && !u.profile.zona_id
  );

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
        
        {usuariosSemZona.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção: Perfis Incompletos</AlertTitle>
            <AlertDescription>
              Há {usuariosSemZona.length} supervisor(es) sem zona atribuída. 
              Estes usuários não conseguirão criar POPs até que uma zona seja atribuída.
              <br />
              <strong>Usuários sem zona:</strong> {usuariosSemZona.map(u => u.profile.full_name).join(", ")}
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
