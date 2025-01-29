
export type Article = {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  timestamp: string;
  tags?: string[];
  proteins?: {
    name: string;
    description: string;
    derivedFrom?: string[];
    production?: string;
  }[];
  materials?: {
    name: string;
    description: string;
    properties?: string[];
  }[];
  methods?: string[];
  analysisTools?: string[];
  results?: string;
};
