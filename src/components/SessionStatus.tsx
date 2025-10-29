import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

export const SessionStatus = () => {
  const { session } = useAuth();
  
  if (!session) return null;
  
  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
  const now = new Date();
  const minutesUntilExpiry = expiresAt 
    ? Math.floor((expiresAt.getTime() - now.getTime()) / 60000)
    : null;
  
  const isExpiringSoon = minutesUntilExpiry !== null && minutesUntilExpiry < 10;
  
  return (
    <Badge variant={isExpiringSoon ? "destructive" : "success"} className="gap-1">
      {isExpiringSoon ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
      {isExpiringSoon ? `Sessão expira em ${minutesUntilExpiry}min` : 'Conectado'}
    </Badge>
  );
};
