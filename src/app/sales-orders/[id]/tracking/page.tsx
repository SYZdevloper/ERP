"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Search, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { ALL_SO_ITEMS } from "@/components/purchase-orders/select-so-items-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FabricTrackingPage() {
  const params = useParams();
  const soId = params.id as string;
  const salesOrder = MOCK_SALES_ORDERS_LIST.find((o) => o.id === soId);

  // We make a local copy of items so we can toggle status visually
  const [items, setItems] = useState(
    ALL_SO_ITEMS.filter((i) => i.soId === soId)
  );

  const [drillDownModal, setDrillDownModal] = useState<{
    open: boolean;
    item: typeof items[0] | null;
    type: 'Ordered' | 'Received';
    amount: number;
  }>({
    open: false,
    item: null,
    type: 'Ordered',
    amount: 0,
  });

  const [stopTrackingModal, setStopTrackingModal] = useState<{
    open: boolean;
    item: typeof items[0] | null;
    reason: string;
    remarks: string;
  }>({
    open: false,
    item: null,
    reason: "",
    remarks: "",
  });

  const handleStopTracking = () => {
    if (!stopTrackingModal.item) return;
    
    setItems((prev) =>
      prev.map((i) =>
        i.id === stopTrackingModal.item!.id
          ? { ...i, trackingStatus: "CLOSED", trackingReason: stopTrackingModal.reason, trackingRemarks: stopTrackingModal.remarks }
          : i
      )
    );
    setStopTrackingModal({ open: false, item: null, reason: "", remarks: "" });
  };

  const [startTrackingModal, setStartTrackingModal] = useState<{
    open: boolean;
    item: typeof items[0] | null;
  }>({
    open: false,
    item: null,
  });

  const confirmStartTracking = () => {
    if (!startTrackingModal.item) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === startTrackingModal.item!.id ? { ...i, trackingStatus: "ACTIVE" } : i
      )
    );
    setStartTrackingModal({ open: false, item: null });
  };

  if (!salesOrder) {
    return <div className="p-8">Sales Order not found</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/sales-orders">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fabric Requirement Tracking at Sales Order Line Level
          </h1>
          <p className="text-sm font-medium text-[#0453B8] mt-1">
            Sales Order: {salesOrder.soNo} - {salesOrder.productName} ({salesOrder.buyer})
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th className="px-5 py-4 font-bold text-slate-700">Line</th>
              <th className="px-5 py-4 font-bold text-slate-700">Fabric Details</th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center">Req. Qty<br/><span className="text-[11px] text-slate-500 font-medium">(Mtrs)</span></th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center">Total PO<br/>Ordered<br/><span className="text-[11px] text-slate-500 font-medium">(Mtrs)</span></th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center">Total Received<br/><span className="text-[11px] text-slate-500 font-medium">(Mtrs)</span></th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center">Balance Qty<br/><span className="text-[11px] text-slate-500 font-medium">(Mtrs)</span></th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center">Tracking Status</th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const reqQty = item.requiredQtyMtr;
              // Mocking Ordered/Received based on item ID for visual demonstration
              const ordered = item.id === 'line-3' ? reqQty : Math.floor(reqQty * 0.4);
              const received = item.id === 'line-3' ? reqQty : 0;
              const balance = reqQty - ordered;

              const status = item.trackingStatus || (ordered >= reqQty ? "COMPLETE" : "ACTIVE");
              
              return (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-bold text-slate-800 whitespace-nowrap">
                    {salesOrder.soNo} - L{index + 1}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{item.fabricBom?.type || "Cotton"}</span>
                      <span className="text-xs text-slate-500 mt-0.5">
                        {item.fabricBom?.gsm || "180"} GSM, {item.fabricBom?.width || "44"}", {item.color}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-medium">{reqQty.toFixed(2)}</td>
                  <td className="px-5 py-4 text-center font-bold">
                    <button 
                      className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-md hover:bg-blue-100 cursor-pointer border border-blue-200 shadow-sm transition-colors"
                      onClick={() => setDrillDownModal({ open: true, item, type: 'Ordered', amount: ordered })}
                    >
                      {ordered.toFixed(2)}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center font-bold">
                    <button 
                      className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-md hover:bg-blue-100 cursor-pointer border border-blue-200 shadow-sm transition-colors"
                      onClick={() => setDrillDownModal({ open: true, item, type: 'Received', amount: received })}
                    >
                      {received.toFixed(2)}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[#0453B8]">{balance.toFixed(2)}</td>
                  <td className="px-5 py-4 text-center">
                    {status === "ACTIVE" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> ACTIVE
                      </div>
                    )}
                    {status === "COMPLETE" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                        <Lock className="w-3 h-3" /> COMPLETE
                      </div>
                    )}
                    {status === "CLOSED" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> CLOSED
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {status === "ACTIVE" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[#0453B8] font-bold border-blue-200 hover:bg-blue-50"
                        onClick={() => setStopTrackingModal({ open: true, item, reason: "", remarks: "" })}
                      >
                        Stop Tracking
                      </Button>
                    )}
                    {status === "COMPLETE" && (
                      <span className="text-slate-400 font-medium">-</span>
                    )}
                    {status === "CLOSED" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-slate-700 font-bold border-slate-300 hover:bg-slate-100"
                        onClick={() => setStartTrackingModal({ open: true, item })}
                      >
                        Start Tracking
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                  No fabric requirements found for this Sales Order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stop Tracking Modal */}
      {stopTrackingModal.open && stopTrackingModal.item && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[500px] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                Stop Tracking
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-sm">
                <div className="flex gap-2 font-bold text-slate-800 mb-3 pb-3 border-b border-slate-200">
                  <span>Line: {salesOrder.soNo} - L{items.findIndex(i => i.id === stopTrackingModal.item!.id) + 1}</span>
                  <span className="text-slate-300">|</span>
                  <span>{stopTrackingModal.item.fabricBom?.type} {stopTrackingModal.item.color}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 font-medium">
                  <span className="text-slate-500">Required Qty</span>
                  <span>: {stopTrackingModal.item.requiredQtyMtr.toFixed(2)} Mtrs</span>
                  
                  <span className="text-slate-500">Ordered Qty</span>
                  <span>: {Math.floor(stopTrackingModal.item.requiredQtyMtr * 0.4).toFixed(2)} Mtrs</span>
                  
                  <span className="text-slate-500">Balance Qty</span>
                  <span className="text-[#0453B8] font-bold">: {(stopTrackingModal.item.requiredQtyMtr - Math.floor(stopTrackingModal.item.requiredQtyMtr * 0.4)).toFixed(2)} Mtrs</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Reason <span className="text-red-500">*</span></Label>
                <Select value={stopTrackingModal.reason} onValueChange={(val) => setStopTrackingModal({...stopTrackingModal, reason: val})}>
                  <SelectTrigger className="w-full h-10 border-slate-200 focus:ring-red-500">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fabric not available from supplier">Fabric not available from supplier</SelectItem>
                    <SelectItem value="Buyer cancelled style">Buyer cancelled style</SelectItem>
                    <SelectItem value="Short closed by management">Short closed by management</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Remarks (Optional)</Label>
                <Textarea 
                  value={stopTrackingModal.remarks}
                  onChange={(e) => setStopTrackingModal({...stopTrackingModal, remarks: e.target.value})}
                  className="min-h-[80px] border-slate-200 focus-visible:ring-red-500 text-sm placeholder:text-slate-400"
                  placeholder="Supplier discontinued this color."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStopTrackingModal({ open: false, item: null, reason: "", remarks: "" })} className="font-bold">
                Cancel
              </Button>
              <Button 
                onClick={handleStopTracking}
                disabled={!stopTrackingModal.reason}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Confirm - Stop Tracking
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Start Tracking Modal */}
      {startTrackingModal.open && startTrackingModal.item && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[500px] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Start Tracking Again</h3>
            </div>
            
            <div className="p-6 space-y-4 text-[13px]">
              <div className="grid grid-cols-[120px_1fr] gap-3 font-medium border-b border-slate-100 pb-4">
                <span className="text-slate-500 font-semibold">Line: {salesOrder.soNo} - L{items.findIndex(i => i.id === startTrackingModal.item!.id) + 1}</span>
                <span className="text-slate-800"><span className="text-slate-300 mx-1">|</span> {startTrackingModal.item.fabricBom?.type} {startTrackingModal.item.color}</span>
                
                <span className="text-slate-500 font-semibold">Current Status</span>
                <span className="text-red-500">: CLOSED (Tracking OFF)</span>
                
                <span className="text-slate-500 font-semibold">Balance Qty</span>
                <span className="text-[#0453B8] font-bold">: {(startTrackingModal.item.requiredQtyMtr - Math.floor(startTrackingModal.item.requiredQtyMtr * 0.4)).toFixed(2)} Mtrs</span>
              </div>

              <div className="pt-2 text-slate-700 font-medium leading-relaxed">
                <p>Do you want to start tracking this fabric requirement again?</p>
                <p>It will be shown in Fabric PO selection.</p>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 bg-white">
              <Button 
                variant="outline" 
                onClick={() => setStartTrackingModal({ open: false, item: null })} 
                className="font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmStartTracking}
                className="bg-[#0E7A3D] hover:bg-[#0b6330] text-white font-bold rounded-lg px-6 shadow-sm"
              >
                Start Tracking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drill Down Modal */}
      {drillDownModal.open && drillDownModal.item && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[600px] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                {drillDownModal.type === 'Ordered' ? 'Purchase Orders' : 'Goods Receipts (GRN)'} 
                <span className="text-slate-400 font-normal text-sm">for L{items.findIndex(i => i.id === drillDownModal.item!.id) + 1}</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setDrillDownModal({ open: false, item: null, type: 'Ordered', amount: 0 })} className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200">
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Total {drillDownModal.type}</p>
                  <p className="text-2xl font-bold text-[#0453B8]">{drillDownModal.amount.toFixed(2)} Mtrs</p>
                </div>
                <div className="text-right text-sm font-medium text-slate-600">
                  <p>{drillDownModal.item.fabricBom?.type}</p>
                  <p>{drillDownModal.item.color}</p>
                </div>
              </div>

              {drillDownModal.amount === 0 ? (
                <div className="text-center py-8 text-slate-500 font-medium bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                  No {drillDownModal.type.toLowerCase()} records found.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-bold text-slate-700">{drillDownModal.type === 'Ordered' ? 'PO No.' : 'GRN No.'}</th>
                        <th className="px-4 py-3 font-bold text-slate-700">Date</th>
                        <th className="px-4 py-3 font-bold text-slate-700">Supplier</th>
                        <th className="px-4 py-3 font-bold text-slate-700 text-right">Qty (Mtrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-[#0453B8] cursor-pointer hover:underline">{drillDownModal.type === 'Ordered' ? 'PO-2026-045' : 'GRN-2026-112'}</td>
                        <td className="px-4 py-3 text-slate-600">2026-06-10</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">Vardhman Textiles</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{(drillDownModal.amount * 0.6).toFixed(2)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-[#0453B8] cursor-pointer hover:underline">{drillDownModal.type === 'Ordered' ? 'PO-2026-048' : 'GRN-2026-115'}</td>
                        <td className="px-4 py-3 text-slate-600">2026-06-12</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">Arvind Mills</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{(drillDownModal.amount * 0.4).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
