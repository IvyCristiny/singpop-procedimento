import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { AppRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
  allowPending?: boolean;
}

export const ProtectedRoute = ({ children, requiredRole, allowPending = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { roles, hasRole, loading: roleLoading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Não logado -> vai para /auth
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    // Logado COM role mas sem permissão -> vai para home
    if (!loading && !roleLoading && user && requiredRole && !hasRole(requiredRole)) {
      navigate("/");
      return;
    }
  }, [user, loading, roleLoading, requiredRole, hasRole, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
