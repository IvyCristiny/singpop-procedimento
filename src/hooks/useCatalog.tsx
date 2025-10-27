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
  const { user } = useAuth();
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
          setCatalog(catalogData as Catalog);
        } else {
          console.error("Invalid catalog structure:", catalogData);
          // Use default catalog if structure is invalid
          setCatalog(defaultCatalog);
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
      // Get user profile for full name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
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
          user_name: profile?.full_name || user.email || "Usuário",
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
