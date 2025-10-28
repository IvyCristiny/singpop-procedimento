import { useUsers } from "@/hooks/useUsers";
import { useZonas } from "@/hooks/useZonas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";
import { RoleBadge } from "@/components/RoleBadge";

export const HierarchyOverview = () => {
  const { users, loading } = useUsers();
  const { zonas } = useZonas();

  if (loading) {
    return <div className="text-center py-8">Carregando hierarquia...</div>;
  }

  // Contadores por role
  const gerentesGerais = users.filter(u => u.roles.includes("gerente_geral"));
  const gerentesZona = users.filter(u => u.roles.includes("gerente_zona"));
  const supervisores = users.filter(u => u.roles.includes("supervisor"));

  // Validações de integridade
  const gerentesSemZona = gerentesZona.filter(g => !g.profile.zona_id);
  const supervisoresSemZona = supervisores.filter(s => !s.profile.zona_id);
  const zonasVazias = zonas.filter(z => 
    !users.some(u => u.profile.zona_id === z.id)
  );

  const hasIssues = gerentesSemZona.length > 0 || zonasVazias.length > 0;

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-destructive" />
              Gerentes Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gerentesGerais.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Acesso total ao sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Gerentes de Zona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gerentesZona.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Gerenciam zonas operativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              Supervisores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{supervisores.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Operação no campo</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Integridade */}
      {hasIssues ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Inconsistências detectadas:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              {gerentesSemZona.length > 0 && (
                <li>• {gerentesSemZona.length} Gerente(s) de Zona sem zona atribuída</li>
              )}
              {zonasVazias.length > 0 && (
                <li>• {zonasVazias.length} Zona(s) sem usuários atribuídos</li>
              )}
              {supervisoresSemZona.length > 0 && (
                <li>⚠️ {supervisoresSemZona.length} Supervisor(es) sem zona atribuída</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Sistema hierárquico configurado corretamente. Nenhuma inconsistência detectada.
          </AlertDescription>
        </Alert>
      )}

      {/* Usuários por Zona */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Zona Operativa</CardTitle>
          <CardDescription>Visualização da estrutura hierárquica por zona</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {zonas.map(zona => {
            const usuariosZona = users.filter(u => u.profile.zona_id === zona.id);
            const gerenteZona = usuariosZona.find(u => u.roles.includes("gerente_zona"));
            const supervisoresZona = usuariosZona.filter(u => u.roles.includes("supervisor"));

            return (
              <div key={zona.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">{zona.nome}</h3>
                  </div>
                  <Badge variant="outline">{usuariosZona.length} usuários</Badge>
                </div>

                {zona.descricao && (
                  <p className="text-sm text-muted-foreground">{zona.descricao}</p>
                )}

                <div className="space-y-2 pl-6">
                  {gerenteZona ? (
                    <div className="flex items-center gap-2">
                      <RoleBadge role="gerente_zona" />
                      <span className="text-sm">{gerenteZona.profile.full_name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Sem gerente atribuído</span>
                    </div>
                  )}

                  {supervisoresZona.length > 0 && (
                    <div className="space-y-1 pl-6">
                      {supervisoresZona.map(sup => (
                        <div key={sup.id} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                          <span className="text-sm">{sup.profile.full_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Usuários sem zona */}
          {(supervisoresSemZona.length > 0 || gerentesSemZona.length > 0) && (
            <div className="border border-dashed rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 className="font-semibold">Usuários sem Zona</h3>
                <Badge variant="destructive">
                  {supervisoresSemZona.length + gerentesSemZona.length}
                </Badge>
              </div>
              <div className="space-y-1 pl-6">
                {[...gerentesSemZona, ...supervisoresSemZona].map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <RoleBadge role={user.roles[0] || "supervisor"} />
                    <span className="text-sm">{user.profile.full_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
