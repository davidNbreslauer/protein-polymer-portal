
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProteinSubcategory } from "./ProteinSubcategory";
import { CategoryData } from "@/hooks/useProteinCategories";

interface ProteinCategoryProps {
  categoryData: CategoryData;
  isExpanded: boolean;
  onToggleExpand: (category: string) => void;
  isSelected: boolean;
  onCategorySelect: (category: string) => void;
  selectedSubcategories: string[];
  onSubcategorySelect: (subcategory: string, category: string) => void;
}

export const ProteinCategory = ({
  categoryData,
  isExpanded,
  onToggleExpand,
  isSelected,
  onCategorySelect,
  selectedSubcategories,
  onSubcategorySelect,
}: ProteinCategoryProps) => {
  return (
    <Collapsible 
      key={categoryData.category} 
      open={isExpanded}
      onOpenChange={() => onToggleExpand(categoryData.category)}
      className="border-b border-gray-100 pb-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CollapsibleTrigger className="flex items-center mr-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onCategorySelect(categoryData.category)}
              className="rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="ml-2 text-sm text-gray-700">
              {categoryData.category}
            </span>
          </label>
        </div>
        <span className="text-sm text-gray-500">{categoryData.count}</span>
      </div>
      
      <CollapsibleContent className="pl-9 space-y-1 mt-1">
        {categoryData.subcategories.map((subcategory) => (
          <ProteinSubcategory
            key={subcategory.name}
            subcategoryName={subcategory.name}
            subcategoryCount={subcategory.count}
            isSelected={selectedSubcategories.includes(subcategory.name)}
            categoryName={categoryData.category}
            onSubcategorySelect={onSubcategorySelect}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
