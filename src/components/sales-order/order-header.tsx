import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Menu, CalendarDays, ChevronDown, FileText } from "lucide-react";

interface OrderHeaderProps {
  salesOrderNo: string;
  orderDate: Date;
  status: string;
  isReadOnly?: boolean;
}

export function OrderHeader({ salesOrderNo, orderDate, status, isReadOnly = false }: OrderHeaderProps) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-slate-500 cursor-pointer lg:hidden" />
          <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-10 h-10 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{isReadOnly ? "View Sales Order" : "Sales Order"}</h1>
            <p className="text-xs text-slate-500">{isReadOnly ? "View order details" : "Create or edit sales order in simple steps"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
