import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { AppRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { hasRole, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    console.log("🔐 [ProtectedRoute] Estado:", { 
      user: user?.email, 
      loading, 
      roleLoading, 
      requiredRole 
    });

    if (!loading && !user) {
      console.log("🔐 [ProtectedRoute] Redirecionando para /auth");
      navigate("/auth");
    }
    
    if (!loading && !roleLoading && user && requiredRole && !hasRole(requiredRole)) {
      console.log("🔐 [ProtectedRoute] Sem permissão, redirecionando para /");
      navigate("/");
    }
  }, [user, loading, roleLoading, requiredRole, hasRole, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading || roleLoading) {
        console.error("⏰ [ProtectedRoute] TIMEOUT: +10s carregando");
        setShowTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading, roleLoading]);

  if (showTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription className="space-y-4">
            <p className="font-semibold">Tempo de carregamento excedido</p>
            <p className="text-sm">
              A autenticação está demorando mais que o esperado. 
              Por favor, recarregue a página.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Recarregar página
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg font-medium">
          {loading && "🔐 Carregando autenticação..."}
          {!loading && roleLoading && "🎭 Carregando permissões..."}
        </div>
        <div className="text-sm text-muted-foreground">
          Aguarde...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
