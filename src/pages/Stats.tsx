
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useArticleStats } from '@/hooks/useArticleStats';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, ExternalLink, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Stats = () => {
  const { data: stats, isLoading, error } = useArticleStats();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

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

  // Add debug logging
  console.log('Stats data:', {
    proteinFamilies: stats.proteinFamilies,
    proteinForms: stats.proteinForms,
    expressionSystems: stats.expressionSystems,
    applications: stats.applications,
    materialProperties: stats.materialProperties
  });

  const renderChartSection = (data: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[], title: string) => {
    if (!data || data.length === 0) {
      console.log(`No data for section: ${title}`);
      return null;
    }

    const chartData = data.filter(item => item.count > 1 && item.name);
    const singleCountItems = data.filter(item => item.count === 1);
    const noCategories = data.find(item => !item.name);
    const sectionKey = title.toLowerCase().replace(/\s+/g, '-');

    return (
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {chartData.length > 0 && (
          <ScrollArea className="h-[400px] w-full">
            <div className="min-w-[800px]">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 150 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={140} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollArea>
        )}
        
        {singleCountItems.length > 0 && (
          <Collapsible
            open={openSections[`${sectionKey}-single`]}
            onOpenChange={(isOpen) =>
              setOpenSections((prev) => ({ ...prev, [`${sectionKey}-single`]: isOpen }))
            }
            className="mt-4"
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              {openSections[`${sectionKey}-single`] ? (
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

        {noCategories && noCategories.articles && noCategories.articles.length > 0 && (
          <Collapsible
            open={openSections[`${sectionKey}-none`]}
            onOpenChange={(isOpen) =>
              setOpenSections((prev) => ({ ...prev, [`${sectionKey}-none`]: isOpen }))
            }
            className="mt-4"
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              {openSections[`${sectionKey}-none`] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Papers with no categories ({noCategories.count})
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-2">
                {noCategories.articles.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {item.pubmed_id && (
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${item.pubmed_id}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 shrink-0"
                      >
                        PMID: {item.pubmed_id}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <span className="text-gray-600">{item.title}</span>
                  </div>
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
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-2xl font-bold">Article Statistics</h1>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <p>Total number of articles: {stats.totalArticles}</p>
        {stats.mostRecentDate && (
          <p>Most recent article: {stats.mostRecentDate}</p>
        )}
      </div>
      
      {stats.proteinFamilies && stats.proteinFamilies.length > 0 && (
        renderChartSection(stats.proteinFamilies, "Protein Families Distribution")
      )}
      
      {stats.proteinForms && stats.proteinForms.length > 0 && (
        renderChartSection(stats.proteinForms, "Protein Forms Distribution")
      )}
      
      {stats.expressionSystems && stats.expressionSystems.length > 0 && (
        renderChartSection(stats.expressionSystems, "Expression Systems Distribution")
      )}
      
      {stats.applications && stats.applications.length > 0 && (
        renderChartSection(stats.applications, "Applications Distribution")
      )}

      {stats.materialProperties && stats.materialProperties.length > 0 && (
        renderChartSection(stats.materialProperties, "Material Properties Distribution")
      )}
    </div>
  );
};

export default Stats;
