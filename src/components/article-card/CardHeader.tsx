
import { ExternalLink, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/article";
import { UseMutateFunction } from "@tanstack/react-query";
import { format, isValid, parse } from "date-fns";

interface CardHeaderProps {
  article: Article;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isBookmarked: boolean;
  toggleBookmark: UseMutateFunction<{ articleId: number; action: "removed" | "added" }, Error, number, unknown>;
  isLoadingBookmarks: boolean;
}

export const CardHeader = ({
  article,
  isExpanded,
  setIsExpanded,
  isBookmarked,
  toggleBookmark,
  isLoadingBookmarks,
}: CardHeaderProps) => {
  let formattedDate = null;
  
  if (article.pub_date) {
    // Try parsing the date from common formats
    const possibleFormats = [
      'yyyy MMMM',
      'yyyy MMM',
      'MMMM yyyy',
      'MMM yyyy',
      'yyyy-MM-dd',
      'yyyy/MM/dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'yyyy-MM-dd\'T\'HH:mm:ss.SSSX',
      'yyyy-MM-dd\'T\'HH:mm:ssX'
    ];

    // First try to parse "2025 May" type format directly
    const yearMonthMatch = article.pub_date.match(/^(\d{4})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i);
    if (yearMonthMatch) {
      try {
        const year = yearMonthMatch[1];
        const month = yearMonthMatch[2];
        const dateString = `${year} ${month}`;
        const parsedDate = parse(dateString, 'yyyy MMM', new Date());
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, 'MMMM yyyy');
        }
      } catch (error) {
        console.warn('Failed to parse year-month format:', article.pub_date, error);
      }
    }

    // If the special case didn't work, try other formats
    if (!formattedDate) {
      for (const dateFormat of possibleFormats) {
        try {
          const parsedDate = parse(article.pub_date, dateFormat, new Date());
          if (isValid(parsedDate)) {
            formattedDate = format(parsedDate, 'MMMM yyyy');
            break;
          }
        } catch {
          continue;
        }
      }

      // If none of the formats work, try direct Date parsing as a fallback
      if (!formattedDate) {
        try {
          const directDate = new Date(article.pub_date);
          if (isValid(directDate)) {
            formattedDate = format(directDate, 'MMMM yyyy');
          }
        } catch (error) {
          console.warn('Could not parse date:', article.pub_date, error);
        }
      }
    }

    // If we still couldn't parse the date, log it for debugging
    if (!formattedDate) {
      console.warn('Unable to parse date format:', article.pub_date);
    }
  }

  const isReview = article.publication_type?.toLowerCase().includes('review');

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 text-base">
            {article.title}
          </h3>
          {isReview && (
            <Badge variant="secondary" className="text-xs">
              Review
            </Badge>
          )}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-500">
            {article.authors}
          </p>
          {formattedDate && (
            <p className="text-xs text-gray-500">
              Published: {formattedDate}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isLoadingBookmarks}
          onClick={() => toggleBookmark(article.id)}
        >
          <Bookmark 
            className={cn(
              "h-4 w-4",
              isBookmarked ? "fill-current" : "fill-none"
            )} 
          />
        </Button>
        {article.pubmed_id && (
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge variant="pubmed" className="flex items-center gap-1.5">
              PMID: {article.pubmed_id}
              <ExternalLink className="w-3.5 h-3.5" />
            </Badge>
          </a>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      </div>
    </div>
  );
};
