import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "./useRole";
import { POP } from "@/types/pop";
import { useToast } from "./use-toast";

interface CreatePOPInput {
  condominio_nome: string;
  function_id: string;
  activity_id: string;
  activity_ids?: string[];
  codigo_pop: string;
  versao: string;
  data_revisao?: string;
  data_apresentacao?: string;
  responsavel_elaboracao?: string;
  nome_colaborador?: string;
  observacoes?: string;
  custom_steps?: any[];
  attached_images?: any[];
}

interface UpdatePOPInput extends Partial<CreatePOPInput> {
  id: string;
}

export const usePOPs = () => {
  const { profile } = useAuth();
  const { primaryRole, isGerenteGeral } = useRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch POPs based on user role
  const {
    data: pops = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pops", profile?.id, profile?.zona_id, primaryRole],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error("User not authenticated");
      }

      let query = supabase
        .from("pops")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters based on role
      if (isGerenteGeral) {
        // Gerente geral vê todos os POPs
      } else if (primaryRole === "gerente_zona" && profile.zona_id) {
        // Gerente zona vê POPs da sua zona
        query = query.eq("zona_id", profile.zona_id);
      } else {
        // Supervisor vê apenas seus próprios POPs
        query = query.eq("user_id", profile.id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Mapear dados do Supabase (snake_case) para POP (camelCase)
      const mappedData: POP[] = (data || []).map((item: any) => ({
        id: item.id,
        condominioNome: item.condominio_nome,
        functionId: item.function_id,
        activityId: item.activity_id,
        activityIds: item.activity_ids || undefined,
        codigoPOP: item.codigo_pop,
        versao: item.versao,
        dataRevisao: item.data_revisao || "",
        responsavelElaboracao: item.responsavel_elaboracao || "",
        nomeColaborador: item.nome_colaborador || "",
        dataApresentacao: item.data_apresentacao || "",
        observacoes: item.observacoes || undefined,
        customSteps: item.custom_steps || undefined,
        attachedImages: item.attached_images || undefined,
        createdAt: item.created_at,
      }));

      return mappedData;
    },
    enabled: !!profile?.id,
    staleTime: 60000, // Cache por 1 minuto
  });

  // Subscribe to realtime changes
  const channel = supabase
    .channel("pops-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pops" },
      () => {
        refetch();
      }
    )
    .subscribe();

  // Create POP
  const createPOP = useMutation({
    mutationFn: async (input: CreatePOPInput) => {
      // Validar sessão ANTES de criar POP
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      
      // Buscar user diretamente do auth.getUser()
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Auth error:", authError);
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }
      
      if (!profile?.id) {
        throw new Error("Perfil não carregado. Aguarde...");
      }
      
      console.log("Criando POP - User ID:", user.id, "Profile ID:", profile.id);

      const { data, error } = await supabase
        .from("pops")
        .insert({
          ...input,
          user_id: user.id, // Usar user.id do auth, não profile.id
          zona_id: profile.zona_id,
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar no histórico
      if (data?.id) {
        await supabase.from("pops_history").insert([{
          pop_id: data.id,
          user_id: user.id,
          user_name: profile.full_name,
          action_type: "create",
          changes: { created: input } as any,
        }]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pops"] });
      toast({
        title: "POP criado com sucesso!",
        description: "O POP foi salvo no banco de dados.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar POP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update POP
  const updatePOP = useMutation({
    mutationFn: async ({ id, ...input }: UpdatePOPInput) => {
      if (!profile?.id) {
        throw new Error("User not authenticated");
      }

      // Buscar POP antigo para comparação
      const { data: oldPOP } = await supabase
        .from("pops")
        .select("*")
        .eq("id", id)
        .single();

      const { data, error } = await supabase
        .from("pops")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Registrar no histórico
      if (id) {
        await supabase.from("pops_history").insert([{
          pop_id: id,
          user_id: profile.id,
          user_name: profile.full_name,
          action_type: "update",
          changes: { before: oldPOP, after: input } as any,
        }]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pops"] });
      toast({
        title: "POP atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar POP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete POP
  const deletePOP = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.id) {
        throw new Error("User not authenticated");
      }

      // Buscar POP antes de deletar
      const { data: pop } = await supabase
        .from("pops")
        .select("*")
        .eq("id", id)
        .single();

      // Registrar no histórico antes de deletar
      if (id && pop) {
        await supabase.from("pops_history").insert([{
          pop_id: id,
          user_id: profile.id,
          user_name: profile.full_name,
          action_type: "delete",
          changes: { deleted: pop } as any,
        }]);
      }

      const { error } = await supabase.from("pops").delete().eq("id", id);

      if (error) throw error;

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pops"] });
      toast({
        title: "POP excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir POP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    pops,
    isLoading,
    error,
    refetch,
    createPOP: createPOP.mutateAsync,
    updatePOP: updatePOP.mutateAsync,
    deletePOP: deletePOP.mutateAsync,
    isCreating: createPOP.isPending,
    isUpdating: updatePOP.isPending,
    isDeleting: deletePOP.isPending,
  };
};
