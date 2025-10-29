import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { verifyUserRoles } from "@/utils/roleVerification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export const RoleDebugPanel = () => {
  const { user, session, profile } = useAuth();
  const { roles, primaryRole, loading } = useRole();
  const [verifying, setVerifying] = useState(false);

  const handleVerifyRoles = async () => {
    setVerifying(true);
    try {
      const result = await verifyUserRoles();
      
      if (result.hasRoles) {
        toast.success(`✅ Roles verificadas: ${result.roles.join(", ")}`);
      } else {
        toast.error(`❌ ${result.error || "Nenhuma role encontrada"}`);
      }
    } catch (error) {
      toast.error("Erro ao verificar roles");
    } finally {
      setVerifying(false);
    }
  };

  // Apenas mostrar em desenvolvimento
  if (import.meta.env.PROD) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg z-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          🔍 Debug de Roles
        </CardTitle>
        <CardDescription className="text-xs">
          Painel de debug - apenas em desenvolvimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="space-y-1">
          <div className="font-semibold">Autenticação:</div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Autenticado: {user.email}</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 text-red-600" />
                <span>Não autenticado</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Sessão ativa</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 text-red-600" />
                <span>Sem sessão</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="font-semibold">Perfil:</div>
          {profile ? (
            <>
              <div>Nome: {profile.full_name}</div>
              <div>Zona ID: {profile.zona_id || "Não atribuída"}</div>
            </>
          ) : (
            <div className="text-muted-foreground">Perfil não carregado</div>
          )}
        </div>

        <div className="space-y-1">
          <div className="font-semibold">Roles:</div>
          {loading ? (
            <Badge variant="outline">Carregando...</Badge>
          ) : roles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {roles.map(role => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-3 w-3" />
              <span>Nenhuma role carregada</span>
            </div>
          )}
          <div>Role Principal: <Badge variant="outline">{primaryRole}</Badge></div>
        </div>

        <Button 
          onClick={handleVerifyRoles} 
          disabled={verifying}
          size="sm"
          className="w-full"
        >
          {verifying ? (
            <>
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-2" />
              Verificar Roles
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
