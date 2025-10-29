import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cronograma, RotinaHorario, RotinaSemanal } from "@/types/cronograma";
import { toast } from "sonner";
import { z } from "zod";

const rotinaHorarioSchema = z.object({
  horario_inicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (HH:MM)"),
  horario_fim: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (HH:MM)"),
  ambiente_atividade: z.string().min(1, "Campo obrigatório"),
  detalhamento: z.string().min(1, "Campo obrigatório"),
  responsavel: z.string().min(1, "Campo obrigatório"),
});

const rotinaSemanalSchema = z.object({
  dia_semana: z.enum(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']),
  atividade: z.string().min(1, "Campo obrigatório"),
  observacoes: z.string().optional(),
});

const cronogramaSchema = z.object({
  titulo: z.string().min(5, "Mínimo 5 caracteres").max(200, "Máximo 200 caracteres"),
  condominio_nome: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  turno: z.string().min(5, "Campo obrigatório"),
  periodicidade: z.string().min(5, "Campo obrigatório"),
  responsavel: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  pop_ids: z.array(z.string()).min(1, 'Selecione ao menos um POP'),
  rotina_diaria: z.array(rotinaHorarioSchema).min(1, 'Adicione ao menos uma atividade diária'),
  rotina_semanal: z.array(rotinaSemanalSchema),
});

export const useCronogramas = () => {
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCronogramas();
  }, []);

  const fetchCronogramas = async () => {
    try {
      setLoading(true);
      // Buscar TODOS os cronogramas sem filtro
      const { data, error } = await supabase
        .from("cronogramas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const transformedCronogramas: Cronograma[] = (data || []).map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        condominio_nome: item.condominio_nome,
        codigo: item.codigo,
        versao: item.versao,
        turno: item.turno,
        periodicidade: item.periodicidade,
        responsavel: item.responsavel,
        supervisao: item.supervisao,
        pop_ids: item.pop_ids as string[],
        rotina_diaria: item.rotina_diaria as RotinaHorario[],
        rotina_semanal: item.rotina_semanal as RotinaSemanal[],
        responsavel_revisao: item.responsavel_revisao,
        data_revisao: item.data_revisao,
        observacoes: item.observacoes,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setCronogramas(transformedCronogramas);
    } catch (error: any) {
      console.error("Error fetching cronogramas:", error);
      toast.error("Erro ao carregar cronogramas");
    } finally {
      setLoading(false);
    }
  };

  const generateCodigo = (condominio: string) => {
    const prefix = "CRON";
    const condShort = condominio.substring(0, 4).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${condShort}-${timestamp}`;
  };

  const saveCronograma = async (data: Partial<Cronograma>) => {
    try {
      cronogramaSchema.parse(data);

      const codigo = generateCodigo(data.condominio_nome!);
      
      const cronogramaData: any = {
        titulo: data.titulo,
        condominio_nome: data.condominio_nome,
        codigo,
        versao: data.versao || "1",
        turno: data.turno,
        periodicidade: data.periodicidade,
        responsavel: data.responsavel,
        supervisao: data.supervisao || null,
        pop_ids: data.pop_ids || [],
        rotina_diaria: data.rotina_diaria || [],
        rotina_semanal: data.rotina_semanal || [],
        responsavel_revisao: data.responsavel_revisao || null,
        data_revisao: data.data_revisao || null,
        observacoes: data.observacoes || null,
      };

      const { data: savedCronograma, error } = await supabase
        .from("cronogramas")
        .insert([cronogramaData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Cronograma criado com sucesso!");
      await fetchCronogramas();
      return savedCronograma;
    } catch (error: any) {
      console.error("Error saving cronograma:", error);
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(`Validação: ${firstError.message}`);
      } else {
        toast.error("Erro ao salvar cronograma");
      }
      throw error;
    }
  };

  const updateCronograma = async (id: string, data: Partial<Cronograma>) => {
    try {
      const updateData: any = {};
      
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.condominio_nome !== undefined) updateData.condominio_nome = data.condominio_nome;
      if (data.turno !== undefined) updateData.turno = data.turno;
      if (data.periodicidade !== undefined) updateData.periodicidade = data.periodicidade;
      if (data.responsavel !== undefined) updateData.responsavel = data.responsavel;
      if (data.supervisao !== undefined) updateData.supervisao = data.supervisao;
      if (data.pop_ids !== undefined) updateData.pop_ids = data.pop_ids;
      if (data.rotina_diaria !== undefined) updateData.rotina_diaria = data.rotina_diaria;
      if (data.rotina_semanal !== undefined) updateData.rotina_semanal = data.rotina_semanal;
      if (data.responsavel_revisao !== undefined) updateData.responsavel_revisao = data.responsavel_revisao;
      if (data.data_revisao !== undefined) updateData.data_revisao = data.data_revisao;
      if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;
      if (data.versao !== undefined) updateData.versao = data.versao;
      
      const { error } = await supabase
        .from("cronogramas")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Cronograma atualizado!");
      await fetchCronogramas();
    } catch (error: any) {
      console.error("Error updating cronograma:", error);
      toast.error("Erro ao atualizar cronograma");
      throw error;
    }
  };

  const deleteCronograma = async (id: string) => {
    try {
      const { error } = await supabase
        .from("cronogramas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Cronograma deletado!");
      await fetchCronogramas();
    } catch (error: any) {
      console.error("Error deleting cronograma:", error);
      toast.error("Erro ao deletar cronograma");
      throw error;
    }
  };

  return {
    cronogramas,
    loading,
    saveCronograma,
    updateCronograma,
    deleteCronograma,
    refetch: fetchCronogramas,
  };
};
