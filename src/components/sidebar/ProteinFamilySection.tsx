
import { FilterOptions, FilterProps } from "./types";

interface ProteinFamilySectionProps extends FilterProps {
  selectedProteinFamilies: string[];
  setSelectedProteinFamilies: (families: string[]) => void;
  currentFilters: FilterOptions;
}

export const ProteinFamilySection = ({
  selectedProteinFamilies,
  setSelectedProteinFamilies,
  onFilterChange,
  currentFilters,
}: ProteinFamilySectionProps) => {
  const handleProteinFamilyChange = (family: string) => {
    const updatedFamilies = selectedProteinFamilies.includes(family)
      ? selectedProteinFamilies.filter(f => f !== family)
      : [...selectedProteinFamilies, family];
    
    setSelectedProteinFamilies(updatedFamilies);
    onFilterChange({ ...currentFilters, proteinFamily: updatedFamilies });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Protein Family</h3>
      <div className="space-y-2">
        {["Elastomeric proteins", "Spider Silk", "Resilin", "Calmodulin"].map((family) => (
          <label key={family} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedProteinFamilies.includes(family)}
              onChange={() => handleProteinFamilyChange(family)}
              className="rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="ml-2 text-sm text-gray-600">{family}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
