
import { useArticleStats } from '@/hooks/useArticleStats';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Stats = () => {
  const { data: stats, isLoading, error } = useArticleStats();
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

  // Sort proteins first by count (descending) and then alphabetically
  const sortedProteins = [...stats.proteins].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count; // Sort by count (most to least)
    }
    return a.name.localeCompare(b.name); // Then alphabetically
  });

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
      
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Protein Names</h2>
        <ScrollArea className="h-[600px]">
          <div className="space-y-1">
            {sortedProteins.map((protein) => (
              <div key={protein.name} className="py-1">
                <span className="font-medium">
                  {protein.name} {protein.count > 1 ? `(${protein.count})` : ''}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Stats;
