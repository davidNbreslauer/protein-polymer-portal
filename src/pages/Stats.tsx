
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useArticleStats } from '@/hooks/useArticleStats';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Stats = () => {
  const { data: stats, isLoading, error } = useArticleStats();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading statistics...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Error loading statistics</h1>
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">No statistics available</h1>
      </div>
    );
  }

  const renderChartSection = (data: { name: string; count: number }[], title: string) => {
    const chartData = data.filter(item => item.count > 1);
    const singleCountItems = data.filter(item => item.count === 1);
    const sectionKey = title.toLowerCase().replace(/\s+/g, '-');

    // Adjust font size based on the number of items
    const fontSize = chartData.length > 15 ? 10 : 12;
    const angle = chartData.length > 15 ? -45 : 0;
    const textAnchor = angle !== 0 ? "end" : "end";
    const verticalPadding = angle !== 0 ? 20 : 0;

    return (
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {chartData.length > 0 && (
          <ScrollArea className="h-[400px] w-full">
            <div className="min-w-[800px]">
              <ResponsiveContainer width="100%" height={350 + verticalPadding}>
                <BarChart 
                  data={chartData} 
                  layout="vertical" 
                  margin={{ 
                    left: 150,
                    bottom: verticalPadding 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={140}
                    tick={{ 
                      fontSize: fontSize,
                      angle: angle,
                      textAnchor: textAnchor
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollArea>
        )}
        {singleCountItems.length > 0 && (
          <Collapsible
            open={openSections[sectionKey]}
            onOpenChange={(isOpen) =>
              setOpenSections((prev) => ({ ...prev, [sectionKey]: isOpen }))
            }
            className="mt-4"
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              {openSections[sectionKey] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Categories with single occurrence ({singleCountItems.length})
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {singleCountItems.map((item) => (
                  <span key={item.name} className="text-sm text-gray-600">
                    {item.name}
                  </span>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Article Statistics</h1>
      <div className="flex flex-col gap-1 mb-6">
        <p>Total number of articles: {stats.totalArticles}</p>
        {stats.mostRecentDate && (
          <p>Most recent article: {stats.mostRecentDate}</p>
        )}
      </div>
      
      {stats.proteinFamilies.length > 0 && (
        renderChartSection(stats.proteinFamilies, "Protein Families Distribution")
      )}
      
      {stats.proteinForms.length > 0 && (
        renderChartSection(stats.proteinForms, "Protein Forms Distribution")
      )}
      
      {stats.expressionSystems.length > 0 && (
        renderChartSection(stats.expressionSystems, "Expression Systems Distribution")
      )}
      
      {stats.applications.length > 0 && (
        renderChartSection(stats.applications, "Applications Distribution")
      )}
    </div>
  );
};

export default Stats;
