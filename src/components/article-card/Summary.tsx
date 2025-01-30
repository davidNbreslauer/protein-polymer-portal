
import { Brain } from "lucide-react";
import type { Article } from "@/types/article";

interface SummaryProps {
  article: Article;
}

export const Summary = ({ article }: SummaryProps) => {
  return (
    <div>
      <p className="text-sm text-gray-600 leading-relaxed flex items-center gap-2">
        <Brain className="w-4 h-4 text-gray-400 shrink-0" />
        {article.summary || "No summary available."}
      </p>
    </div>
  );
};
