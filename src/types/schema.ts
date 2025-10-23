// Schema completo para o sistema de POPs
// Versão 1.2 - Arquitetura hierárquica

export interface UIConfig {
  mobile_first: boolean;
  preview_editable: boolean;
  default_pdf_template: string;
  mobile_form_order: string[];
  permissions: {
    can_add_functions: string[];
    can_add_activities: string[];
    can_edit_catalog: string[];
    can_edit_preview: string[];
  };
}

export interface ProcedureStep {
  id: string;
  title: string;
  instruction: string;
  why: string;
  who: string;
  time_estimate_min: number;
  safety: string;
  quality_check: string;
  evidence: string;
}

export interface Equipment {
  epc: string[];  // Equipamento Proteção Coletiva
  epi: string[];  // Equipamento Proteção Individual
  tools: string[];
  consumables: string[];
}

export interface Training {
  modules: string[];
  refresh_cadence_days: number;
}

export interface Review {
  kpis: string[];
  audit_frequency_days: number;
  auditor_role: string;
}

export interface Versioning {
  current_version: string;
  last_review_date: string;
  changelog: string[];
}

export interface Activity {
  id: string;
  name: string;
  objective: string;
  scope?: string;
  prerequisites?: string[];
  responsibilities: string[];
  procedure: {
    steps: ProcedureStep[];
  };
  equipment: Equipment;
  training: Training;
  review: Review;
  versioning: Versioning;
  attachments?: {
    templates: string[];
    photos: string[];
  };
}

export interface Function {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  activities: Activity[];
}

export interface Catalog {
  functions: Function[];
}

export interface CustomCatalog {
  functions: Function[];
}

export interface POPSchema {
  schema_version: string;
  ui: UIConfig;
  catalog: Catalog;
  custom: CustomCatalog;
}
