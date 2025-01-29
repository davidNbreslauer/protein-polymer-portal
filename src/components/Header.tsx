
import { Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
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
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
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
  );
};
