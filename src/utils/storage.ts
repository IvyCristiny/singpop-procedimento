import { POP } from "@/types/pop";

const STORAGE_KEY = "singpop_pops";

export const savePOP = (pop: POP): void => {
  const pops = getAllPOPs();
  pops.push(pop);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pops));
};

export const getAllPOPs = (): POP[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const deletePOP = (id: string): void => {
  const pops = getAllPOPs();
  const filtered = pops.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const generatePOPCode = (tipoPOP: string): string => {
  const prefix = tipoPOP.substring(0, 4).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `POP-${prefix}-${timestamp}`;
};
