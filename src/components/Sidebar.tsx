
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  onFilterChange: (filters: { 
    proteinFamily: string[], 
    showBookmarksOnly?: boolean, 
    sortDirection?: 'asc' | 'desc',
    showReviewsOnly?: boolean,
    excludeReviews?: boolean
  }) => void;
}

export const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [selectedProteinFamilies, setSelectedProteinFamilies] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [showReviewsOnly, setShowReviewsOnly] = useState(false);
  const [excludeReviews, setExcludeReviews] = useState(false);
  const [proteinTypes, setProteinTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchProteinTypes = async () => {
      const { data, error } = await supabase
        .from('proteins')
        .select('type')
        .not('type', 'is', null)
        .then(result => {
          if (result.error) throw result.error;
          // Get unique types and remove nulls
          const types = Array.from(new Set(result.data
            .map(protein => protein.type)
            .filter((type): type is string => !!type)
          )).sort();
          return { data: types, error: null };
        });

      if (error) {
        console.error('Error fetching protein types:', error);
        return;
      }

      setProteinTypes(data || []);
    };

    fetchProteinTypes();
  }, []);

  const handleProteinFamilyChange = (family: string) => {
    const updatedFamilies = selectedProteinFamilies.includes(family)
      ? selectedProteinFamilies.filter(f => f !== family)
      : [...selectedProteinFamilies, family];
    
    setSelectedProteinFamilies(updatedFamilies);
    onFilterChange({ 
      proteinFamily: updatedFamilies, 
      showBookmarksOnly, 
      sortDirection,
      showReviewsOnly,
      excludeReviews
    });
  };

  const handleBookmarksToggle = (checked: boolean) => {
    setShowBookmarksOnly(checked);
    onFilterChange({ 
      proteinFamily: selectedProteinFamilies, 
      showBookmarksOnly: checked, 
      sortDirection,
      showReviewsOnly,
      excludeReviews
    });
  };

  const handleSortDirectionChange = (value: 'asc' | 'desc') => {
    setSortDirection(value);
    onFilterChange({ 
      proteinFamily: selectedProteinFamilies, 
      showBookmarksOnly, 
      sortDirection: value,
      showReviewsOnly,
      excludeReviews
    });
  };

  const handleReviewsToggle = (checked: boolean) => {
    setShowReviewsOnly(checked);
    if (checked) setExcludeReviews(false); // Disable exclude reviews when showing reviews only
    onFilterChange({ 
      proteinFamily: selectedProteinFamilies, 
      showBookmarksOnly, 
      sortDirection,
      showReviewsOnly: checked,
      excludeReviews: false
    });
  };

  const handleExcludeReviewsToggle = (checked: boolean) => {
    setExcludeReviews(checked);
    if (checked) setShowReviewsOnly(false); // Disable show reviews only when excluding reviews
    onFilterChange({ 
      proteinFamily: selectedProteinFamilies, 
      showBookmarksOnly, 
      sortDirection,
      showReviewsOnly: false,
      excludeReviews: checked
    });
  };

  const handleClearAll = () => {
    setSelectedProteinFamilies([]);
    setShowBookmarksOnly(false);
    setSortDirection('desc');
    setShowReviewsOnly(false);
    setExcludeReviews(false);
    onFilterChange({ 
      proteinFamily: [], 
      showBookmarksOnly: false, 
      sortDirection: 'desc',
      showReviewsOnly: false,
      excludeReviews: false
    });
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

          <div className="space-y-3">
            <h3 className="text-sm font-medium">View Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showBookmarksOnly}
                  onChange={(e) => handleBookmarksToggle(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="ml-2 text-sm text-gray-600">Show Bookmarks Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showReviewsOnly}
                  onChange={(e) => handleReviewsToggle(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  disabled={excludeReviews}
                />
                <span className="ml-2 text-sm text-gray-600">Show Reviews Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={excludeReviews}
                  onChange={(e) => handleExcludeReviewsToggle(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  disabled={showReviewsOnly}
                />
                <span className="ml-2 text-sm text-gray-600">Exclude Reviews</span>
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
            <h3 className="text-sm font-medium">Protein Type</h3>
            <div className="space-y-2">
              {proteinTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary 
                             focus:ring-primary/20"
                  />
                  <span className="ml-2 text-sm text-gray-600">{type}</span>
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
