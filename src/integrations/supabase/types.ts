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
      analysis_techniques: {
        Row: {
          article_id: number
          created_at: string | null
          id: number
          technique: string
        }
        Insert: {
          article_id: number
          created_at?: string | null
          id?: number
          technique: string
        }
        Update: {
          article_id?: number
          created_at?: string | null
          id?: number
          technique?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_techniques_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          abstract: string | null
          authors: string | null
          conclusions: string | null
          created_at: string | null
          doi: string | null
          elocation_id: string | null
          facets_application: string[] | null
          facets_expression_system: string[] | null
          facets_protein_categories: string[] | null
          facets_protein_family: string[] | null
          facets_protein_form: string[] | null
          facets_protein_subcategories: string[] | null
          facets_structural_motifs: string[] | null
          facets_tested_properties: string[] | null
          id: number
          issue: string | null
          journal: string | null
          language: string | null
          pages: string | null
          pub_date: string | null
          publication_status: string | null
          publication_type: string | null
          pubmed_id: string | null
          summary: string | null
          title: string
          updated_at: string | null
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          authors?: string | null
          conclusions?: string | null
          created_at?: string | null
          doi?: string | null
          elocation_id?: string | null
          facets_application?: string[] | null
          facets_expression_system?: string[] | null
          facets_protein_categories?: string[] | null
          facets_protein_family?: string[] | null
          facets_protein_form?: string[] | null
          facets_protein_subcategories?: string[] | null
          facets_structural_motifs?: string[] | null
          facets_tested_properties?: string[] | null
          id?: number
          issue?: string | null
          journal?: string | null
          language?: string | null
          pages?: string | null
          pub_date?: string | null
          publication_status?: string | null
          publication_type?: string | null
          pubmed_id?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          authors?: string | null
          conclusions?: string | null
          created_at?: string | null
          doi?: string | null
          elocation_id?: string | null
          facets_application?: string[] | null
          facets_expression_system?: string[] | null
          facets_protein_categories?: string[] | null
          facets_protein_family?: string[] | null
          facets_protein_form?: string[] | null
          facets_protein_subcategories?: string[] | null
          facets_structural_motifs?: string[] | null
          facets_tested_properties?: string[] | null
          id?: number
          issue?: string | null
          journal?: string | null
          language?: string | null
          pages?: string | null
          pub_date?: string | null
          publication_status?: string | null
          publication_type?: string | null
          pubmed_id?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          volume?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          article_id: number
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: number
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: number
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          article_id: number
          composition: string | null
          created_at: string | null
          description: string | null
          fabrication_method: string | null
          id: number
          key_properties: string[] | null
          name: string
          potential_applications: string[] | null
          updated_at: string | null
        }
        Insert: {
          article_id: number
          composition?: string | null
          created_at?: string | null
          description?: string | null
          fabrication_method?: string | null
          id?: number
          key_properties?: string[] | null
          name: string
          potential_applications?: string[] | null
          updated_at?: string | null
        }
        Update: {
          article_id?: number
          composition?: string | null
          created_at?: string | null
          description?: string | null
          fabrication_method?: string | null
          id?: number
          key_properties?: string[] | null
          name?: string
          potential_applications?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      methods: {
        Row: {
          article_id: number
          created_at: string | null
          id: number
          method_name: string
        }
        Insert: {
          article_id: number
          created_at?: string | null
          id?: number
          method_name: string
        }
        Update: {
          article_id?: number
          created_at?: string | null
          id?: number
          method_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "methods_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      protein_classifications: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: number
          subcategory: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          subcategory: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          subcategory?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proteins: {
        Row: {
          applications: string[] | null
          article_id: number
          classification_id: number | null
          created_at: string | null
          derived_from: string | null
          description: string | null
          expression_system: string | null
          id: number
          key_properties: string[] | null
          name: string
          production_method: string | null
          protein_family: string | null
          protein_form: string | null
          role_in_study: string | null
          structural_motifs: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          applications?: string[] | null
          article_id: number
          classification_id?: number | null
          created_at?: string | null
          derived_from?: string | null
          description?: string | null
          expression_system?: string | null
          id?: number
          key_properties?: string[] | null
          name: string
          production_method?: string | null
          protein_family?: string | null
          protein_form?: string | null
          role_in_study?: string | null
          structural_motifs?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          applications?: string[] | null
          article_id?: number
          classification_id?: number | null
          created_at?: string | null
          derived_from?: string | null
          description?: string | null
          expression_system?: string | null
          id?: number
          key_properties?: string[] | null
          name?: string
          production_method?: string | null
          protein_family?: string | null
          protein_form?: string | null
          role_in_study?: string | null
          structural_motifs?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proteins_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proteins_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "protein_classifications"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          article_id: number
          created_at: string | null
          data: Json | null
          description: string | null
          id: number
        }
        Insert: {
          article_id: number
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: number
        }
        Update: {
          article_id?: number
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "results_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      protein_classification_view: {
        Row: {
          applications: string[] | null
          article_id: number | null
          category: string | null
          derived_from: string | null
          description: string | null
          expression_system: string | null
          key_properties: string[] | null
          production_method: string | null
          protein_family: string | null
          protein_form: string | null
          protein_id: number | null
          protein_name: string | null
          role_in_study: string | null
          structural_motifs: string[] | null
          subcategory: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proteins_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      count_filtered_articles: {
        Args: {
          search_query: string
        }
        Returns: number
      }
      exec_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
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
