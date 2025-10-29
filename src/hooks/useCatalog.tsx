import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Catalog, Function, Activity } from "@/types/schema";
import { catalog as defaultCatalog } from "@/data/catalog";
import { useToast } from "@/hooks/use-toast";

export const useCatalog = () => {
  const [catalog, setCatalog] = useState<Catalog>(defaultCatalog);
  const [loading, setLoading] = useState(true);
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
        if (catalogData && Array.isArray(catalogData.functions)) {
          const normalizedCatalog = normalizeCatalog(catalogData);
          setCatalog(normalizedCatalog);
        } else {
          console.error("Invalid catalog structure:", catalogData);
          await initializeCatalog();
        }
      } else {
        await initializeCatalog();
      }
    } catch (error) {
      console.error("Error fetching catalog:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o catálogo",
        variant: "destructive",
      });
      setCatalog(defaultCatalog);
    } finally {
      setLoading(false);
    }
  };

  const normalizeCatalog = (catalogData: any): Catalog => {
    return {
      functions: catalogData.functions.map((fn: any) => ({
        ...fn,
        activities: (fn.activities || []).map((activity: any) => ({
          ...activity,
          responsibilities: Array.isArray(activity.responsibilities) 
            ? activity.responsibilities 
            : typeof activity.responsibilities === 'string' 
            ? [activity.responsibilities] 
            : [],
          prerequisites: Array.isArray(activity.prerequisites) 
            ? activity.prerequisites 
            : [],
          scope: activity.scope || '',
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
          equipment: {
            epc: Array.isArray(activity.equipment?.epc) ? activity.equipment.epc : [],
            epi: Array.isArray(activity.equipment?.epi) ? activity.equipment.epi : [],
            tools: Array.isArray(activity.equipment?.tools) ? activity.equipment.tools : [],
            consumables: Array.isArray(activity.equipment?.consumables) ? activity.equipment.consumables : []
          },
          training: {
            modules: Array.isArray(activity.training?.modules) ? activity.training.modules : [],
            refresh_cadence_days: typeof activity.training?.refresh_cadence_days === 'number'
              ? activity.training.refresh_cadence_days
              : typeof activity.training?.cadencia === 'number'
              ? activity.training.cadencia
              : 365
          },
          review: {
            kpis: Array.isArray(activity.review?.kpis) ? activity.review.kpis : [],
            audit_frequency_days: typeof activity.review?.audit_frequency_days === 'number'
              ? activity.review.audit_frequency_days
              : typeof activity.review?.frequencia === 'number'
              ? activity.review.frequencia
              : 30,
            auditor_role: activity.review?.auditor_role || activity.review?.auditor || 'Supervisor'
          },
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

  const saveCatalog = async (newCatalog: Catalog) => {
    try {
      const { error } = await supabase
        .from("catalog")
        .update({
          catalog_data: newCatalog as any,
          last_modified_at: new Date().toISOString(),
        })
        .limit(1);

      if (error) throw error;

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

    return saveCatalog(newCatalog);
  };

  const addFunction = async (newFunction: Function) => {
    if (!catalog) return false;
    const newCatalog = {
      ...catalog,
      functions: [...catalog.functions, newFunction],
    };

    return saveCatalog(newCatalog);
  };

  const deleteFunction = async (functionId: string) => {
    if (!catalog) return false;
    const newCatalog = {
      ...catalog,
      functions: catalog.functions.filter((f) => f.id !== functionId),
    };

    return saveCatalog(newCatalog);
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

    return saveCatalog(newCatalog);
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

    return saveCatalog(newCatalog);
  };

  const deleteActivity = async (functionId: string, activityId: string) => {
    if (!catalog) return false;
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

    return saveCatalog(newCatalog);
  };

  const resetToDefault = async () => {
    return saveCatalog(defaultCatalog);
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
