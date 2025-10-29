import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  full_name: z.string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome muito longo"),
  report_name: z.string()
    .trim()
    .min(2, "Nome para relatórios deve ter no mínimo 2 caracteres")
    .max(50, "Nome muito longo")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export const ProfileForm = () => {
  const { profile, updateProfile, refetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name || "",
      report_name: profile?.report_name || "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name,
        report_name: profile.report_name || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: data.full_name,
        report_name: data.report_name || null,
      });

      if (error) throw error;

      await refetchProfile();

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize seus dados de identificação</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              {...register("full_name")}
              placeholder="Seu nome completo"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="report_name">Nome para Relatórios</Label>
            <Input
              id="report_name"
              {...register("report_name")}
              placeholder="Ex: J. Silva"
            />
            <p className="text-xs text-muted-foreground">
              Este nome aparecerá nos POPs e relatórios exportados. Deixe em branco para usar o nome completo.
            </p>
            {errors.report_name && (
              <p className="text-sm text-destructive">{errors.report_name.message}</p>
            )}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              O nome para relatórios é opcional e serve para exibir uma versão mais curta do seu nome nos documentos gerados.
            </AlertDescription>
          </Alert>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
