
import { useState } from "react";

interface SidebarProps {
  onFilterChange: (filters: { proteinFamily: string[] }) => void;
}

export const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [selectedProteinFamilies, setSelectedProteinFamilies] = useState<string[]>([]);

  const handleProteinFamilyChange = (family: string) => {
    const updatedFamilies = selectedProteinFamilies.includes(family)
      ? selectedProteinFamilies.filter(f => f !== family)
      : [...selectedProteinFamilies, family];
    
    setSelectedProteinFamilies(updatedFamilies);
    onFilterChange({ proteinFamily: updatedFamilies });
  };

  const handleClearAll = () => {
    setSelectedProteinFamilies([]);
    onFilterChange({ proteinFamily: [] });
  };

  return (
    <aside className="md:col-span-1 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">Filters</h2>
          <button 
            className="text-sm text-primary hover:text-primary/80"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Date Range</h3>
            <div className="space-y-2">
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-200 rounded-md 
                         text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-200 rounded-md 
                         text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Protein Family</h3>
            <div className="space-y-2">
              {["Elastomeric proteins", "Spider Silk", "Resilin", "Calmodulin"].map((family) => (
                <label key={family} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProteinFamilies.includes(family)}
                    onChange={() => handleProteinFamilyChange(family)}
                    className="rounded border-gray-300 text-primary 
                             focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-600">{family}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
