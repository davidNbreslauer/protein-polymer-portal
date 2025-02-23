
export const DateRangeSection = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Date Range</h3>
      <div className="space-y-2">
        <input
          type="date"
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 
                   focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="From date"
        />
        <input
          type="date"
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 
                   focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="To date"
        />
      </div>
    </div>
  );
};

