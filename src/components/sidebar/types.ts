
import type { FilterOptions } from "@/hooks/article/types";

export { FilterOptions };

export interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}
