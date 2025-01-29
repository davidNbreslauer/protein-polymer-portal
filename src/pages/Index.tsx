
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Type for our article data
type Article = {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  timestamp: string;
  proteins?: {
    name: string;
    description: string;
  }[];
  materials?: {
    name: string;
    description: string;
  }[];
};

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      proteins (
        name,
        description
      ),
      materials (
        name,
        description
      )
    `)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data as Article[];
};

const Index = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-semibold">P</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Protein Polymer Research Database</h1>
            </div>
            <p className="text-sm text-gray-500">Explore engineered protein polymers and their applications</p>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by protein name, application, or properties..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg 
                         bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 
                         focus:border-primary transition duration-200 ease-in-out
                         placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900">Filters</h2>
                <button className="text-sm text-primary hover:text-primary/80">
                  Clear all
                </button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-6">
                {/* Date Range */}
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

                {/* Protein Family */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Protein Family</h3>
                  <div className="space-y-2">
                    {["Elastomeric proteins", "Spider Silk", "Resilin", "Calmodulin"].map((family) => (
                      <label key={family} className="flex items-center">
                        <input
                          type="checkbox"
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

          {/* Results */}
          <div className="md:col-span-3 space-y-4">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading articles...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                Error loading articles. Please try again later.
              </div>
            )}

            {articles?.map((article) => (
              <article key={article.pmid} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {article.authors?.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        PMID: {article.pmid}
                      </span>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        {isExpanded ? "Less" : "More"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {article.abstract.slice(0, 200)}...
                  </p>

                  <div className={cn(
                    "mt-6 space-y-6 overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Proteins Section */}
                      {article.proteins && article.proteins.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Proteins</h4>
                          {article.proteins.map((protein, idx) => (
                            <div key={idx} className="space-y-2">
                              <h5 className="text-sm font-medium">{protein.name}</h5>
                              <p className="text-sm text-gray-600">
                                {protein.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Materials Section */}
                      {article.materials && article.materials.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Materials</h4>
                          {article.materials.map((material, idx) => (
                            <div key={idx} className="space-y-2">
                              <h5 className="text-sm font-medium">{material.name}</h5>
                              <p className="text-sm text-gray-600">
                                {material.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
