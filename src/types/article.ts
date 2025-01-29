
export type Article = {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  timestamp: string;
  proteins?: {
    name: string;
    description: string;
  }[];
  materials?: {
    name: string;
    description: string;
  }[];
};
