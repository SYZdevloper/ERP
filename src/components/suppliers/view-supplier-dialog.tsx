"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface ViewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}

export function ViewSupplierDialog({ open, onOpenChange, supplier }: ViewSupplierDialogProps) {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white p-0 overflow-hidden flex flex-col shadow-2xl border-0 rounded-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-slate-100 flex-shrink-0 relative">
          <DialogTitle className="text-xl font-bold text-slate-900 pr-8">{supplier.name}</DialogTitle>
          <p className="text-[13px] text-slate-500 mt-1">
            {supplier.code} &middot; {supplier.contactPerson}
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</span>
              <span className="text-sm font-semibold text-slate-900">{supplier.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
              <span className="text-sm font-semibold text-slate-900">{supplier.category}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">On-Time</span>
              <span className="text-sm font-semibold text-slate-900">{supplier.onTimePct}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejection</span>
              <span className="text-sm font-semibold text-slate-900">{supplier.rejectionPct}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open POs</span>
              <span className="text-sm font-semibold text-slate-900">{supplier.openPos}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-end rounded-b-xl z-10">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-9 px-6 font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
