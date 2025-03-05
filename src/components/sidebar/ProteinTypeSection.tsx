
import { FilterOptions, FilterProps } from "./types";
import { useProteinTypes } from "@/hooks/useProteinTypes";

interface ProteinTypeSectionProps extends FilterProps {
  selectedProteinTypes: string[];
  setSelectedProteinTypes: (types: string[]) => void;
  currentFilters: FilterOptions;
}

export const ProteinTypeSection = ({
  selectedProteinTypes,
  setSelectedProteinTypes,
  onFilterChange,
  currentFilters
}: ProteinTypeSectionProps) => {
  const { proteinTypes, isLoading } = useProteinTypes();

  const handleProteinTypeChange = (type: string) => {
    const updatedTypes = selectedProteinTypes.includes(type)
      ? selectedProteinTypes.filter(t => t !== type)
      : [...selectedProteinTypes, type];
    
    setSelectedProteinTypes(updatedTypes);
    onFilterChange({ ...currentFilters, proteinType: updatedTypes });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Protein Type</h3>
        <div className="space-y-2 animate-pulse">
          <div className="h-5 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Protein Type</h3>
      <div className="space-y-2">
        {proteinTypes.map((type) => (
          <div key={type.name} className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProteinTypes.includes(type.name)}
                onChange={() => handleProteinTypeChange(type.name)}
                className="rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="ml-2 text-sm text-gray-600">{type.name}</span>
            </label>
            <span className="text-sm text-gray-500">{type.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
