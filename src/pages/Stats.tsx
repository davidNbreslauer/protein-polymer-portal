
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useArticleStats } from '@/hooks/useArticleStats';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const Stats = () => {
  const { data: stats, isLoading, error } = useArticleStats();

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
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categories with single occurrence:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {singleCountItems.map((item) => (
                <span key={item.name} className="text-sm text-gray-600">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Article Statistics</h1>
      <p className="mb-6">Total number of articles: {stats.totalArticles}</p>
      
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
