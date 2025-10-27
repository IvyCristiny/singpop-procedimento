import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CatalogHistoryRow {
  id: string;
  catalog_id: string;
  user_id: string | null;
  user_name: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  changes: any;
  created_at: string;
}

export interface CatalogHistoryEntry {
  id: string;
  catalog_id: string;
  user_id: string | null;
  user_name: string;
  action_type: "create" | "update" | "delete";
  entity_type: "function" | "activity";
  entity_id: string;
  entity_name: string;
  changes: any;
  created_at: string;
}

interface Filters {
  userId?: string;
  actionType?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

export const useCatalogHistory = () => {
  const [history, setHistory] = useState<CatalogHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("catalog_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.userId) {
        query = query.eq("user_id", filters.userId);
      }
      if (filters.actionType) {
        query = query.eq("action_type", filters.actionType);
      }
      if (filters.entityType) {
        query = query.eq("entity_type", filters.entityType);
      }
      if (filters.startDate) {
        query = query.gte("created_at", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("created_at", filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Cast the data to our expected type
      const typedData: CatalogHistoryEntry[] = (data || []).map((row: CatalogHistoryRow) => ({
        ...row,
        action_type: row.action_type as "create" | "update" | "delete",
        entity_type: row.entity_type as "function" | "activity",
      }));

      setHistory(typedData);
    } catch (error) {
      console.error("Error fetching catalog history:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Filters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    history,
    loading,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchHistory,
  };
};
