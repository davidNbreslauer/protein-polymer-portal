
export type Article = {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  timestamp: string;
  summary?: string;
  tags?: string[];
  proteins?: {
    name: string;
    description: string;
    type?: string;
    derivedFrom?: string[];
    production_method?: string;
  }[];
  materials?: {
    name: string;
    description: string;
    properties?: string[];
  }[];
  methods?: string[];
  analysisTools?: string[];
  results?: string;
  conclusions?: string;
};
