import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { ALL_SO_ITEMS } from "@/components/purchase-orders/select-so-items-dialog";

import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";

export interface LinkedLine {
  id: string; // the SO item id
  soNo: string;
  soItemCode: string;
  style: string;
  color: string;
  requiredQty: number; // For trims, this is just the total Pcs of the garment, or a specific calculated qty. For mock, we'll use a standard ratio.
  alreadyOrdered: number;
}

interface LinkSoLinesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyerName?: string; // Only show SOs for this buyer
  trimItemDetails: {
    itemType: string;
    description?: string;
  };
  initialLinkedLines: LinkedLine[];
  onSave: (linkedLines: LinkedLine[]) => void;
}

export function LinkSoLinesDialog({
  open,
  onOpenChange,
  buyerName,
  trimItemDetails,
  initialLinkedLines,
  onSave,
}: LinkSoLinesDialogProps) {
  const [selectedLines, setSelectedLines] = useState<Record<string, boolean>>({});
  
  // When modal opens, initialize selected lines
  useEffect(() => {
    if (open) {
      const initial: Record<string, boolean> = {};
      initialLinkedLines.forEach(line => {
        initial[line.id] = true;
      });
      setSelectedLines(initial);
    }
  }, [open, initialLinkedLines]);

  const allowedSoNos = MOCK_SALES_ORDERS_LIST
    .filter(so => !buyerName || so.buyer === buyerName)
    .map(so => so.soNo);

  const availableItems = ALL_SO_ITEMS.filter(item => 
    item.trackingStatus !== "CLOSED" && allowedSoNos.includes(item.soNo)
  );

  const PRODUCT_IMAGES = [
    "/men regualr fit shirt.jpeg",
    "/mens casual full sleeve shirt.jpg",
    "/men casual tshirt.jpeg",
    "/men casual half shirt.jpg"
  ];

  // Generate mock data for the table rows based on ALL_SO_ITEMS
  const tableRows = availableItems.map((item, index) => {
    const totalPcs = Object.values(item.sizeBreakdown || {}).reduce((a, b) => a + (b as number), 0);
    // Consumption multiplier: e.g. 8 buttons per shirt, 1 label per shirt
    let consumption = 1;
    if (trimItemDetails?.itemType?.toLowerCase().includes("button")) {
      consumption = 8;
    }
    const requiredQty = (totalPcs > 0 ? totalPcs : 500) * consumption;
    let alreadyOrdered = 0;
    if (index === 0) alreadyOrdered = Math.floor(requiredQty * 0.5); // 50% ordered
    else if (index === 2) alreadyOrdered = Math.floor(requiredQty * 0.8); // 80% ordered
    else if (index === 3) alreadyOrdered = requiredQty; // 100% ordered
    else if (index % 4 === 1) alreadyOrdered = Math.floor(requiredQty * 0.3); // 30% ordered
    
    return {
      id: item.id,
      soNo: item.soNo,
      lineItem: item.soItem,
      style: item.name,
      itemCode: item.productId,
      imageColor: item.color,
      imageSrc: PRODUCT_IMAGES[index % PRODUCT_IMAGES.length],
      requiredQty,
      alreadyOrdered,
      balanceRequired: requiredQty - alreadyOrdered,
    };
  });

  const handleToggle = (id: string, balanceRequired: number) => {
    if (balanceRequired <= 0) return;
    setSelectedLines(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedLines).filter(Boolean).length;
  
  const totalRequired = tableRows
    .filter(row => selectedLines[row.id])
    .reduce((sum, row) => sum + row.requiredQty, 0);
    
  const totalBalance = tableRows
    .filter(row => selectedLines[row.id])
    .reduce((sum, row) => sum + row.balanceRequired, 0);

  const handleSave = () => {
    const newLinkedLines = tableRows
      .filter(row => selectedLines[row.id])
      .map(row => ({
        id: row.id,
        soNo: row.soNo,
        soItemCode: row.lineItem,
        style: row.style,
        color: row.imageColor,
        requiredQty: row.requiredQty,
        alreadyOrdered: row.alreadyOrdered,
      }));
    onSave(newLinkedLines);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-w-[95vw] p-0 overflow-hidden bg-slate-50 flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-800">
            Select Sales Order Lines for {trimItemDetails.itemType || "Item"} {trimItemDetails.description ? `- ${trimItemDetails.description}` : ""}
          </DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-white border-b border-slate-100 flex gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by SO No., Style, Design, Line No..." className="pl-9 bg-slate-50 border-slate-200" />
          </div>
          <Button variant="outline" className="text-[#0453B8] border-blue-200 hover:bg-blue-50 font-semibold shrink-0">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px]">
          <table className="w-full text-sm text-left bg-white">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8]" />
                </th>
                <th className="px-4 py-3 font-bold text-slate-700">
                  <div className="flex flex-col">
                    <span>SO No.</span>
                    <span className="text-xs text-slate-500 font-medium">Line Item</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700">
                  <div className="flex flex-col">
                    <span>Style / Design</span>
                    <span className="text-xs text-slate-500 font-medium">Item</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700">
                  <div className="flex flex-col">
                    <span>Image</span>
                    <span className="text-xs text-slate-500 font-medium">Color</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 text-right">
                  <div className="flex flex-col items-end">
                    <span>Required Qty (Pcs)</span>
                    <span className="text-xs text-slate-500 font-medium">Already Ordered</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 text-right">
                  <div className="flex flex-col items-end">
                    <span>Balance Required (Pcs)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRows.map((row) => (
                <tr 
                  key={row.id} 
                  className={`transition-colors ${row.balanceRequired <= 0 ? "bg-slate-50 opacity-60 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"} ${selectedLines[row.id] ? "bg-blue-50/30" : ""}`}
                  onClick={() => handleToggle(row.id, row.balanceRequired)}
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedLines[row.id] || false}
                      onChange={() => handleToggle(row.id, row.balanceRequired)}
                      disabled={row.balanceRequired <= 0}
                      className="rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] w-4 h-4 disabled:opacity-50" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#0453B8]">{row.soNo}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Line {row.id.replace('line-', '')}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{row.itemCode}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{row.style}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[80px] h-[100px] flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={row.imageSrc} 
                          alt={row.style} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="font-bold text-slate-800">{row.imageColor}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase">{row.imageColor.substring(0,3).toUpperCase()}01</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-800">{row.requiredQty.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{row.alreadyOrdered}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-900">{row.balanceRequired.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8 text-sm">
            <span className="font-bold text-slate-800">{selectedCount} lines selected</span>
            <span className="font-bold text-[#0453B8]">Total Required: {totalRequired.toLocaleString()} Pcs</span>
            <span className="font-bold text-[#0453B8]">Total Balance: {totalBalance.toLocaleString()} Pcs</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 font-semibold">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#0453B8] hover:bg-blue-700 text-white px-6 font-semibold shadow-sm">
              Add Selected Lines
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
