
import { useState } from "react";
import { FilterOptions, FilterProps } from "./types";

export const DateRangeSection = ({ 
  startDate, 
  endDate, 
  onDateChange, 
  currentFilters 
}: { 
  startDate?: Date | null; 
  endDate?: Date | null; 
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  currentFilters: FilterOptions;
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : null;
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value ? new Date(e.target.value) : null;
    onDateChange(startDate, newEndDate);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Date Range</h3>
      <div className="space-y-2">
        <input
          type="date"
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 
                   focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="From date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={handleStartDateChange}
        />
        <input
          type="date"
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 
                   focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="To date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};
