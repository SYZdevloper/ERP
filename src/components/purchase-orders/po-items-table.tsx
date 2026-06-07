"use client";

import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { POItem } from "@/types/purchase-order";

interface POItemsTableProps {
  items: POItem[];
  onEditClick: (item: POItem) => void;
  onDeleteClick: (id: string) => void;
  onOpenAddDialog: () => void;
  totalQtyDisplay: string;
  isReadOnly?: boolean;
  itemLabel: string; // e.g. "Material" or "Trim Item"
  specLabel?: string; // e.g. "GSM / Content" or "Specifications"
}

export function POItemsTable({
  items,
  onEditClick,
  onDeleteClick,
  onOpenAddDialog,
  totalQtyDisplay,
  isReadOnly = false,
  itemLabel,
  specLabel = "GSM / Content"
}: POItemsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">2</div>
          <h2 className="text-sm font-bold text-slate-900">{itemLabel}s</h2>
        </div>
        {!isReadOnly && (
          <Button onClick={onOpenAddDialog} size="sm" className="bg-[#0453B8] hover:bg-blue-700 text-white font-medium h-8">
            <Plus className="w-4 h-4 mr-2" /> Add {itemLabel}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
              <th className="px-4 py-3 w-10 text-center">#</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">{itemLabel}</th>
              <th className="px-4 py-3">{specLabel}</th>
              <th className="px-4 py-3">Color / Shade</th>
              <th className="px-4 py-3 text-center">UOM</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Rate (₹)</th>
              <th className="px-4 py-3 text-center">GST %</th>
              <th className="px-4 py-3 text-right">Amount (₹)</th>
              {!isReadOnly && <th className="px-4 py-3 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 10 : 11} className="px-4 py-8 text-center text-slate-500">
                  No {itemLabel.toLowerCase()}s added yet. {!isReadOnly && `Click "Add ${itemLabel}" to start.`}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-4 text-center text-slate-500">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt="item" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-blue-900"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-slate-900">{item.material || '-'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-700">{item.gsmContent || '-'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-700">{item.colorShade || '-'}</span>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-700">{item.uom || 'mtr'}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-900">
                    {(item.qty || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-slate-900">
                    {(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-slate-900">
                    {item.gst || 0}%
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900">
                    {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  {!isReadOnly && (
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEditClick(item)} type="button" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDeleteClick(item.id)} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
        <span className="text-sm text-slate-600 font-medium">Total Items: {items.length}</span>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-slate-600">Total Qty</span>
          <span className="text-slate-900">{totalQtyDisplay}</span>
        </div>
      </div>
    </div>
  );
}
