import { User } from "@supabase/supabase-js";

export type AppRole = "supervisor" | "gerente_zona" | "gerente_geral";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  zona: string | null;
  created_at: string;
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
