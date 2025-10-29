import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, AlertCircle, Loader2 } from "lucide-react";

export const SessionIndicator = () => {
  const { user, session, loading: authLoading } = useAuth();
  const { primaryRole, roles, loading: roleLoading } = useRole();
  
  if (authLoading || roleLoading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Carregando...
      </Badge>
    );
  }
  
  if (!user || !session) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Desconectado
      </Badge>
    );
  }
  
  const roleLabel = 
    primaryRole === 'gerente_geral' ? 'Gerente Geral' : 
    primaryRole === 'gerente_zona' ? 'Gerente de Zona' : 
    'Supervisor';
  
  return (
    <div className="flex gap-2 items-center">
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Conectado
      </Badge>
      
      {roles.length > 0 ? (
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          {roleLabel}
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Sem Permissões
        </Badge>
      )}
    </div>
  );
};
