
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Protein Polymer Research Database</h1>
        </div>
        <p className="text-sm text-gray-600">
          Explore engineered protein polymers and their applications
        </p>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by protein name, application, or properties..."
            className={cn(
              "w-full px-4 py-2.5 rounded-lg",
              "bg-gray-50 border border-gray-200",
              "placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition duration-200"
            )}
          />
        </div>
      </div>
    </header>
  );
};
