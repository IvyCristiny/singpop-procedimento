import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoleBadge } from "@/components/RoleBadge";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { AppRole } from "@/types/auth";

interface AuditLog {
  id: string;
  user_id: string;
  old_role: AppRole | null;
  new_role: AppRole | null;
  changed_at: string;
  changed_by: string;
  user_name?: string;
  changed_by_name?: string;
}

export const RoleAuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data: auditData, error: auditError } = await supabase
        .from("user_roles_audit")
        .select("*")
        .order("changed_at", { ascending: false })
        .limit(50);

      if (auditError) throw auditError;

      // Buscar nomes dos usuários
      const userIds = [...new Set([
        ...auditData.map(a => a.user_id),
        ...auditData.map(a => a.changed_by)
      ])];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      const enrichedLogs: AuditLog[] = auditData.map(log => ({
        ...log,
        user_name: profileMap.get(log.user_id) || "Usuário desconhecido",
        changed_by_name: profileMap.get(log.changed_by) || "Sistema"
      }));

      setLogs(enrichedLogs);
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando histórico...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Mudanças de Roles</CardTitle>
        <CardDescription>
          Registro completo de todas as alterações de permissões no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma mudança de role registrada ainda.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Mudança</TableHead>
                  <TableHead>Alterado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(log.changed_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">{log.user_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {log.old_role ? (
                          <RoleBadge role={log.old_role} />
                        ) : (
                          <Badge variant="outline">—</Badge>
                        )}
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        {log.new_role ? (
                          <RoleBadge role={log.new_role} />
                        ) : (
                          <Badge variant="outline" className="line-through">Removido</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.changed_by_name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
