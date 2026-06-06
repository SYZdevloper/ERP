import { useFormContext, Controller } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_BUYERS } from "@/data/mock-sales-order";
import { format, differenceInDays } from "date-fns";

export function BuyerOrderDetailsCard({ isReadOnly = false, isEditMode = false }: { isReadOnly?: boolean, isEditMode?: boolean }) {
  const { register, watch, setValue, getValues, control } = useFormContext<SalesOrder>();
  const buyerId = watch("buyerId");
  const poDate = watch("poDate");
  const deliveryDate = watch("deliveryDate");

  const selectedBuyer = MOCK_BUYERS.find(b => b.id === buyerId);
  
  // Calculate the difference in days for the Select
  let diffDays = "";
  if (poDate && deliveryDate) {
    const diff = differenceInDays(new Date(deliveryDate), new Date(poDate));
    if ([15, 30, 45, 60, 90].includes(diff)) {
      diffDays = String(diff);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
          <h2 className="text-base font-semibold text-slate-800">Buyer & Order Details</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-2 md:col-span-1">
          <Label htmlFor="buyerId" className="text-xs text-slate-500 font-medium">Buyer {!(isReadOnly || isEditMode) && <span className="text-red-500">*</span>}</Label>
          {(isReadOnly || isEditMode) ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{selectedBuyer?.name || "-"}</div>
          ) : (
            <Controller
              control={control}
              name="buyerId"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="buyerId" className="h-[42px]">
                    <SelectValue placeholder="Select Buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BUYERS.map(buyer => (
                      <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
          {selectedBuyer && !(isReadOnly || isEditMode) && (
            <div className="flex items-center gap-4 mt-1 text-xs">
              <span className="text-green-600">Credit Limit: ₹ {(selectedBuyer.creditLimit / 100000).toFixed(2)} L</span>
              <span className="text-green-600">Balance: ₹ {(selectedBuyer.balance / 100000).toFixed(2)} L</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="buyerPoNo" className="text-xs text-slate-500 font-medium">Buyer PO No. {!isReadOnly && <span className="text-red-500">*</span>}</Label>
          {isReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{watch("buyerPoNo") || "-"}</div>
          ) : (
            <Input id="buyerPoNo" {...register("buyerPoNo")} className="h-[42px]" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="poDate" className="text-xs text-slate-500 font-medium">PO Date {!isReadOnly && <span className="text-red-500">*</span>}</Label>
          {isReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {poDate ? format(new Date(poDate), "dd MMM yyyy") : "-"}
            </div>
          ) : (
            <Input id="poDate" type="date" className="h-[42px] text-sm" value={poDate ? format(new Date(poDate), "yyyy-MM-dd") : ''} onChange={(e) => setValue("poDate", new Date(e.target.value))} />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deliveryDate" className="text-xs text-slate-500 font-medium">Delivery Date {!isReadOnly && <span className="text-red-500">*</span>}</Label>
          {isReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {deliveryDate ? format(new Date(deliveryDate), "dd MMM yyyy") : "-"}
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
