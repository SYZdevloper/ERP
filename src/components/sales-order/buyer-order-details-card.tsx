import { useFormContext, Controller, useWatch } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { MOCK_BUYERS } from "@/data/mock-sales-order";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import { MasterDialog } from "@/components/masters/master-dialog";
export function BuyerOrderDetailsCard({ 
  isReadOnly = false, 
  isEditMode = false,
  isSectionLocked = false,
  onToggleEdit
}: { 
  isReadOnly?: boolean, 
  isEditMode?: boolean,
  isSectionLocked?: boolean,
  onToggleEdit?: () => void
}) {
  const [isBuyerDialogOpen, setIsBuyerDialogOpen] = useState(false);
  const { register, watch, setValue, getValues, control } = useFormContext<SalesOrder>();
  const buyerId = useWatch({ control, name: "buyerId" });
  const poDate = watch("poDate");
  const deliveryDate = watch("deliveryDate");
  const orderId = watch("salesOrderNo")?.replace("SO-", "") || "1";

  const selectedBuyer = MOCK_BUYERS.find(b => b.id === buyerId);
  
  // Calculate the difference in days for the Select
  let diffDays = "";
  if (poDate && deliveryDate) {
    const diff = differenceInDays(new Date(deliveryDate), new Date(poDate));
    if ([15, 30, 45, 60, 90].includes(diff)) {
      diffDays = String(diff);
    }
  }

  const effectivelyReadOnly = isReadOnly;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
          <h2 className="text-base font-semibold text-slate-800">Buyer & Order Details</h2>
        </div>
        {onToggleEdit && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onToggleEdit} 
            className={`h-8 px-3 font-medium ${!isSectionLocked ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100' : 'text-[#0453B8] hover:text-[#0453B8] hover:bg-blue-50'}`}
          >
            {!isSectionLocked ? "Lock Details" : (
              <>
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit Details
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="flex flex-col gap-2 md:col-span-4 min-w-0 w-full">
          <Label htmlFor="buyerId" className="text-xs text-slate-500 font-medium">Buyer {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{selectedBuyer?.name || "-"}</div>
          ) : (
            <Controller
              control={control}
              name="buyerId"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={(val) => {
                  if (val === "add_new_buyer") {
                    setIsBuyerDialogOpen(true);
                    return;
                  }
                  field.onChange(val);
                }}>
                  <SelectTrigger id="buyerId" className="w-full h-[42px]">
                    <SelectValue className="truncate" placeholder="Select Buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BUYERS.map(buyer => (
                      <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
                    ))}
                    <div className="h-px bg-slate-100 my-1" />
                    <SelectItem value="add_new_buyer" className="text-blue-600 font-medium focus:text-blue-700 focus:bg-blue-50 cursor-pointer">
                      + Add Buyer
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
          {selectedBuyer && !effectivelyReadOnly && (
            <div className="flex items-center gap-4 mt-1 text-xs">
              <span className="text-green-600">Credit Limit: ₹ {(selectedBuyer.creditLimit / 100000).toFixed(2)} L</span>
              <span className="text-green-600">Balance: ₹ {(selectedBuyer.balance / 100000).toFixed(2)} L</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-3 w-full">
          <Label htmlFor="buyerPoNo" className="text-xs text-slate-500 font-medium">Buyer PO No. {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{watch("buyerPoNo") || "-"}</div>
          ) : (
            <Input id="buyerPoNo" {...register("buyerPoNo")} className="h-[42px] w-full" />
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2 w-full">
          <Label htmlFor="poDate" className="text-xs text-slate-500 font-medium">PO Date {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {poDate ? format(new Date(poDate), "dd MMM yyyy") : "-"}
            </div>
          ) : (
            <Input id="poDate" type="date" className="h-[42px] text-sm w-full" value={poDate ? format(new Date(poDate), "yyyy-MM-dd") : ''} onChange={(e) => setValue("poDate", new Date(e.target.value))} />
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-3 w-full">
          <Label htmlFor="deliveryDate" className="text-xs text-slate-500 font-medium">Delivery Date {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {deliveryDate ? format(new Date(deliveryDate), "dd MMM yyyy") : "-"}
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <Select value={diffDays || undefined} onValueChange={(val) => {
                const days = parseInt(val);
                const currentPoDate = getValues("poDate");
                if (currentPoDate) {
                  const newDate = new Date(currentPoDate);
                  newDate.setDate(newDate.getDate() + days);
                  setValue("deliveryDate", newDate, { shouldValidate: true, shouldDirty: true });
                }
              }}>
                <SelectTrigger className="h-[42px] w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="45">45 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Input id="deliveryDate" type="date" className="h-[42px] text-sm flex-1" value={deliveryDate ? format(new Date(deliveryDate), "yyyy-MM-dd") : ''} onChange={(e) => setValue("deliveryDate", new Date(e.target.value))} />
            </div>
          )}
        </div>

        {/* Second Row */}
        <div className="flex flex-col gap-2 md:col-start-5 md:col-span-3 w-full">
          <Label htmlFor="fob" className="text-xs text-slate-500 font-medium">FOB</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{watch("fob") || "-"}</div>
          ) : (
            <Controller
              control={control}
              name="fob"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="fob" className="w-full h-[42px]">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOB">FOB</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="TOPAY">TOPAY</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </div>
      </div>
      
      <MasterDialog 
        title="Buyer"
        open={isBuyerDialogOpen} 
        onOpenChange={setIsBuyerDialogOpen} 
        initialData={null}
        fields={[
          { name: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Enter full company name" },
          { name: "gstNumber", label: "GST Number", type: "text", required: true, placeholder: "e.g. 22AAAAA0000A1Z5" },
          { name: "logo", label: "Buyer Logo", type: "image", gridCols: 2 },
          { name: "accountDeptNo", label: "Account Dept Number", type: "text" },
          { name: "warehouseDeptNo", label: "Warehouse Dept Number", type: "text" },
          { name: "transport", label: "Transport", type: "text", placeholder: "Preferred transport service" },
          { name: "creditTerms", label: "Credit Terms", type: "text", placeholder: "e.g. 30 Days, 60 Days" },
          { name: "defaultAgent", label: "Agent by Default", type: "text" },
          { name: "defaultBrand", label: "Default Brand", type: "text", placeholder: "e.g. Zara" },
          { name: "billingAddress", label: "Billing Address", type: "textarea", placeholder: "Street, City, State PIN" },
          { name: "shippingAddress", label: "Shipping Address", type: "textarea", placeholder: "Street, City, State PIN" },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes" },
        ]}
        onSave={(data) => {
          console.log("New Buyer Data:", data);
          // Typically you would save the new buyer to your backend or state here.
          // For now, we just close the dialog.
          setIsBuyerDialogOpen(false);
        }} 
      />
    </div>
  );
}
