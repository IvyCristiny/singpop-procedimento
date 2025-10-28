export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      catalog: {
        Row: {
          catalog_data: Json
          id: string
          last_modified_at: string
          last_modified_by: string | null
          version: string | null
        }
        Insert: {
          catalog_data?: Json
          id?: string
          last_modified_at?: string
          last_modified_by?: string | null
          version?: string | null
        }
        Update: {
          catalog_data?: Json
          id?: string
          last_modified_at?: string
          last_modified_by?: string | null
          version?: string | null
        }
        Relationships: []
      }
      catalog_history: {
        Row: {
          action_type: string
          catalog_id: string | null
          changes: Json | null
          created_at: string | null
          entity_id: string
          entity_name: string
          entity_type: string
          id: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          action_type: string
          catalog_id?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id: string
          entity_name: string
          entity_type: string
          id?: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          action_type?: string
          catalog_id?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string
          entity_name?: string
          entity_type?: string
          id?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_history_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      cronogramas: {
        Row: {
          codigo: string
          condominio_nome: string
          created_at: string
          data_revisao: string | null
          id: string
          observacoes: string | null
          periodicidade: string
          pop_ids: Json
          responsavel: string
          responsavel_revisao: string | null
          rotina_diaria: Json
          rotina_semanal: Json
          supervisao: string | null
          titulo: string
          turno: string
          updated_at: string
          user_id: string
          versao: string
          zona_id: string | null
        }
        Insert: {
          codigo: string
          condominio_nome: string
          created_at?: string
          data_revisao?: string | null
          id?: string
          observacoes?: string | null
          periodicidade: string
          pop_ids?: Json
          responsavel: string
          responsavel_revisao?: string | null
          rotina_diaria?: Json
          rotina_semanal?: Json
          supervisao?: string | null
          titulo: string
          turno: string
          updated_at?: string
          user_id: string
          versao?: string
          zona_id?: string | null
        }
        Update: {
          codigo?: string
          condominio_nome?: string
          created_at?: string
          data_revisao?: string | null
          id?: string
          observacoes?: string | null
          periodicidade?: string
          pop_ids?: Json
          responsavel?: string
          responsavel_revisao?: string | null
          rotina_diaria?: Json
          rotina_semanal?: Json
          supervisao?: string | null
          titulo?: string
          turno?: string
          updated_at?: string
          user_id?: string
          versao?: string
          zona_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cronogramas_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas_operativas"
            referencedColumns: ["id"]
          },
        ]
      }
      pops: {
        Row: {
          activity_id: string
          activity_ids: Json | null
          attached_images: Json | null
          codigo_pop: string
          condominio_nome: string
          created_at: string
          custom_steps: Json | null
          data_apresentacao: string | null
          data_revisao: string | null
          function_id: string
          id: string
          nome_colaborador: string | null
          observacoes: string | null
          responsavel_elaboracao: string | null
          updated_at: string
          user_id: string
          versao: string
          zona_id: string | null
        }
        Insert: {
          activity_id: string
          activity_ids?: Json | null
          attached_images?: Json | null
          codigo_pop: string
          condominio_nome: string
          created_at?: string
          custom_steps?: Json | null
          data_apresentacao?: string | null
          data_revisao?: string | null
          function_id: string
          id?: string
          nome_colaborador?: string | null
          observacoes?: string | null
          responsavel_elaboracao?: string | null
          updated_at?: string
          user_id: string
          versao: string
          zona_id?: string | null
        }
        Update: {
          activity_id?: string
          activity_ids?: Json | null
          attached_images?: Json | null
          codigo_pop?: string
          condominio_nome?: string
          created_at?: string
          custom_steps?: Json | null
          data_apresentacao?: string | null
          data_revisao?: string | null
          function_id?: string
          id?: string
          nome_colaborador?: string | null
          observacoes?: string | null
          responsavel_elaboracao?: string | null
          updated_at?: string
          user_id?: string
          versao?: string
          zona_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pops_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas_operativas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          report_name: string | null
          zona_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          report_name?: string | null
          zona_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          report_name?: string | null
          zona_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas_operativas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles_audit: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_role: Database["public"]["Enums"]["app_role"] | null
          old_role: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          old_role?: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          old_role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      zonas_operativas: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_safe: { Args: { p_user_id: string }; Returns: undefined }
      get_current_user_id: { Args: never; Returns: string }
      get_user_zona_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_user_role_safe: {
        Args: {
          p_new_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "supervisor" | "gerente_zona" | "gerente_geral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["supervisor", "gerente_zona", "gerente_geral"],
    },
  },
} as const
