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
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-slate-900 mb-2.5">{isReadOnly ? "View Sales Order" : "New Sales Order"}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-blue-50/80 border border-blue-100 rounded-md px-3 py-1 shadow-sm">
                <span className="text-[10px] font-bold text-[#0453B8]/70 uppercase tracking-wider mr-2">SO NUMBER</span>
                <span className="text-xs font-bold text-[#0453B8] tracking-wide">
                  {salesOrderNo}
                </span>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-3 py-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2">
                  {isReadOnly ? "STATUS" : "SO DATE"}
                </span>
                <span className="text-xs font-bold text-slate-700 tracking-wide">
                  {isReadOnly ? status : format(orderDate, "dd-MMM-yyyy").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
