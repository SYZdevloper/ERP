import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductLineItem } from "@/types/sales-order";
import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { X, ArrowRight } from "lucide-react";
import { POItem } from "@/types/purchase-order";

interface SelectSalesOrderItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyerId: string;
  existingPoItems: POItem[];
  onNext: (selectedSoItem: ProductLineItem & { soItem: string, requiredQtyMtr: number }) => void;
}

export function SelectSalesOrderItemsDialog({
  open,
  onOpenChange,
  buyerId,
  existingPoItems,
  onNext
}: SelectSalesOrderItemsDialogProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Use the sales order items that match the buyerId (In a real app, you'd fetch the specific SO details)
  const salesOrder = MOCK_SALES_ORDERS_LIST.find(so => so.id === buyerId);
  
  // For demo, we'll just mock 3 items based on the screenshot
  const soItems: (ProductLineItem & { soItem: string, requiredQtyMtr: number })[] = [
    {
      id: "line-1",
      productId: "ST001",
      name: "Men's Casual Shirt",
      type: "Half Sleeve Regular Collar",
      color: "White",
      sizeBreakdown: { XS: 50, S: 100, M: 150, L: 120, XL: 80, XXL: 0 },
      rate: 250,
      soItem: "SO001-01",
      requiredQtyMtr: 900.00,
    } as any,
    {
      id: "line-2",
      productId: "ST003",
      name: "Men's Casual Shirt",
      type: "Half Sleeve Cuban Collar",
      color: "Navy",
      sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 },
      rate: 250,
      soItem: "SO001-02",
      requiredQtyMtr: 760.00,
    } as any,
    {
      id: "line-3",
      productId: "TS001",
      name: "Men's Polo T-Shirt",
      type: "Half Sleeve",
      color: "Black",
      sizeBreakdown: { XS: 40, S: 80, M: 120, L: 100, XL: 60, XXL: 0 },
      rate: 250,
      soItem: "SO001-03",
      requiredQtyMtr: 640.00,
    } as any,
  ];

  const handleNext = () => {
    if (!selectedItemId) return;
    const item = soItems.find(i => i.id === selectedItemId);
    if (item) {
      onNext(item);
      // Reset selection when moving forward
      setTimeout(() => setSelectedItemId(null), 300);
    }
  };

  const totalRequired = soItems.reduce((acc, curr) => acc + curr.requiredQtyMtr, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[1000px] h-[90vh] sm:h-[750px] flex flex-col p-0 overflow-hidden bg-white [&>button]:hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between shadow-sm">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">1. Select Sales Order Items</DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Header Info */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Sales Order No.</span>
              <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center text-slate-700">
                SO001
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Buyer / Customer</span>
              <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center">
                Zara
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Order Date</span>
              <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center">
                15 May 2025
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Delivery Date</span>
              <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center">
                30 Jun 2025
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8FAFC] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center w-16">Select</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">SO Item</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Product / Style</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Color</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center text-xs">Size Breakup</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Total Qty<br/><span className="text-xs text-slate-500 font-medium">(Pcs)</span></th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Required Qty<br/><span className="text-xs text-slate-500 font-medium">(Mtr From System)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {soItems.map((item) => {
                  const isLocked = existingPoItems.some(poItem => poItem.soItemId === item.id);
                  const totalPcs = Object.values(item.sizeBreakdown || {}).reduce((a,b)=>a+(b as number),0);
                  
                  // Filter active sizes
                  const activeSizes = Object.entries(item.sizeBreakdown || {})
                    .filter(([_, qty]) => qty !== undefined && (qty as number) > 0)
                    .map(([size, qty]) => ({ size, qty: qty as number }));
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`${isLocked ? 'bg-slate-50/70' : 'hover:bg-blue-50/50 cursor-pointer transition-colors'} ${selectedItemId === item.id ? 'bg-blue-50/50' : ''}`}
                      onClick={() => !isLocked && setSelectedItemId(item.id)}
                    >
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <input 
                            type="checkbox" 
                            checked={selectedItemId === item.id || isLocked}
                            onChange={() => !isLocked && setSelectedItemId(item.id)}
                            disabled={isLocked}
                            className={`w-4 h-4 rounded cursor-pointer accent-[#0453B8] ${isLocked ? 'text-slate-400 border-slate-300' : 'text-[#0453B8] border-slate-300 focus:ring-[#0453B8]'}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                      <td className={`px-4 py-4 font-bold text-center ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>{item.soItem}</td>
                      <td className="px-4 py-4">
                        <div className={`font-bold ${isLocked ? 'text-slate-500' : 'text-[#0453B8]'}`}>{item.productId}</div>
                        <div className={`font-medium mt-0.5 ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{item.name}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{item.type}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm ${item.color === 'White' ? 'bg-white' : item.color === 'Navy' ? 'bg-[#0F172A]' : 'bg-black'} ${isLocked ? 'opacity-50' : ''}`}></div>
                          <span className={`font-semibold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{item.color}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {activeSizes.length > 0 ? (
                          <div className={`grid grid-cols-5 gap-1 mx-auto w-fit ${isLocked ? 'opacity-50' : ''}`}>
                            {activeSizes.map(({ size, qty }) => (
                              <div key={size} className="flex flex-col items-center border border-slate-200 rounded-md overflow-hidden min-w-[32px] bg-white shadow-sm">
                                <div className="text-[10px] w-full text-center py-0.5 font-bold text-[#0453B8] border-b border-slate-200 px-1.5 leading-tight">
                                  {size}
                                </div>
                                <div className="w-full h-6 flex items-center justify-center text-[13px] font-semibold text-[#0453B8] px-1.5">
                                  {qty}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 flex justify-center">No sizes</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 text-center font-bold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{totalPcs}</td>
                      <td className={`px-4 py-4 text-center font-bold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{item.requiredQtyMtr.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t border-slate-200">
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-right font-bold text-slate-700">Total Required (From System)</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-900 text-[15px]">{totalRequired.toFixed(2)} Mtr</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-lg flex-shrink-0">
          <Button 
            disabled={!selectedItemId} 
            onClick={handleNext}
            className="bg-[#0453B8] hover:bg-blue-700 text-white font-bold px-6 py-2.5 h-auto text-sm shadow-sm transition-all disabled:opacity-50"
          >
            Next: Enter Fabric Items <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
