import { useState } from "react";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface SidebarProps {
  onFilterChange: (filters: { proteinFamily: string[], showBookmarksOnly?: boolean }) => void;
}

export const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [selectedProteinFamilies, setSelectedProteinFamilies] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const handleProteinFamilyChange = (family: string) => {
    const updatedFamilies = selectedProteinFamilies.includes(family)
      ? selectedProteinFamilies.filter(f => f !== family)
      : [...selectedProteinFamilies, family];
    
    setSelectedProteinFamilies(updatedFamilies);
    onFilterChange({ proteinFamily: updatedFamilies, showBookmarksOnly });
  };

  const handleBookmarksToggle = (checked: boolean) => {
    setShowBookmarksOnly(checked);
    onFilterChange({ proteinFamily: selectedProteinFamilies, showBookmarksOnly: checked });
  };

  const handleClearAll = () => {
    setSelectedProteinFamilies([]);
    setShowBookmarksOnly(false);
    onFilterChange({ proteinFamily: [], showBookmarksOnly: false });
  };

  return (
    <aside className="w-64">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </div>
            <button 
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">View Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showBookmarksOnly}
                  onChange={(e) => handleBookmarksToggle(e.target.checked)}
                  className="rounded border-gray-300 text-primary 
                           focus:ring-primary/20"
                />
                <span className="ml-2 text-sm text-gray-600">Show Bookmarks Only</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 
                         focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="From date"
              />
              <input
                type="date"
                className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 
                         focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="To date"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Protein Family</h3>
            <div className="space-y-2">
              {["Elastomeric proteins", "Spider Silk", "Resilin", "Calmodulin"].map((family) => (
                <label key={family} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProteinFamilies.includes(family)}
                    onChange={() => handleProteinFamilyChange(family)}
                    className="rounded border-gray-300 text-primary 
                             focus:ring-primary/20"
                  />
                  <span className="ml-2 text-sm text-gray-600">{family}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Protein Form</h3>
            <div className="space-y-2">
              {["Natural", "Engineered", "Recombinant", "Hybrid", "Chimeric"].map((form) => (
                <label key={form} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary 
                             focus:ring-primary/20"
                  />
                  <span className="ml-2 text-sm text-gray-600">{form}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Application</h3>
            <div className="space-y-2">
              {["Tissue Engineering", "Drug Delivery", "Biomaterials", "Environmental remediation"].map((app) => (
                <label key={app} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary 
                             focus:ring-primary/20"
                  />
                  <span className="ml-2 text-sm text-gray-600">{app}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tested Properties</h3>
            <div className="space-y-2">
              {["Cell viability", "Structural conformation", "Self-assembly", "Metal binding"].map((prop) => (
                <label key={prop} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary 
                             focus:ring-primary/20"
                  />
                  <span className="ml-2 text-sm text-gray-600">{prop}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
