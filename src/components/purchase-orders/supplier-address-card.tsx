import React from "react";
import { MapPin } from "lucide-react";

interface SupplierAddressCardProps {
  selectedSupplier: string;
  supplierAddressInfo: {
    line1: string;
    line2: string;
    gstin: string;
  } | null;
}

export function SupplierAddressCard({ selectedSupplier, supplierAddressInfo }: SupplierAddressCardProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col bg-white w-full min-h-[164px] text-left">
      <div className="flex items-center justify-between mb-4 h-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#0453B8]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
            Address Details <span className="text-red-500">*</span>
          </h3>
        </div>
      </div>
      {selectedSupplier && supplierAddressInfo ? (
        <div className="text-sm text-slate-600 space-y-1 pl-11 flex-1">
          <p className="font-medium text-slate-900">{selectedSupplier}</p>
          <p>{supplierAddressInfo.line1}</p>
          <p>{supplierAddressInfo.line2}</p>
          <p className="text-slate-500 mt-2">GSTIN: {supplierAddressInfo.gstin}</p>
        </div>
      ) : (
        <div className="text-sm text-slate-400 pl-11 flex-1 flex items-center mt-2">
          Please select a supplier to view their address details.
        </div>
      )}
    </div>
  );
}
