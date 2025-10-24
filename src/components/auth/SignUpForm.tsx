import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useZonas } from "@/hooks/useZonas";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [zonaId, setZonaId] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { zonas, loading: zonasLoading } = useZonas();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zonaId || zonaId === "loading" || zonaId === "empty") {
      toast({
        title: "Zona obrigatória",
        description: "Por favor, selecione uma zona operativa válida",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName, zonaId);
      
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar sua conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Seu nome"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zona">Zona Operativa</Label>
        <Select value={zonaId} onValueChange={setZonaId} disabled={zonasLoading}>
          <SelectTrigger id="zona" className={zonasLoading ? "opacity-50" : ""}>
            <SelectValue 
              placeholder={zonasLoading ? "Carregando zonas..." : "Selecione sua zona"} 
            />
          </SelectTrigger>
          <SelectContent>
            {zonasLoading ? (
              <SelectItem value="loading" disabled>
                Carregando...
              </SelectItem>
            ) : zonas.length === 0 ? (
              <SelectItem value="empty" disabled>
                Nenhuma zona disponível
              </SelectItem>
            ) : (
              zonas.map((zona) => (
                <SelectItem key={zona.id} value={zona.id}>
                  {zona.nome}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
};
