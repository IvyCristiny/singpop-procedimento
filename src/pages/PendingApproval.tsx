import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoSingular from "@/assets/logo_singular_colorida.png";

export default function PendingApproval() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8 text-center">
        <img 
          src={logoSingular} 
          alt="Singular Serviços" 
          className="h-16 w-auto mx-auto mb-6"
        />
        
        <div className="bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <AlertCircle className="w-16 h-16 mx-auto text-yellow-600 dark:text-yellow-400 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Aguardando Aprovação
          </h1>
          <p className="text-muted-foreground mb-4">
            Olá, <strong>{profile?.full_name}</strong>!
          </p>
          <p className="text-muted-foreground mb-2">
            Sua conta foi criada com sucesso, mas ainda está pendente de aprovação pelo Gerente Administrativo.
          </p>
          <p className="text-sm text-muted-foreground">
            Você receberá acesso ao sistema assim que seu cargo e zona operativa forem atribuídos.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>📧 Email: <strong>{profile?.email}</strong></p>
          <p>⏳ Status: <strong className="text-yellow-600 dark:text-yellow-400">Pendente</strong></p>
        </div>

        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full mt-6 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
