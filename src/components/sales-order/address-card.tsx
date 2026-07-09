import { useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { MOCK_BUYERS } from "@/data/mock-sales-order";
import { LucideIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddressCardProps {
  type: "billing" | "shipping";
  icon: LucideIcon;
  title: string;
  isReadOnly?: boolean;
}

export function AddressCard({ type, icon: Icon, title, isReadOnly = false }: AddressCardProps) {
  const { control } = useFormContext<SalesOrder>();
  const buyerId = useWatch({ control, name: "buyerId" });
  const selectedBuyer = MOCK_BUYERS.find(b => b.id === buyerId);
  
  const [isAdded, setIsAdded] = useState(type === "billing");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (type === "shipping") {
      if (selectedBuyer?.shippingAddresses?.length) {
        setSelectedAddressId(selectedBuyer.shippingAddresses[0].id || "0");
      } else {
        setSelectedAddressId(null);
      }
    }
  }, [buyerId, selectedBuyer, type]);

  if (!selectedBuyer) {
    return (
      <div className="border border-slate-200 border-dashed rounded-lg p-5 flex-1 flex flex-col justify-center items-center text-center bg-slate-50/50 w-full min-h-[164px]">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <Icon className="w-8 h-8 mb-2 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No Buyer Selected</p>
          <p className="text-xs mt-1 text-slate-400">Select a buyer to view {title.toLowerCase()}</p>
        </div>
      </div>
    );
  }

  // Address resolution
  let address = null;
  const addressesList = type === "shipping" 
    ? selectedBuyer.shippingAddresses 
    : [selectedBuyer.billingAddress].filter(Boolean);

  if (type === "billing") {
    address = selectedBuyer.billingAddress;
    if (!address) {
      return (
        <div className="border border-slate-200 border-dashed rounded-lg p-5 flex-1 flex flex-col justify-center items-center text-center bg-slate-50/50 w-full min-h-[164px]">
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Icon className="w-8 h-8 mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No Billing Address</p>
          </div>
        </div>
      );
    }
  } else {
    // Shipping logic
    address = selectedBuyer.shippingAddress || selectedBuyer.billingAddress;
    if (addressesList?.length && selectedAddressId) {
      const found = addressesList.find((a, i) => (a.id || String(i)) === selectedAddressId);
      if (found) address = found;
    }
  }

  const isOptional = type === "shipping";

  if (isOptional && !isAdded) {
    return (
      <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col justify-center items-center text-center bg-white w-full min-h-[164px]">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              {title} <span className="text-slate-400 font-normal">(Optional)</span>
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center py-6">
            {isReadOnly ? (
              <span className="text-sm text-slate-500 font-medium">None provided</span>
            ) : (
              <Button 
                variant="outline" 
                className="text-blue-600 border-slate-200 bg-white hover:bg-slate-50 font-medium"
                onClick={(e) => { e.preventDefault(); setIsAdded(true); }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {title}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col bg-white w-full min-h-[164px] text-left">
      <div className="flex items-center justify-between mb-4 h-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[#0453B8]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
            {title} {!isOptional && <span className="text-red-500">*</span>}
            {isOptional && <span className="text-slate-400 font-normal">(Optional)</span>}
            {address?.isDefault && (
              <Badge variant="secondary" className="ml-2 bg-green-50 text-green-700 hover:bg-green-100 border-none h-5 px-2 text-[10px] font-bold uppercase tracking-wider">Default</Badge>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {type === "shipping" && !isReadOnly && addressesList && addressesList.length > 1 && (
            <Select value={selectedAddressId || ""} onValueChange={setSelectedAddressId}>
              <SelectTrigger className="h-8 text-xs bg-white w-[140px]">
                <SelectValue placeholder="Select address" />
              </SelectTrigger>
              <SelectContent>
                {addressesList.map((addr, i) => (
                  <SelectItem key={addr.id || i} value={addr.id || String(i)}>
                    {addr.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {type === "shipping" && !isReadOnly && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs shrink-0"
              onClick={(e) => { e.preventDefault(); setIsAdded(false); }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm text-slate-600 space-y-1 pl-11 flex-1">
        <p className="font-medium text-slate-900">{address?.companyName}</p>
        <p>{address?.addressLine1}{address?.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
        <p>{address?.city}, {address?.state} - {address?.pincode}, {address?.country}</p>
        {address?.gstin && <p className="text-slate-500 mt-2">GSTIN: {address.gstin}</p>}
      </div>
    </div>
  );
}
