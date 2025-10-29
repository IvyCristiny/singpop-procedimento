import { User } from "@supabase/supabase-js";

export type AppRole = "supervisor" | "gerente_zona" | "gerente_geral";

export interface ZonaOperativa {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  zona_id?: string | null;
  created_at: string;
}

export interface ProfileWithZona extends Profile {
  zona?: ZonaOperativa;
}

export interface UserWithDetails {
  id: string;
  profile: ProfileWithZona;
  roles: AppRole[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface AuthUser extends User {
  profile?: Profile;
  roles?: AppRole[];
}
