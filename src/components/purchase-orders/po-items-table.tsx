"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  type?: "Fabric" | "Trims";
}

export function POItemsTable({
  items,
  onEditClick,
  onDeleteClick,
  onOpenAddDialog,
  totalQtyDisplay,
  isReadOnly = false,
  itemLabel,
  specLabel = "GSM / Content",
  type
}: POItemsTableProps) {
  const [viewingItem, setViewingItem] = useState<POItem | null>(null);

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

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-slate-700 text-xs font-bold w-10 text-center py-2.5">#</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold py-2.5">Image</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">{itemLabel}</TableHead>
              {type === "Trims" && (
                <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Item Code</TableHead>
              )}
              {type !== "Trims" && (
                <>
                  <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">{specLabel}</TableHead>
                  <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Width</TableHead>
                </>
              )}
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Color / Shade</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Delivery Date</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">UOM</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Required Qty</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Total Qty</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Buffer</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Rate (₹)</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">GST %</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-right py-2.5">Amount (₹)</TableHead>
              {!isReadOnly && <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isReadOnly ? 13 : 14} className="py-8 text-center text-slate-500">
                  No {itemLabel.toLowerCase()}s added yet. {!isReadOnly && `Click "Add ${itemLabel}" to start.`}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-center text-slate-500 py-3">{index + 1}</TableCell>
                  <TableCell className="py-3">
                    <button 
                      onClick={() => setViewingItem(item)}
                      className="w-10 h-10 rounded bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center hover:ring-2 hover:ring-[#0453B8] transition-all cursor-pointer"
                    >
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt="item" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <span className="font-bold text-slate-900">{item.material || '-'}</span>
                  </TableCell>
                  {type === "Trims" && (
                    <TableCell className="text-center py-3">
                      <span className="font-mono font-semibold text-slate-700 text-xs tracking-wide bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        {item.code || '-'}
                      </span>
                    </TableCell>
                  )}
                  {type !== "Trims" && (
                    <>
                      <TableCell className="text-center py-3">
                        <span className="font-semibold text-slate-700">{item.gsm || item.gsmContent || '-'}</span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span className="font-semibold text-slate-700">{item.width || '-'}</span>
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center py-3">
                    <div className="flex items-center justify-center gap-2">
                      {item.colorShade && item.colorShade !== '-' && (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: item.colorShade.toLowerCase() === 'navy' ? '#000080' : item.colorShade.toLowerCase() === 'white' ? '#ffffff' : item.colorShade.toLowerCase() === 'black' ? '#000000' : item.colorShade.toLowerCase() === 'red' ? '#ef4444' : item.colorShade.toLowerCase() === 'grey' ? '#555555' : item.colorShade.toLowerCase() === 'natural' ? '#f5f5dc' : '#cccccc' }} />
                      )}
                      <span className="font-semibold text-slate-700">{item.colorShade || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <span className="font-semibold text-slate-700">{item.deliveryDate || '—'}</span>
                  </TableCell>
                  <TableCell className="text-center text-slate-700 py-3">{item.uom || 'mtr'}</TableCell>
                  <TableCell className="text-center font-medium text-slate-600 py-3">
                    {item.requiredQty ? item.requiredQty.toLocaleString('en-IN') : '-'}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onEditClick(item); }}
                      className="mx-auto flex h-[30px] min-w-[64px] px-3 items-center justify-center rounded-md border border-[#cbe1fc] bg-[#f0f6ff] text-sm font-bold text-[#0453B8] transition-colors hover:bg-[#e0efff] hover:border-[#96c4f8]"
                    >
                      {(item.qty || 0).toLocaleString('en-IN')}
                    </button>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-slate-700 py-3">
                    {item.buffer ? item.buffer.toLocaleString('en-IN') : '-'}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-900 py-3">
                    {(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-900 py-3">
                    {item.gst || 0}%
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 py-3">
                    {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="text-center py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
        <span className="text-sm text-slate-600 font-medium">Total Items: {items.length}</span>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-slate-600">Total Qty</span>
          <span className="text-slate-900">{totalQtyDisplay}</span>
        </div>
      </div>

      {viewingItem && (
        <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white shadow-2xl border-0 [&>button]:hidden">
            <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between bg-white shadow-sm z-10">
              <DialogTitle className="text-xl font-bold text-[#0F172A]">Item Details</DialogTitle>
              <button onClick={() => setViewingItem(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-0 max-h-[80vh] overflow-y-auto">
              <div className="bg-slate-100 flex items-center justify-center p-6 border-r border-slate-200">
                {viewingItem.images && viewingItem.images.length > 0 ? (
                  <img src={viewingItem.images[0].url} alt="Item Image" className="max-w-full max-h-[400px] object-contain drop-shadow-md rounded" />
                ) : (
                  <div className="w-full h-[300px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-16 h-16 opacity-50" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">{itemLabel}</h3>
                    <p className="text-lg font-bold text-slate-900">{viewingItem.material}</p>
                  </div>
                  {type === "Trims" && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 mb-1">Item Code</h3>
                      <p className="text-md font-mono font-semibold text-slate-700">{viewingItem.code || '-'}</p>
                    </div>
                  )}
                  {type !== "Trims" && (
                    <>
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 mb-1">{specLabel}</h3>
                        <p className="text-md font-semibold text-slate-700">{viewingItem.gsm || viewingItem.gsmContent || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 mb-1">Width</h3>
                        <p className="text-md font-semibold text-slate-700">{viewingItem.width || '-'}</p>
                      </div>
                    </>
                  )}
                  <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Color / Shade</h3>
                    <div className="flex items-center gap-2">
                      {viewingItem.colorShade && viewingItem.colorShade !== '-' && (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: viewingItem.colorShade.toLowerCase() === 'navy' ? '#000080' : viewingItem.colorShade.toLowerCase() === 'white' ? '#ffffff' : viewingItem.colorShade.toLowerCase() === 'black' ? '#000000' : viewingItem.colorShade.toLowerCase() === 'red' ? '#ef4444' : viewingItem.colorShade.toLowerCase() === 'grey' ? '#555555' : viewingItem.colorShade.toLowerCase() === 'natural' ? '#f5f5dc' : '#cccccc' }} />
                      )}
                      <p className="text-md font-semibold text-slate-700">{viewingItem.colorShade || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Required Qty</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingItem.requiredQty ? viewingItem.requiredQty.toLocaleString('en-IN') : '-'} {viewingItem.uom}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Delivery Date</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingItem.deliveryDate || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Order Qty</h3>
                    <p className="text-md font-bold text-[#0453B8]">{viewingItem.qty ? viewingItem.qty.toLocaleString('en-IN') : '-'} {viewingItem.uom}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Buffer</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingItem.buffer ? viewingItem.buffer.toLocaleString('en-IN') : '0'} {viewingItem.uom}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Rate</h3>
                    <p className="text-md font-bold text-slate-900">₹ {(viewingItem.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Amount</h3>
                    <p className="text-md font-bold text-[#0453B8]">₹ {(viewingItem.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
