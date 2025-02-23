
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ProteinTypeSection = () => {
  const [proteinTypes, setProteinTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchProteinTypes = async () => {
      const { data, error } = await supabase
        .from('proteins')
        .select('type')
        .not('type', 'is', null)
        .then(result => {
          if (result.error) throw result.error;
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

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Protein Type</h3>
      <div className="space-y-2">
        {proteinTypes.map((type) => (
          <label key={type} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="ml-2 text-sm text-gray-600">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

