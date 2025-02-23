
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FilterProps } from "./types";

interface SortSectionProps extends FilterProps {
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  currentFilters: FilterProps['onFilterChange'] extends (filters: infer T) ? T : never;
}

export const SortSection = ({ sortDirection, setSortDirection, onFilterChange, currentFilters }: SortSectionProps) => {
  const handleSortDirectionChange = (value: 'asc' | 'desc') => {
    setSortDirection(value);
    onFilterChange({ ...currentFilters, sortDirection: value });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Sort by Date</h3>
      <RadioGroup
        defaultValue="desc"
        value={sortDirection}
        onValueChange={handleSortDirectionChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="desc" id="sort-desc" />
          <Label htmlFor="sort-desc">Newest First</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="asc" id="sort-asc" />
          <Label htmlFor="sort-asc">Oldest First</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

