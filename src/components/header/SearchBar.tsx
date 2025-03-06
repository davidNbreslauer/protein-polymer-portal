
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isTyping, setIsTyping] = useState(false);
  
  // Update local state when props change
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);
  
  // Handle local input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setIsTyping(true);
    
    // Pass changes up to parent immediately
    onSearchChange(e);
  };
  
  // Reset typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [localQuery, isTyping]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={18} />
      </div>
      
      <input
        type="text"
        value={localQuery}
        onChange={handleInputChange}
        placeholder="Search across all aspects of papers (title, methods, results, etc.)..."
        className={cn(
          "w-full pl-10 pr-4 py-2.5 rounded-lg",
          "bg-gray-50 border border-gray-200",
          "placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "transition duration-200",
          isTyping ? "border-primary" : ""
        )}
      />
    </div>
  );
};
