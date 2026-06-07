"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { BillingAddressCard } from "@/components/sales-order/billing-address-card";
import { ShippingAddressCard } from "@/components/sales-order/shipping-address-card";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";
import { MOCK_BUYERS } from "@/data/mock-sales-order";
import { AddItemDialog } from "@/components/purchase-orders/add-item-dialog";
import { POItemsTable } from "@/components/purchase-orders/po-items-table";
import { POItem } from "@/types/purchase-order";
import { useRouter } from "next/navigation";

interface PurchaseOrderFormProps {
  initialPo?: any;
  isEditMode?: boolean;
  type: "Fabric" | "Trims";
  itemLabel: string; // e.g. "Material" or "Trim Item"
  specLabel?: string; // e.g. "GSM / Content" or "Specifications"
  itemOptions: string[]; // Options for dropdown
  backHref: string; // e.g. "/fabric-purchases"
}

export function PurchaseOrderForm({ 
  initialPo, 
  isEditMode = false,
  type,
  itemLabel,
  specLabel = "GSM / Content",
  itemOptions,
  backHref
}: PurchaseOrderFormProps) {
  const router = useRouter();
  
  const methods = useForm({
    defaultValues: {
      buyerId: initialPo?.buyerId || "b-3", // default to Zara Fashion
    }
  });

  const [poItems, setPoItems] = useState<POItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<POItem | null>(null);

  useEffect(() => {
    if (initialPo) {
      methods.reset({
        buyerId: initialPo.buyerId || "b-3"
      });
      const numericQty = parseInt((initialPo.qty || "0").toString().replace(/[^0-9]/g, "")) || 1200;
      const initialPOItem: POItem = {
        id: "item-1",
        material: initialPo.material || initialPo.itemDesc || (type === "Fabric" ? "Cotton 180gsm" : "5# Nylon Coil Zippers"),
        gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
        colorShade: "06-D.GREY",
        qty: numericQty,
        uom: type === "Fabric" ? "mtr" : "pcs",
        rate: initialPo.id === "FPO-5002" ? 185 : (initialPo.rate || 180),
        gst: initialPo.gst || 5,
        amount: numericQty * (initialPo.id === "FPO-5002" ? 185 : (initialPo.rate || 180)),
      };
      setPoItems([initialPOItem]);
    } else {
      setPoItems([]);
    }
  }, [initialPo, methods, type]);

  const handleAddItem = (item: POItem) => {
    if (editingItem) {
      setPoItems(poItems.map(i => i.id === item.id ? item : i));
    } else {
      setPoItems([...poItems, item]);
    }
  };

  const handleEditClick = (item: POItem) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setPoItems(poItems.filter(item => item.id !== itemId));
  };

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setIsAddDialogOpen(true);
  };

  const qtyByUom = poItems.reduce((acc, item) => {
    const uom = item.uom || (type === 'Fabric' ? 'mtr' : 'pcs');
    acc[uom] = (acc[uom] || 0) + (Number(item.qty) || 0);
    return acc;
  }, {} as Record<string, number>);

  const totalQtyDisplay = Object.keys(qtyByUom).length > 0 
    ? Object.entries(qtyByUom).map(([uom, qty]) => `${qty.toLocaleString('en-IN')} ${uom}`).join(' + ')
    : `0 ${type === 'Fabric' ? 'mtr' : 'pcs'}`;
  const subTotal = poItems.reduce((acc, item) => acc + item.amount, 0);
  const totalGst = poItems.reduce((acc, item) => acc + (item.amount * item.gst / 100), 0);
  const grandTotal = subTotal + totalGst;

  const handleSave = () => {
    router.push(backHref);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
          {/* Header */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={backHref} className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {isEditMode ? `Edit ${type} Purchase Order` : `New ${type} Purchase Order`}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {isEditMode ? `Edit details for purchase order ${initialPo?.id}` : `Create a new ${type.toLowerCase()} purchase order in simple steps`}
                  </p>
                </div>
              </div>
              <Link href={backHref}>
                <Button variant="outline" className="h-9 px-4 text-slate-700 bg-white">
                  <FileText className="w-4 h-4 mr-2" />
                  View POs
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-5">
            {/* Left Column (Main Content) */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              
              {/* 1. Supplier & PO Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">1</div>
                  <h2 className="text-sm font-bold text-slate-900">Supplier & PO Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <select 
                        defaultValue={initialPo?.supplier || (type === "Fabric" ? "Arvind Mills" : "YKK Zippers")}
                        className="w-full h-10 pl-3 pr-8 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] appearance-none bg-white font-medium truncate"
                      >
                        {type === "Fabric" ? (
                          <>
                            <option value="Arvind Mills">Arvind Mills</option>
                            <option value="Vardhman Textiles">Vardhman Textiles</option>
                            <option value="Raymond Fabrics">Raymond Fabrics</option>
                            <option value="Welspun">Welspun</option>
                          </>
                        ) : (
                          <>
                            <option value="YKK Zippers">YKK Zippers</option>
                            <option value="Laxmi Buttons">Laxmi Buttons</option>
                            <option value="Super Labels">Super Labels</option>
                            <option value="Vardhman Threads">Vardhman Threads</option>
                            <option value="Reliance Packaging">Reliance Packaging</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buyer <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <select 
                        {...methods.register("buyerId")}
                        className="w-full h-10 pl-3 pr-8 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] appearance-none bg-white text-slate-900 font-medium truncate"
                      >
                        <option className="text-slate-500" value="">Select Buyer</option>
                        {MOCK_BUYERS.map((buyer) => (
                          <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buyer PO No. <span className="text-red-500">*</span></Label>
                    <Input defaultValue="BPO-2026-1001" className="h-10 text-sm font-medium bg-white" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buyer PO Date <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input type="date" defaultValue="2026-06-01" className="h-10 text-sm font-medium bg-white" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Required Delivery <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select className="w-full h-10 px-2 rounded-md border border-slate-200 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0453B8] appearance-none bg-white font-medium pr-6">
                          <option>15 Days</option>
                          <option>30 Days</option>
                          <option>45 Days</option>
                          <option>60 Days</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <Input type="date" defaultValue={initialPo?.delivery || "2026-06-21"} className="h-10 text-[13px] font-medium px-2 bg-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Payment Terms</Label>
                    <div className="relative">
                      <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] appearance-none bg-white">
                        <option>30 days credit</option>
                        <option>50% advance</option>
                        <option>Cash on delivery</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Transport</Label>
                    <div className="relative">
                      <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] appearance-none bg-white">
                        <option>LOCAL</option>
                        <option>By Road</option>
                        <option>By Rail</option>
                        <option>By Air</option>
                        <option>Courier</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Place of Supply</Label>
                    <Input defaultValue="Gujarat (24)" className="h-10 text-sm bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Agent / Broker</Label>
                    <Input defaultValue="Nitin Bhai" className="h-10 text-sm bg-white" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 items-stretch">
                  <BillingAddressCard isReadOnly={false} />
                  <ShippingAddressCard isReadOnly={false} />
                </div>
              </div>

              {/* 2. Items Table (REUSED COMPONENT) */}
              <POItemsTable
                items={poItems}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteItem}
                onOpenAddDialog={handleOpenAddDialog}
                totalQtyDisplay={totalQtyDisplay}
                itemLabel={itemLabel}
                specLabel={specLabel}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* 3. Terms & Conditions */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">3</div>
                    <h2 className="text-sm font-bold text-slate-900">Terms & Conditions</h2>
                  </div>
                  <div className="flex-1">
                    <textarea 
                      className="w-full h-[120px] p-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0453B8] resize-y"
                      defaultValue={`${type} quality to be as per approved sample.\nDelivery should be completed within the committed timeline.\nPayment will be released after quality inspection.\nThis is a system generated PO, no signature required.`}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              {/* PO Summary Header */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#0453B8]">PO NUMBER</span>
                    <span className="text-sm font-bold text-slate-900">{initialPo?.id || (type === "Fabric" ? "FPO-1453" : "TPO-8006")}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-[#0453B8]">
                      {isEditMode ? "STATUS" : "PO DATE"}
                    </span>
                    <span className={`text-sm font-bold ${isEditMode ? "text-emerald-600" : "text-slate-900"}`}>
                      {isEditMode ? initialPo?.status : "06-Jun-2026"}
                    </span>
                  </div>
                </div>
              </div>

              <NotesPanel isReadOnly={false} />
              
              <AttachmentsModal isReadOnly={false} />

              {/* PO Summary Totals */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-5">PO Summary</h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Sub Total</span>
                    <span className="font-semibold text-slate-900">₹ {subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <div className="flex items-center gap-2">
                      <span>Discount</span>
                      <div className="flex border border-slate-200 rounded bg-white w-24 overflow-hidden">
                        <select className="w-10 px-1 border-r border-slate-200 bg-slate-50 text-xs focus:outline-none">
                          <option>%</option>
                        </select>
                        <input type="text" defaultValue="0" className="w-14 text-right px-2 text-xs focus:outline-none" />
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900">₹ 0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Total GST</span>
                    <span className="font-semibold text-slate-900">₹ {totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Freight</span>
                    <div className="flex items-center border border-slate-200 rounded bg-white w-24 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8] focus-within:border-[#0453B8]">
                      <span className="text-xs text-slate-500 font-medium flex-shrink-0">₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right pl-1 text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Round Off</span>
                    <div className="flex items-center border border-slate-200 rounded bg-white w-24 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8] focus-within:border-[#0453B8]">
                      <span className="text-xs text-slate-500 font-medium flex-shrink-0 whitespace-nowrap leading-none mt-0.5">±₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right pl-1 text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-900">Grand Total</span>
                    <span className="font-bold text-[#0453B8] text-lg">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
          <Button onClick={handleSave} variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium h-10 px-6">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 px-6">
            <FileText className="w-4 h-4 mr-2 opacity-70" /> {isEditMode ? "Update Draft" : "Save Draft"}
          </Button>
          <Button onClick={handleSave} className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm">
            {isEditMode ? "Save PO Changes" : "Send to Supplier"}
          </Button>
        </div>
        
        <AddItemDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddItem={handleAddItem}
          editItem={editingItem}
          itemOptions={itemOptions}
          itemLabel={itemLabel}
          specLabel={specLabel}
        />
      </div>
    </FormProvider>
  );
}
