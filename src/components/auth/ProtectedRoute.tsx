import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { AppRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { hasRole, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [timeoutReached, setTimeoutReached] = useState(false);

  console.log('🛡️ [ProtectedRoute] Estado:', { 
    user: !!user, 
    loading, 
    roleLoading,
    timeoutReached 
  });

  useEffect(() => {
    if (!loading && !user) {
      console.log('🔒 [ProtectedRoute] Sem usuário, redirecionando para /auth');
      navigate("/auth");
    }
    if (!loading && !roleLoading && user && requiredRole && !hasRole(requiredRole)) {
      console.log('⛔ [ProtectedRoute] Sem permissão, redirecionando para /');
      navigate("/");
    }
  }, [user, loading, roleLoading, requiredRole, hasRole, navigate]);

  // Timeout de segurança de 10 segundos
  useEffect(() => {
    if (loading || roleLoading) {
      console.log('⏱️ [ProtectedRoute] Iniciando timeout de 10s');
      const timeoutId = setTimeout(() => {
        console.error('🚨 [ProtectedRoute] TIMEOUT DE 10s ATINGIDO!');
        setTimeoutReached(true);
      }, 10000);

      return () => {
        console.log('🔄 [ProtectedRoute] Limpando timeout');
        clearTimeout(timeoutId);
      };
    }
  }, [loading, roleLoading]);

  if (timeoutReached) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Tempo de carregamento excedido</h2>
          <p className="text-muted-foreground mb-4">
            A aplicação demorou muito para carregar. Tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
        </div>
      </div>
    );
  }

  if (loading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="text-lg font-semibold">Carregando...</div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {loading && <div>🔐 Carregando autenticação...</div>}
          {roleLoading && <div>🎭 Carregando permissões...</div>}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
