import { useFormContext, useWatch } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function OrderSummaryPanel({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const { watch, register, setValue, control } = useFormContext<SalesOrder>();
  const products = useWatch({ control, name: "products", defaultValue: [] });
  const discountPercentage = watch("discountPercentage");
  const cgstRate = watch("cgstRate");
  const sgstRate = watch("sgstRate");
  const roundOff = watch("roundOff") || 0;

  const calculateProductQty = (p: any) => {
    return (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + 
           (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + 
           (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + 
           (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0);
  };

  const totalQty = products.reduce((acc, p) => acc + calculateProductQty(p), 0);

  const subTotal = products.reduce((acc, p) => {
    return acc + (calculateProductQty(p) * p.rate);
  }, 0);

  const discountAmount = (subTotal * (discountPercentage || 0)) / 100;
  const taxableAmount = subTotal - discountAmount;
  const cgstAmount = (taxableAmount * (cgstRate || 0)) / 100;
  const sgstAmount = (taxableAmount * (sgstRate || 0)) / 100;
  const grandTotal = taxableAmount + cgstAmount + sgstAmount + roundOff;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-slate-800 text-base mb-2">Order Summary</h3>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Sub Total</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(subTotal)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Discount</span>
          {isReadOnly ? (
            <span className="font-semibold text-slate-800 text-xs bg-slate-50 px-2 py-1 rounded">
              {discountPercentage}%
            </span>
          ) : (
            <div className="flex items-center">
              <Select defaultValue="%">
                <SelectTrigger className="h-8 w-[60px] rounded-r-none border-r-0 text-xs px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="%">%</SelectItem>
                  <SelectItem value="₹">₹</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                className="h-8 w-[60px] rounded-l-none text-xs px-2"
                {...register("discountPercentage", { valueAsNumber: true })}
              />
            </div>
          )}
        </div>
        <span className="font-semibold text-red-500">- ₹ {formatCurrency(discountAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>CGST ({cgstRate || 0}%)</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(cgstAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>SGST ({sgstRate || 0}%)</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(sgstAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Round Off</span>
        {isReadOnly ? (
          <span className="font-semibold text-slate-800">₹ {formatCurrency(roundOff)}</span>
        ) : (
          <div className="flex items-center">
            <span className="text-slate-500 mr-2 text-xs">₹</span>
            <Input
              type="number"
              step="0.01"
              className="h-8 w-[80px] text-xs px-2 text-right font-semibold text-slate-800"
              {...register("roundOff", { valueAsNumber: true })}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200 mt-1">
        <span>Grand Total</span>
        <span className="text-blue-700">₹ {formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
}
