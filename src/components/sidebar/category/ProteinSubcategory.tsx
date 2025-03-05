
import { FilterOptions } from "../types";

interface ProteinSubcategoryProps {
  subcategoryName: string;
  subcategoryCount: number;
  isSelected: boolean;
  categoryName: string;
  onSubcategorySelect: (subcategory: string, category: string) => void;
}

export const ProteinSubcategory = ({
  subcategoryName,
  subcategoryCount,
  isSelected,
  categoryName,
  onSubcategorySelect,
}: ProteinSubcategoryProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSubcategorySelect(subcategoryName, categoryName)}
          className="rounded border-gray-300 text-primary focus:ring-primary/20"
        />
        <span className="ml-2 text-sm text-gray-600">
          {subcategoryName}
        </span>
      </label>
      <span className="text-sm text-gray-500">{subcategoryCount}</span>
    </div>
  );
};
