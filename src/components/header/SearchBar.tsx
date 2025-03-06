
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search across all aspects of papers (title, methods, results, etc.)..."
        className={cn(
          "w-full px-4 py-2.5 rounded-lg",
          "bg-gray-50 border border-gray-200",
          "placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "transition duration-200"
        )}
      />
    </div>
  );
};
