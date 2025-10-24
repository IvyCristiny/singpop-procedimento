import { Catalog, Function, Activity } from "@/types/schema";
import { catalog as defaultCatalog } from "@/data/catalog";

const CATALOG_STORAGE_KEY = "singpop_custom_catalog";

export const getCustomCatalog = (): Catalog => {
  const stored = localStorage.getItem(CATALOG_STORAGE_KEY);
  if (!stored) {
    return defaultCatalog;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultCatalog;
  }
};

export const saveCustomCatalog = (catalog: Catalog): void => {
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
};

export const resetToDefaultCatalog = (): void => {
  localStorage.removeItem(CATALOG_STORAGE_KEY);
};

export const updateFunction = (functionId: string, updatedFunction: Function): void => {
  const catalog = getCustomCatalog();
  const functionIndex = catalog.functions.findIndex(f => f.id === functionId);
  if (functionIndex !== -1) {
    catalog.functions[functionIndex] = updatedFunction;
    saveCustomCatalog(catalog);
  }
};

export const addFunction = (newFunction: Function): void => {
  const catalog = getCustomCatalog();
  catalog.functions.push(newFunction);
  saveCustomCatalog(catalog);
};

export const deleteFunction = (functionId: string): void => {
  const catalog = getCustomCatalog();
  catalog.functions = catalog.functions.filter(f => f.id !== functionId);
  saveCustomCatalog(catalog);
};

export const updateActivity = (functionId: string, activityId: string, updatedActivity: Activity): void => {
  const catalog = getCustomCatalog();
  const functionIndex = catalog.functions.findIndex(f => f.id === functionId);
  if (functionIndex !== -1) {
    const activityIndex = catalog.functions[functionIndex].activities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      catalog.functions[functionIndex].activities[activityIndex] = updatedActivity;
      saveCustomCatalog(catalog);
    }
  }
};

export const addActivity = (functionId: string, newActivity: Activity): void => {
  const catalog = getCustomCatalog();
  const functionIndex = catalog.functions.findIndex(f => f.id === functionId);
  if (functionIndex !== -1) {
    catalog.functions[functionIndex].activities.push(newActivity);
    saveCustomCatalog(catalog);
  }
};

export const deleteActivity = (functionId: string, activityId: string): void => {
  const catalog = getCustomCatalog();
  const functionIndex = catalog.functions.findIndex(f => f.id === functionId);
  if (functionIndex !== -1) {
    catalog.functions[functionIndex].activities = catalog.functions[functionIndex].activities.filter(a => a.id !== activityId);
    saveCustomCatalog(catalog);
  }
};
