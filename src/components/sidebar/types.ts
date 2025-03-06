
export type { FilterOptions } from "@/hooks/article/types";

export interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}
