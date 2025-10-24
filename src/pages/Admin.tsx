import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, BarChart3 } from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";
import { ZonaManagement } from "@/components/admin/ZonaManagement";
import { Statistics } from "@/components/admin/Statistics";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-light p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Usuários
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
