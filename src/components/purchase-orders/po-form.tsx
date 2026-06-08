"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ArrowLeft, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";
import { MOCK_BUYERS, MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { AddItemDialog } from "@/components/purchase-orders/add-item-dialog";
import { POItemsTable } from "@/components/purchase-orders/po-items-table";
import { POItem } from "@/types/purchase-order";
import { useRouter } from "next/navigation";
import { SelectSalesOrderItemsDialog } from "@/components/purchase-orders/select-so-items-dialog";

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
      supplier: initialPo?.supplier || (type === "Fabric" ? "Arvind Mills" : "YKK Zippers"),
    }
  });

  const [poItems, setPoItems] = useState<POItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<POItem | null>(null);
  
  const [isSelectSoItemDialogOpen, setIsSelectSoItemDialogOpen] = useState(false);
  const [selectedSoItemContext, setSelectedSoItemContext] = useState<any>(null);

  useEffect(() => {
    if (initialPo) {
      methods.reset({
        buyerId: initialPo.buyerId || "b-3"
      });
      const numericQty = parseInt((initialPo.qty || "0").toString().replace(/[^0-9]/g, "")) || 1200;
      const rate = initialPo?.id === "FPO-5002" ? 185 : (initialPo?.rate || 180);
      const baseMaterial = initialPo?.material || initialPo?.itemDesc || (type === "Fabric" ? "Cotton Fabric" : "5# Nylon Coil Zippers");
      
      const qty1 = Math.floor(numericQty * 0.4);
      const qty2 = Math.floor(numericQty * 0.4);
      const qty3 = numericQty - qty1 - qty2;

      setPoItems([
        {
          id: "item-1",
          material: baseMaterial,
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: "Grey",
          requiredQty: Math.floor(qty1 * 0.95),
          qty: qty1,
          buffer: qty1 - Math.floor(qty1 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty1 * rate,
        },
        {
          id: "item-2",
          material: baseMaterial,
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: "Navy",
          requiredQty: Math.floor(qty2 * 0.95),
          qty: qty2,
          buffer: qty2 - Math.floor(qty2 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty2 * rate,
        },
        {
          id: "item-3",
          material: baseMaterial,
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: "White",
          requiredQty: Math.floor(qty3 * 0.95),
          qty: qty3,
          buffer: qty3 - Math.floor(qty3 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty3 * rate,
        }
      ]);
    } else {
      setPoItems([]);
    }
  }, [initialPo, methods, type]);

  const handleAddItem = (item: POItem) => {
    if (editingItem) {
      setPoItems(poItems.map(i => i.id === item.id ? item : i));
    } else {
      setPoItems([...poItems, { ...item, soItemId: selectedSoItemContext?.id }]);
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
    setSelectedSoItemContext(null);
    setIsSelectSoItemDialogOpen(true);
  };

  const handleSoItemNext = (soItem: any) => {
    setSelectedSoItemContext(soItem);
    setIsSelectSoItemDialogOpen(false);
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

  const selectedSupplier = methods.watch("supplier") as string;
  const SUPPLIER_ADDRESSES: Record<string, { line1: string, line2: string, gstin: string }> = {
    "Arvind Mills": { line1: "Naroda Road, Near Railway Station", line2: "Ahmedabad, Gujarat - 380025, India", gstin: "24AABCA1234F1Z5" },
    "Vardhman Textiles": { line1: "Chandigarh Road", line2: "Ludhiana, Punjab - 141010, India", gstin: "03AAACV1234F1Z5" },
    "Raymond Fabrics": { line1: "Panchgram, Post Office - Khaperkheda", line2: "Chhindwara, MP - 480106, India", gstin: "23AABCR1234F1Z5" },
    "Welspun": { line1: "Welspun City, Village Versamedi", line2: "Anjar, Gujarat - 370110, India", gstin: "24AABCW1234F1Z5" },
    "YKK Zippers": { line1: "Sector-3, HSIIDC Industrial Estate", line2: "Bawal, Haryana - 123501, India", gstin: "06AABCY1234F1Z5" },
    "Laxmi Buttons": { line1: "15, Mangaldas Road, Lohar Chawl", line2: "Mumbai, Maharashtra - 400002, India", gstin: "27AABCL1234F1Z5" },
    "Super Labels": { line1: "Plot No. 45, Udyog Vihar Phase 1", line2: "Gurugram, Haryana - 122016, India", gstin: "06AABCS1234F1Z5" },
    "Vardhman Threads": { line1: "Chandigarh Road", line2: "Ludhiana, Punjab - 141010, India", gstin: "03AAACV1234F1Z5" },
    "Reliance Packaging": { line1: "Reliance Corporate Park, Ghansoli", line2: "Navi Mumbai, Maharashtra - 400701, India", gstin: "27AABCR1234F1Z5" },
  };
  const supplierAddressInfo = SUPPLIER_ADDRESSES[selectedSupplier] || SUPPLIER_ADDRESSES["Arvind Mills"];

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
                
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-9 gap-6 mb-6">
                  <div className="flex flex-col gap-2 col-span-1 md:col-span-2 xl:col-span-2">
                    <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <select 
                        {...methods.register("supplier")}
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

                  <div className="flex flex-col gap-1 col-span-1 md:col-span-2 xl:col-span-3">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-slate-600">Sales Order (Buyer & Product) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <select 
                          {...methods.register("buyerId")}
                          className="w-full h-10 pl-3 pr-8 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] appearance-none bg-white text-slate-900 font-medium truncate"
                        >
                          <option className="text-slate-500" value="">Select Sales Order</option>
                          {MOCK_SALES_ORDERS_LIST.map((so, i) => (
                            <option key={so.id} value={so.id}>
                              {so.soNo} - {so.buyer} - {["Men's Polo T-Shirt", "Casual Shirt", "Denim Jacket", "Slim Fit Trouser"][i % 4]}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 mt-0.5 tracking-tight px-1">Payment Terms: 30 days credit</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Place of Supply</Label>
                    <Input defaultValue="Gujarat (24)" className="h-10 text-sm bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Agent / Broker</Label>
                    <Input defaultValue="Nitin Bhai" className="h-10 text-sm bg-white" />
                  </div>
                  
                  <div className="flex flex-col gap-2 col-span-1 md:col-span-2 xl:col-span-2">
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

                <div className="flex flex-col md:flex-row gap-5 items-stretch mt-2">
                  {/* Supplier Address */}
                  <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col bg-white w-full min-h-[164px] text-left">
                    <div className="flex items-center justify-between mb-4 h-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#0453B8]" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                          Supplier Address <span className="text-red-500">*</span>
                        </h3>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1 pl-11 flex-1">
                      <p className="font-medium text-slate-900">{selectedSupplier}</p>
                      <p>{supplierAddressInfo.line1}</p>
                      <p>{supplierAddressInfo.line2}</p>
                      <p className="text-slate-500 mt-2">GSTIN: {supplierAddressInfo.gstin}</p>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col bg-white w-full min-h-[164px]">
                    <div className="flex items-center gap-3 mb-4 h-8">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-[#0453B8]" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Terms & Conditions
                      </h3>
                    </div>
                    <div className="flex-1">
                      <textarea 
                        className="w-full h-full min-h-[80px] p-0 text-sm text-slate-700 bg-transparent border-0 focus:outline-none resize-none leading-relaxed"
                        defaultValue={`${type} quality to be as per approved sample.\nDelivery should be completed within the committed timeline.\nPayment will be released after quality inspection.\nThis is a system generated PO, no signature required.`}
                      />
                    </div>
                  </div>
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
          itemOptions={type === "Fabric" ? ["Cotton Fabric", "Linen"] : itemOptions}
          itemLabel={itemLabel}
          specLabel={specLabel}
          type={type}
          initialValues={selectedSoItemContext ? {
            requiredQty: selectedSoItemContext.requiredQtyMtr,
            qty: selectedSoItemContext.requiredQtyMtr,
            colorShade: selectedSoItemContext.color,
            material: type === "Fabric" ? "Cotton Fabric" : selectedSoItemContext.name,
          } : undefined}
        />

        <SelectSalesOrderItemsDialog 
          open={isSelectSoItemDialogOpen}
          onOpenChange={setIsSelectSoItemDialogOpen}
          buyerId={methods.watch("buyerId")}
          existingPoItems={poItems}
          onNext={handleSoItemNext}
        />
      </div>
    </FormProvider>
  );
}
