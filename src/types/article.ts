
export type Article = {
  id: number;
  pubmed_id?: string;
  doi?: string;
  title: string;
  abstract?: string;
  authors?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  elocation_id?: string;
  pub_date?: string;
  language?: string;
  publication_type?: string;
  publication_status?: string;
  summary?: string;
  conclusions?: string;
  facets_protein_family?: string[];
  facets_protein_form?: string[];
  facets_expression_system?: string[];
  facets_application?: string[];
  facets_structural_motifs?: string[];
  facets_tested_properties?: string[];
  created_at?: string;
  updated_at?: string;
  
  // Related data that gets fetched
  proteins?: {
    id: number;
    name: string;
    description?: string;
    type?: string;
    derived_from?: string;
    production_method?: string;
    role_in_study?: string;
    key_properties?: string[];
    applications?: string[];
    structural_motifs?: string[];
    protein_family?: string;
    protein_form?: string;
    expression_system?: string;
  }[];
  materials?: {
    id: number;
    name: string;
    description?: string;
    composition?: string;
    fabrication_method?: string;
    key_properties?: string[];
    potential_applications?: string[];
  }[];
  methods?: {
    id: number;
    method_name: string;
  }[];
  analysis_techniques?: {
    id: number;
    technique: string;
  }[];
  results?: {
    id: number;
    description?: string;
    data?: any;
  }[];
};
