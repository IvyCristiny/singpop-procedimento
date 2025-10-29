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
          version: string | null
        }
        Insert: {
          catalog_data?: Json
          id?: string
          last_modified_at?: string
          version?: string | null
        }
        Update: {
          catalog_data?: Json
          id?: string
          last_modified_at?: string
          version?: string | null
        }
        Relationships: []
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
          versao: string
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
          versao?: string
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
          versao?: string
        }
        Relationships: []
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
          versao: string
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
          versao: string
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
          versao?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
