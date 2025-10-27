import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  newEmail: z.string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  confirmEmail: z.string(),
}).refine((data) => data.newEmail === data.confirmEmail, {
  message: "Os e-mails não coincidem",
  path: ["confirmEmail"],
});

type FormData = z.infer<typeof schema>;

export const EmailChangeForm = () => {
  const { profile, updateEmail, refetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await updateEmail(data.newEmail);

      if (error) throw error;

      await refetchProfile();

      toast({
        title: "Sucesso",
        description: "E-mail atualizado! Verifique sua caixa de entrada para confirmar.",
      });

      reset();
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar e-mail",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar E-mail</CardTitle>
        <CardDescription>Atualize seu endereço de e-mail</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>E-mail Atual</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {profile?.email || "Não disponível"}
              </Badge>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você receberá um e-mail de confirmação no novo endereço. Clique no link para confirmar a alteração.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Novo E-mail</Label>
              <Input
                id="newEmail"
                type="email"
                {...register("newEmail")}
                placeholder="seu.email@exemplo.com"
              />
              {errors.newEmail && (
                <p className="text-sm text-destructive">{errors.newEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmEmail">Confirmar Novo E-mail</Label>
              <Input
                id="confirmEmail"
                type="email"
                {...register("confirmEmail")}
                placeholder="Digite o e-mail novamente"
              />
              {errors.confirmEmail && (
                <p className="text-sm text-destructive">{errors.confirmEmail.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Alterar E-mail"
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
