export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          abstract: string
          authors: string[] | null
          conclusions: string | null
          methods: string[] | null
          pmid: string
          results: Json | null
          summary: string | null
          timestamp: string | null
          title: string
        }
        Insert: {
          abstract: string
          authors?: string[] | null
          conclusions?: string | null
          methods?: string[] | null
          pmid: string
          results?: Json | null
          summary?: string | null
          timestamp?: string | null
          title: string
        }
        Update: {
          abstract?: string
          authors?: string[] | null
          conclusions?: string | null
          methods?: string[] | null
          pmid?: string
          results?: Json | null
          summary?: string | null
          timestamp?: string | null
          title?: string
        }
        Relationships: []
      }
      facets: {
        Row: {
          application: string[] | null
          article_pmid: string | null
          id: string
          protein_family: string[] | null
          protein_form: string[] | null
          structural_motifs: string[] | null
          tested_properties: string[] | null
        }
        Insert: {
          application?: string[] | null
          article_pmid?: string | null
          id?: string
          protein_family?: string[] | null
          protein_form?: string[] | null
          structural_motifs?: string[] | null
          tested_properties?: string[] | null
        }
        Update: {
          application?: string[] | null
          article_pmid?: string | null
          id?: string
          protein_family?: string[] | null
          protein_form?: string[] | null
          structural_motifs?: string[] | null
          tested_properties?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "facets_article_pmid_fkey"
            columns: ["article_pmid"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["pmid"]
          },
        ]
      }
      materials: {
        Row: {
          article_pmid: string | null
          composition: string | null
          description: string | null
          fabrication_method: string | null
          id: string
          key_properties: string[] | null
          name: string
          potential_applications: string[] | null
        }
        Insert: {
          article_pmid?: string | null
          composition?: string | null
          description?: string | null
          fabrication_method?: string | null
          id?: string
          key_properties?: string[] | null
          name: string
          potential_applications?: string[] | null
        }
        Update: {
          article_pmid?: string | null
          composition?: string | null
          description?: string | null
          fabrication_method?: string | null
          id?: string
          key_properties?: string[] | null
          name?: string
          potential_applications?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_article_pmid_fkey"
            columns: ["article_pmid"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["pmid"]
          },
        ]
      }
      proteins: {
        Row: {
          article_pmid: string | null
          derived_from: string[] | null
          description: string | null
          id: string
          key_properties: string[] | null
          name: string
          production_method: string | null
          role_in_study: string | null
          tags: Json | null
          type: string | null
        }
        Insert: {
          article_pmid?: string | null
          derived_from?: string[] | null
          description?: string | null
          id?: string
          key_properties?: string[] | null
          name: string
          production_method?: string | null
          role_in_study?: string | null
          tags?: Json | null
          type?: string | null
        }
        Update: {
          article_pmid?: string | null
          derived_from?: string[] | null
          description?: string | null
          id?: string
          key_properties?: string[] | null
          name?: string
          production_method?: string | null
          role_in_study?: string | null
          tags?: Json | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proteins_article_pmid_fkey"
            columns: ["article_pmid"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["pmid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_filtered_articles: {
        Args: {
          search_query: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
