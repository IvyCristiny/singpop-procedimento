import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/contexts/AuthContext";
import { useZonas } from "@/hooks/useZonas";

interface Stats {
  totalUsers: number;
  totalPOPs: number;
  totalZonas: number;
  usersByRole: { role: string; count: number }[];
  popsByZona: { zona: string; count: number }[];
  popsBySupervisor: { supervisor: string; zona: string; count: number }[];
}

export const Statistics = () => {
  const { isGerenteGeral, isGerenteZona } = useRole();
  const { profile } = useAuth();
  const { zonas } = useZonas();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPOPs: 0,
    totalZonas: 0,
    usersByRole: [],
    popsByZona: [],
    popsBySupervisor: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Determinar filtro de zona baseado na role
      let zonaFilter = null;
      if (isGerenteZona && profile?.zona_id) {
        zonaFilter = profile.zona_id;
      }

      // Total users (filtrar por zona se for gerente de zona)
      let usersQuery = supabase.from("profiles").select("*", { count: "exact", head: true });
      if (zonaFilter) {
        usersQuery = usersQuery.eq("zona_id", zonaFilter);
      }
      const { count: userCount } = await usersQuery;

      // Total POPs (filtrar por zona se for gerente de zona)
      let popsQuery = supabase.from("pops").select("*", { count: "exact", head: true });
      if (zonaFilter) {
        popsQuery = popsQuery.eq("zona_id", zonaFilter);
      }
      const { count: popCount } = await popsQuery;

      // Total zonas (sempre 1 se for gerente de zona, total se for gerente geral)
      let zonasQuery = supabase.from("zonas_operativas").select("*", { count: "exact", head: true });
      if (zonaFilter) {
        zonasQuery = zonasQuery.eq("id", zonaFilter);
      }
      const { count: zonaCount } = await zonasQuery;

      // Users by role (filtrar por zona se necessário)
      let rolesQuery = supabase
        .from("user_roles")
        .select("role, user_id");
      
      const { data: rolesData } = await rolesQuery;

      // Se for gerente de zona, filtrar apenas usuários da sua zona
      let filteredRolesData = rolesData;
      if (zonaFilter && rolesData) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id")
          .eq("zona_id", zonaFilter);
        
        const userIdsInZona = profilesData?.map(p => p.id) || [];
        filteredRolesData = rolesData.filter(r => userIdsInZona.includes(r.user_id));
      }

      const roleCounts = filteredRolesData?.reduce((acc: any, { role }) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const usersByRole = Object.entries(roleCounts || {}).map(([role, count]) => ({
        role: role === "supervisor" ? "Supervisor" : role === "gerente_zona" ? "Gerente Zona" : "Gerente Geral",
        count: count as number
      }));

      // POPs by zona (filtrar se necessário)
      let popsByZonaQuery = supabase.from("pops").select(`
        zona_id,
        zona:zonas_operativas(nome)
      `);
      if (zonaFilter) {
        popsByZonaQuery = popsByZonaQuery.eq("zona_id", zonaFilter);
      }
      const { data: popsData } = await popsByZonaQuery;

      const zonaCounts = popsData?.reduce((acc: any, pop: any) => {
        const zonaName = pop.zona?.nome || "Sem zona";
        acc[zonaName] = (acc[zonaName] || 0) + 1;
        return acc;
      }, {});

      const popsByZona = Object.entries(zonaCounts || {}).map(([zona, count]) => ({
        zona,
        count: count as number
      }));

      // POPs by Supervisor (filtrar se necessário)
      let popsBySupervisorQuery = supabase.from("pops").select(`
        user_id,
        zona_id,
        profiles!inner(full_name, zona_id),
        zona:zonas_operativas(nome)
      `);
      if (zonaFilter) {
        popsBySupervisorQuery = popsBySupervisorQuery.eq("zona_id", zonaFilter);
      }
      const { data: popsBySupervisorData } = await popsBySupervisorQuery;

      const supervisorCounts = popsBySupervisorData?.reduce((acc: any, pop: any) => {
        const supervisorName = pop.profiles?.full_name || "Usuário desconhecido";
        const zonaName = pop.zona?.nome || "Sem zona";
        const key = `${supervisorName}|${zonaName}`;
        
        if (!acc[key]) {
          acc[key] = {
            supervisor: supervisorName,
            zona: zonaName,
            count: 0
          };
        }
        acc[key].count += 1;
        return acc;
      }, {});

      const popsBySupervisor = Object.values(supervisorCounts || {});

      setStats({
        totalUsers: userCount || 0,
        totalPOPs: popCount || 0,
        totalZonas: zonaCount || 0,
        usersByRole,
        popsByZona,
        popsBySupervisor: popsBySupervisor as any
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      {isGerenteZona && profile?.zona_id && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📍 Você está visualizando estatísticas apenas da sua zona: <strong>{zonas.find(z => z.id === profile.zona_id)?.nome}</strong>
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de POPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPOPs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Zonas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalZonas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários por Role</CardTitle>
          <CardDescription>Distribuição de usuários por perfil de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.usersByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Usuários" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>POPs por Zona</CardTitle>
          <CardDescription>Distribuição de POPs por zona operativa</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.popsByZona}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="POPs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>POPs por Supervisor</CardTitle>
          <CardDescription>
            {isGerenteZona 
              ? "Quantidade de POPs criados por cada supervisor da sua zona" 
              : "Quantidade de POPs criados por cada supervisor em cada zona"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.popsBySupervisor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="supervisor" 
                angle={-45} 
                textAnchor="end" 
                height={120}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" name="POPs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
