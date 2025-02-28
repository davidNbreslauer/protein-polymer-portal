
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const PageSizeSelector = ({ pageSize, onPageSizeChange }: PageSizeSelectorProps) => {
  return (
    <Select onValueChange={onPageSizeChange} value={pageSize.toString()}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select page size" />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size} value={size.toString()}>
            {size} results per page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
