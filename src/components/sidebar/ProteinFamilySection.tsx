
import { useState } from "react";
import { FilterOptions, FilterProps } from "./types";
import { useProteinFamilies } from "@/hooks/useProteinFamilies";

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
  const { proteinFamilies, isLoading } = useProteinFamilies();

  const handleProteinFamilyChange = (family: string) => {
    const updatedFamilies = selectedProteinFamilies.includes(family)
      ? selectedProteinFamilies.filter(f => f !== family)
      : [...selectedProteinFamilies, family];
    
    setSelectedProteinFamilies(updatedFamilies);
    onFilterChange({ ...currentFilters, proteinFamily: updatedFamilies });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Protein Family</h3>
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
      <h3 className="text-sm font-medium">Protein Family</h3>
      <div className="space-y-2">
        {proteinFamilies.map((family) => (
          <div key={family.name} className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProteinFamilies.includes(family.name)}
                onChange={() => handleProteinFamilyChange(family.name)}
                className="rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="ml-2 text-sm text-gray-600">{family.name}</span>
            </label>
            <span className="text-sm text-gray-500">{family.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
