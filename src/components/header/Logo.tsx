
import { BarChart2, Database } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-3">
        <Database className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Protein Polymer Research Database</h1>
      </div>
      <Link
        to="/stats"
        className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
      >
        <BarChart2 className="w-5 h-5" />
        <span className="text-sm">Stats</span>
      </Link>
    </div>
  );
};
