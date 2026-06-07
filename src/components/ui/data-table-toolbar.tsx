import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  recordCount?: number;
}

export function DataTableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  actions,
  recordCount
}: DataTableToolbarProps) {
  return (
    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder={searchPlaceholder} 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-slate-50/50 border-slate-200 text-[13px] focus-visible:ring-[#0453B8]"
          />
        </div>
        {filters && <div>{filters}</div>}
      </div>

      <div className="flex items-center gap-4">
        {recordCount !== undefined && (
          <div className="text-sm font-medium text-slate-500">
            {recordCount} records
          </div>
        )}
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
