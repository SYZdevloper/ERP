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
import { useState, useRef, useEffect } from "react";
import { MasterDialog } from "@/components/masters/master-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
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
  const [buyerSearchQuery, setBuyerSearchQuery] = useState("");
  const [isBuyerPopoverOpen, setIsBuyerPopoverOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
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
    diffDays = String(diff);
  }

  const defaultDays = ["15", "30", "45", "60", "90"];
  const selectDaysOptions = [...defaultDays];
  if (diffDays && !defaultDays.includes(diffDays) && !isNaN(parseInt(diffDays))) {
    selectDaysOptions.push(diffDays);
    selectDaysOptions.sort((a, b) => parseInt(a) - parseInt(b));
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
        <div className="flex flex-col gap-2 md:col-span-3 min-w-0 w-full">
          <Label htmlFor="buyerId" className="text-xs text-slate-500 font-medium">Buyer {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{selectedBuyer?.name || "-"}</div>
          ) : (
            <Controller
              control={control}
              name="buyerId"
              render={({ field }) => {
                const filteredBuyers = MOCK_BUYERS.filter(b => b.name.toLowerCase().includes(buyerSearchQuery.toLowerCase()));
                return (
                  <div className="relative">
                    <Input
                      id="buyerId"
                      value={isBuyerPopoverOpen ? buyerSearchQuery : (selectedBuyer?.name || "")}
                      onChange={(e) => {
                        setBuyerSearchQuery(e.target.value);
                        setIsBuyerPopoverOpen(true);
                        setHighlightedIndex(0);
                      }}
                      onFocus={() => {
                        setBuyerSearchQuery(selectedBuyer?.name || "");
                        setIsBuyerPopoverOpen(true);
                        setHighlightedIndex(0);
                      }}
                      onBlur={() => {
                        // small delay to allow click on dropdown items before closing
                        setTimeout(() => setIsBuyerPopoverOpen(false), 200);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          if (!isBuyerPopoverOpen) setIsBuyerPopoverOpen(true);
                          setHighlightedIndex(prev => Math.min(prev + 1, filteredBuyers.length - 1));
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setHighlightedIndex(prev => Math.max(prev - 1, 0));
                        } else if (e.key === "Enter") {
                          e.preventDefault();
                          if (isBuyerPopoverOpen && filteredBuyers[highlightedIndex]) {
                            field.onChange(filteredBuyers[highlightedIndex].id);
                            setIsBuyerPopoverOpen(false);
                            document.getElementById("buyerPoNo")?.focus();
                          } else if (!isBuyerPopoverOpen) {
                            document.getElementById("buyerPoNo")?.focus();
                          }
                        } else if (e.key === "Escape") {
                          setIsBuyerPopoverOpen(false);
                        }
                      }}
                      placeholder="Select Buyer..."
                      className={`h-[42px] pr-8 ${!field.value && "text-slate-500"}`}
                      autoComplete="off"
                      autoFocus={!isEditMode && !effectivelyReadOnly}
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />

                    {isBuyerPopoverOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[300px] flex flex-col overflow-hidden">
                        <div className="overflow-y-auto py-1 max-h-[200px]">
                          {filteredBuyers.map((buyer, idx) => (
                            <div
                              key={buyer.id}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 ${highlightedIndex === idx ? "bg-slate-100 font-medium" : ""} ${field.value === buyer.id ? "text-blue-600 font-medium" : ""}`}
                              onMouseDown={(e) => {
                                // use onMouseDown to prevent input blur before this fires
                                e.preventDefault();
                                field.onChange(buyer.id);
                                setIsBuyerPopoverOpen(false);
                                document.getElementById("buyerPoNo")?.focus();
                              }}
                            >
                              {buyerSearchQuery ? (
                                buyer.name.split(new RegExp(`(${buyerSearchQuery})`, 'gi')).map((part, i) =>
                                  part.toLowerCase() === buyerSearchQuery.toLowerCase() ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark> : <span key={i}>{part}</span>
                                )
                              ) : (
                                buyer.name
                              )}
                            </div>
                          ))}
                          {filteredBuyers.length === 0 && (
                            <div className="px-3 py-3 text-sm text-slate-500 text-center">No buyers found</div>
                          )}
                          <div className="h-px bg-slate-100 my-1" />
                          <div
                            className="px-3 py-2 text-sm cursor-pointer text-blue-600 font-medium hover:bg-blue-50 flex items-center gap-1.5"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIsBuyerDialogOpen(true);
                              setIsBuyerPopoverOpen(false);
                            }}
                          >
                            <Plus className="w-4 h-4" /> Add Buyer
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          )}

        </div>

        <div className="flex flex-col gap-2 md:col-span-2 w-full">
          <Label htmlFor="buyerPoNo" className="text-xs text-slate-500 font-medium">Buyer PO No. {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{watch("buyerPoNo") || "-"}</div>
          ) : (
            <Input id="buyerPoNo" {...register("buyerPoNo")} className="h-[42px] w-full" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("poDate")?.focus(); } }} />
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2 w-full">
          <Label htmlFor="poDate" className="text-xs text-slate-500 font-medium">PO Date {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {poDate ? format(new Date(poDate), "dd MMM yyyy") : "-"}
            </div>
          ) : (
            <Input id="poDate" type="date" className="h-[42px] text-sm w-full" value={poDate ? format(new Date(poDate), "yyyy-MM-dd") : ''} onChange={(e) => setValue("poDate", new Date(e.target.value))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("deliveryDate")?.focus(); } }} />
          )}
        </div>

        <div className="flex flex-row gap-2 md:col-span-3 w-full">
          <div className="flex flex-col gap-2 w-[40%]">
            <Label className="text-xs text-slate-500 font-medium whitespace-nowrap">No of Days</Label>
            {effectivelyReadOnly ? (
              <div className="text-sm font-semibold text-slate-900 mt-1">{diffDays ? `${diffDays} Days` : "-"}</div>
            ) : (
              <div className="flex items-center border border-slate-200 rounded-md bg-white h-[42px] focus-within:ring-2 focus-within:ring-[#0453B8]/50 focus-within:border-[#0453B8] overflow-hidden transition-all">
                <input 
                  type="number"
                  value={diffDays || ""}
                  onChange={(e) => {
                    const days = parseInt(e.target.value);
                    const currentPoDate = getValues("poDate");
                    if (currentPoDate && !isNaN(days)) {
                      const newDate = new Date(currentPoDate);
                      newDate.setDate(newDate.getDate() + days);
                      setValue("deliveryDate", newDate, { shouldValidate: true, shouldDirty: true });
                    } else if (isNaN(days)) {
                      // If empty, we can just let them clear it
                    }
                  }}
                  className="w-full h-full px-3 text-sm focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-slate-500 font-medium pr-3 select-none">Days</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-[60%]">
            <Label htmlFor="deliveryDate" className="text-xs text-slate-500 font-medium whitespace-nowrap">Delivery Date {!effectivelyReadOnly && <span className="text-red-500">*</span>}</Label>
            {effectivelyReadOnly ? (
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {deliveryDate ? format(new Date(deliveryDate), "dd MMM yyyy") : "-"}
              </div>
            ) : (
              <Input id="deliveryDate" type="date" className="h-[42px] text-sm w-full" value={deliveryDate ? format(new Date(deliveryDate), "yyyy-MM-dd") : ''} onChange={(e) => setValue("deliveryDate", new Date(e.target.value))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("fob")?.focus(); } }} />
            )}
          </div>
        </div>

        {/* FOB */}
        <div className="flex flex-col gap-2 md:col-span-2 w-full">
          <Label htmlFor="fob" className="text-xs text-slate-500 font-medium">FOB</Label>
          {effectivelyReadOnly ? (
            <div className="text-sm font-semibold text-slate-900 mt-1">{watch("fob") || "-"}</div>
          ) : (
            <Controller
              control={control}
              name="fob"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger 
                    id="fob" 
                    className="w-full h-[42px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Tab' && !e.shiftKey) {
                        e.preventDefault();
                        const el = document.getElementById("product-quick-add");
                        if (el) {
                          // Scroll into view if needed and focus
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          setTimeout(() => el.focus(), 100);
                        }
                      }
                    }}
                  >
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
          { name: "billingAddress", label: "Billing Address", type: "textarea", placeholder: "Street, City, State PIN", gridCols: 1 },
          { 
            name: "shippingAddresses", 
            label: "Shipping Address", 
            type: "custom", 
            gridCols: 1,
            render: (formData, handleChange) => {
              const addresses = formData.shippingAddresses || [""];
              return (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-600">Shipping Addresses</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-[#0453B8] px-2 py-0"
                      onClick={() => handleChange("shippingAddresses", [...addresses, ""])}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add New
                    </Button>
                  </div>
                  {addresses.map((addr: string, idx: number) => (
                    <div key={idx} className="relative">
                      <textarea 
                        placeholder={`Shipping Address ${idx + 1}`}
                        value={addr}
                        onChange={(e) => {
                          const newAddrs = [...addresses];
                          newAddrs[idx] = e.target.value;
                          handleChange("shippingAddresses", newAddrs);
                        }}
                        className="w-full min-h-[100px] text-sm font-medium border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0453B8] text-slate-900 bg-white resize-none rounded-md border p-3" 
                      />
                      {addresses.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newAddrs = addresses.filter((_: any, i: number) => i !== idx);
                            handleChange("shippingAddresses", newAddrs);
                          }}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
          },
          { 
            name: "defaultBrand", 
            label: "Default Brand", 
            type: "custom", 
            gridCols: 2,
            render: (formData, handleChange) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-600">Default Brand</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs text-[#0453B8] px-2 py-0">
                    <Plus className="w-3 h-3 mr-1" /> Add New Brand
                  </Button>
                </div>
                <Input 
                  type="text"
                  placeholder="e.g. Zara"
                  value={formData.defaultBrand || ""}
                  onChange={(e) => handleChange("defaultBrand", e.target.value)}
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-blue-50/30 border-blue-200" 
                />
              </div>
            )
          },
          { 
            name: "paymentTerms", 
            label: "Payment Terms", 
            type: "custom", 
            gridCols: 2,
            render: (formData, handleChange) => (
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="flex flex-col gap-2">
                  <select 
                    value={formData.paymentTerms || "Credit"}
                    onChange={(e) => handleChange("paymentTerms", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900 font-medium"
                  >
                    <option value="Credit">Credit</option>
                    <option value="Advance">Advance</option>
                    <option value="Against Delivery">Against Delivery</option>
                  </select>
                </div>
                {(!formData.paymentTerms || formData.paymentTerms === "Credit") && (
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="number"
                      placeholder="Credit Days (e.g. 30)"
                      value={formData.creditDays || ""}
                      onChange={(e) => handleChange("creditDays", e.target.value)}
                      className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                    />
                  </div>
                )}
                {formData.paymentTerms === "Advance" && (
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="number"
                      placeholder="Advance %"
                      value={formData.advancePercentage || ""}
                      onChange={(e) => handleChange("advancePercentage", e.target.value)}
                      className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                    />
                  </div>
                )}
              </div>
            )
          },
          { name: "transport", label: "Preferred Transport", type: "text", placeholder: "Preferred transport service" },
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
