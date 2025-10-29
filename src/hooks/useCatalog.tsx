import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Catalog, Function, Activity } from "@/types/schema";
import { catalog as defaultCatalog } from "@/data/catalog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CATALOG_ID = "00000000-0000-0000-0000-000000000001"; // Fixed ID for the single catalog

export const useCatalog = () => {
  const [catalog, setCatalog] = useState<Catalog>(defaultCatalog);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const { data, error } = await supabase
        .from("catalog")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data && data.catalog_data) {
        const catalogData = data.catalog_data as any;
        // Validate that the catalog has the expected structure
        if (catalogData && Array.isArray(catalogData.functions)) {
          // Normalize and validate the catalog data
          const normalizedCatalog = normalizeCatalog(catalogData);
          setCatalog(normalizedCatalog);
        } else {
          console.error("Invalid catalog structure:", catalogData);
          // Reinitialize with default catalog if structure is invalid
          await initializeCatalog();
        }
      } else {
        // Initialize with default catalog if empty
        await initializeCatalog();
      }
    } catch (error) {
      console.error("Error fetching catalog:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o catálogo",
        variant: "destructive",
      });
      // Fallback to default catalog on error
      setCatalog(defaultCatalog);
    } finally {
      setLoading(false);
    }
  };

  // Normalize catalog data to ensure compatibility with TypeScript schema
  const normalizeCatalog = (catalogData: any): Catalog => {
    return {
      functions: catalogData.functions.map((fn: any) => ({
        ...fn,
        activities: (fn.activities || []).map((activity: any) => ({
          ...activity,
          // Ensure responsibilities is always an array
          responsibilities: Array.isArray(activity.responsibilities) 
            ? activity.responsibilities 
            : typeof activity.responsibilities === 'string' 
            ? [activity.responsibilities] 
            : [],
          // Ensure prerequisites is always an array
          prerequisites: Array.isArray(activity.prerequisites) 
            ? activity.prerequisites 
            : [],
          // Ensure scope is a string
          scope: activity.scope || '',
          // Ensure procedure has proper structure
          procedure: {
            steps: (activity.procedure?.steps || []).map((step: any) => ({
              id: step.id || `S${Date.now()}`,
              title: step.title || step.instruction || 'Sem título',
              instruction: step.instruction || '',
              why: step.why || '',
              who: step.who || '',
              time_estimate_min: typeof step.time_estimate_min === 'number' 
                ? step.time_estimate_min 
                : parseFloat(step.time || step.tempo || '0') || 0,
              safety: step.safety || step.seguranca || '',
              quality_check: step.quality_check || step.controle_qualidade || '',
              evidence: step.evidence || step.evidencia || ''
            }))
          },
          // Ensure equipment has proper structure
          equipment: {
            epc: Array.isArray(activity.equipment?.epc) ? activity.equipment.epc : [],
            epi: Array.isArray(activity.equipment?.epi) ? activity.equipment.epi : [],
            tools: Array.isArray(activity.equipment?.tools) ? activity.equipment.tools : [],
            consumables: Array.isArray(activity.equipment?.consumables) ? activity.equipment.consumables : []
          },
          // Ensure training has proper structure
          training: {
            modules: Array.isArray(activity.training?.modules) ? activity.training.modules : [],
            refresh_cadence_days: typeof activity.training?.refresh_cadence_days === 'number'
              ? activity.training.refresh_cadence_days
              : typeof activity.training?.cadencia === 'number'
              ? activity.training.cadencia
              : 365
          },
          // Ensure review has proper structure
          review: {
            kpis: Array.isArray(activity.review?.kpis) ? activity.review.kpis : [],
            audit_frequency_days: typeof activity.review?.audit_frequency_days === 'number'
              ? activity.review.audit_frequency_days
              : typeof activity.review?.frequencia === 'number'
              ? activity.review.frequencia
              : 30,
            auditor_role: activity.review?.auditor_role || activity.review?.auditor || 'Supervisor'
          },
          // Ensure versioning has proper structure
          versioning: {
            current_version: activity.versioning?.current_version || '1.0',
            last_review_date: activity.versioning?.last_review_date || new Date().toISOString().split('T')[0],
            changelog: Array.isArray(activity.versioning?.changelog) ? activity.versioning.changelog : []
          }
        }))
      }))
    };
  };

  const initializeCatalog = async () => {
    try {
      const { error } = await supabase.from("catalog").insert({
        catalog_data: defaultCatalog as any,
        version: "1.0",
      });

      if (error) throw error;
      setCatalog(defaultCatalog);
    } catch (error) {
      console.error("Error initializing catalog:", error);
    }
  };

  const saveCatalog = async (
    newCatalog: Catalog,
    actionType: "create" | "update" | "delete",
    entityType: "function" | "activity",
    entityId: string,
    entityName: string,
    changes?: any
  ) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para modificar o catálogo",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Get user profile for full name and report name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, report_name")
        .eq("id", user.id)
        .single();

      // Update catalog
      const { error: catalogError } = await supabase
        .from("catalog")
        .update({
          catalog_data: newCatalog as any,
          last_modified_by: user.id,
          last_modified_at: new Date().toISOString(),
        })
        .limit(1);

      if (catalogError) throw catalogError;

      // Insert history record
      const { error: historyError } = await supabase
        .from("catalog_history")
        .insert({
          catalog_id: CATALOG_ID,
          user_id: user.id,
          user_name: profile?.report_name || profile?.full_name || user.email || "Usuário",
          action_type: actionType,
          entity_type: entityType,
          entity_id: entityId,
          entity_name: entityName,
          changes: changes,
        });

      if (historyError) throw historyError;

      setCatalog(newCatalog);
      return true;
    } catch (error) {
      console.error("Error saving catalog:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateFunction = async (functionId: string, updatedFunction: Function, oldFunction?: Function) => {
    if (!catalog) return false;
    const newCatalog = {
      ...catalog,
      functions: catalog.functions.map((f) =>
        f.id === functionId ? updatedFunction : f
      ),
    };

    const changes = oldFunction ? {
      before: { name: oldFunction.name, description: oldFunction.description, tags: oldFunction.tags },
      after: { name: updatedFunction.name, description: updatedFunction.description, tags: updatedFunction.tags },
      fields_changed: ["name", "description", "tags"],
    } : null;

    return saveCatalog(newCatalog, "update", "function", functionId, updatedFunction.name, changes);
  };

  const addFunction = async (newFunction: Function) => {
    if (!catalog) return false;
    const newCatalog = {
      ...catalog,
      functions: [...catalog.functions, newFunction],
    };

    return saveCatalog(newCatalog, "create", "function", newFunction.id, newFunction.name);
  };

  const deleteFunction = async (functionId: string) => {
    if (!catalog) return false;
    const functionToDelete = catalog.functions.find((f) => f.id === functionId);
    if (!functionToDelete) return false;

    const newCatalog = {
      ...catalog,
      functions: catalog.functions.filter((f) => f.id !== functionId),
    };

    return saveCatalog(newCatalog, "delete", "function", functionId, functionToDelete.name);
  };

  const updateActivity = async (
    functionId: string,
    activityId: string,
    updatedActivity: Activity,
    oldActivity?: Activity
  ) => {
    if (!catalog) return false;
    const newCatalog = {
      ...catalog,
      functions: catalog.functions.map((f) =>
        f.id === functionId
          ? {
              ...f,
              activities: f.activities.map((a) =>
                a.id === activityId ? updatedActivity : a
              ),
            }
          : f
      ),
    };

    const changes = oldActivity ? {
      before: { name: oldActivity.name, objective: oldActivity.objective },
      after: { name: updatedActivity.name, objective: updatedActivity.objective },
      fields_changed: ["name", "objective"],
    } : null;

    return saveCatalog(newCatalog, "update", "activity", activityId, updatedActivity.name, changes);
  };

  const addActivity = async (functionId: string, newActivity: Activity) => {
    if (!catalog) return false;
    const newCatalog = {
      ...catalog,
      functions: catalog.functions.map((f) =>
        f.id === functionId
          ? { ...f, activities: [...f.activities, newActivity] }
          : f
      ),
    };

    return saveCatalog(newCatalog, "create", "activity", newActivity.id, newActivity.name);
  };

  const deleteActivity = async (functionId: string, activityId: string) => {
    if (!catalog) return false;
    const functionObj = catalog.functions.find((f) => f.id === functionId);
    const activityToDelete = functionObj?.activities.find((a) => a.id === activityId);
    if (!activityToDelete) return false;

    const newCatalog = {
      ...catalog,
      functions: catalog.functions.map((f) =>
        f.id === functionId
          ? {
              ...f,
              activities: f.activities.filter((a) => a.id !== activityId),
            }
          : f
      ),
    };

    return saveCatalog(newCatalog, "delete", "activity", activityId, activityToDelete.name);
  };

  const resetToDefault = async () => {
    return saveCatalog(defaultCatalog, "update", "function", "all", "Catálogo completo", {
      before: "Catálogo personalizado",
      after: "Catálogo padrão",
      fields_changed: ["all"],
    });
  };

  return {
    catalog,
    loading,
    updateFunction,
    addFunction,
    deleteFunction,
    updateActivity,
    addActivity,
    deleteActivity,
    resetToDefault,
    refetch: fetchCatalog,
  };
};
