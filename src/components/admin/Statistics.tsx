import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Stats {
  totalUsers: number;
  totalPOPs: number;
  totalZonas: number;
  usersByRole: { role: string; count: number }[];
  popsByZona: { zona: string; count: number }[];
}

export const Statistics = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPOPs: 0,
    totalZonas: 0,
    usersByRole: [],
    popsByZona: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total users
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Total POPs
      const { count: popCount } = await supabase
        .from("pops")
        .select("*", { count: "exact", head: true });

      // Total zonas
      const { count: zonaCount } = await supabase
        .from("zonas_operativas")
        .select("*", { count: "exact", head: true });

      // Users by role
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role");

      const roleCounts = rolesData?.reduce((acc: any, { role }) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const usersByRole = Object.entries(roleCounts || {}).map(([role, count]) => ({
        role: role === "supervisor" ? "Supervisor" : role === "gerente_zona" ? "Gerente Zona" : "Gerente Geral",
        count: count as number
      }));

      // POPs by zona
      const { data: popsData } = await supabase
        .from("pops")
        .select(`
          zona_id,
          zona:zonas_operativas(nome)
        `);

      const zonaCounts = popsData?.reduce((acc: any, pop: any) => {
        const zonaName = pop.zona?.nome || "Sem zona";
        acc[zonaName] = (acc[zonaName] || 0) + 1;
        return acc;
      }, {});

      const popsByZona = Object.entries(zonaCounts || {}).map(([zona, count]) => ({
        zona,
        count: count as number
      }));

      setStats({
        totalUsers: userCount || 0,
        totalPOPs: popCount || 0,
        totalZonas: zonaCount || 0,
        usersByRole,
        popsByZona
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
    </div>
  );
};
