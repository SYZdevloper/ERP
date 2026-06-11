"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ArrowLeft, FileText, MapPin, CheckCircle2, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";
import { MOCK_BUYERS, MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { AddItemDialog } from "@/components/purchase-orders/add-item-dialog";
import { POItemsTable } from "@/components/purchase-orders/po-items-table";
import { POItem } from "@/types/purchase-order";
import { useRouter } from "next/navigation";
import { SelectSalesOrderItemsDialog, ALL_SO_ITEMS } from "@/components/purchase-orders/select-so-items-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      supplier: initialPo?.supplier || "",
    }
  });

  const [poItems, setPoItems] = useState<POItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<POItem | null>(null);
  
  const [isSelectSoItemDialogOpen, setIsSelectSoItemDialogOpen] = useState(false);
  const [selectedSoItemContext, setSelectedSoItemContext] = useState<any>(null);

  const [selectedBuyerId, setSelectedBuyerId] = useState<string>("");
  const [isLinkedToSo, setIsLinkedToSo] = useState<boolean>(true);
  const [selectedTrimItem, setSelectedTrimItem] = useState<string>("");

  const [showAddress, setShowAddress] = useState(true);

  useEffect(() => {
    if (poItems.length > 0) setShowAddress(false);
    else setShowAddress(true);
  }, [poItems.length]);

  useEffect(() => {
    if (initialPo) {
      methods.reset({
        ...initialPo,
        buyerId: initialPo.buyerId || "b-3",
        supplier: initialPo.supplier || ""
      });
      
      // Restore Buyer dropdown — use buyer name directly (matches MOCK_SALES_ORDERS_LIST)
      if (initialPo.buyer) {
        setSelectedBuyerId(initialPo.buyer);
      } else {
        // Fallback: look up from MOCK_BUYERS by id
        const buyerObj = MOCK_BUYERS.find(b => b.id === (initialPo.buyerId || "b-3"));
        if (buyerObj) setSelectedBuyerId(buyerObj.name);
      }

      // Restore pre-selected Sales Order IDs (comma-separated)
      if (initialPo.soIds) {
        methods.setValue("buyerId", initialPo.soIds);
      }

      if (type === "Trims" && initialPo.trimItem) {
        setSelectedTrimItem(initialPo.trimItem);
      }

      const numericQty = parseInt((initialPo.qty || "0").toString().replace(/[^0-9]/g, "")) || 1200;
      const rate = initialPo?.id === "FPO-5002" ? 185 : (initialPo?.rate || 180);
      const baseMaterial = initialPo?.material || initialPo?.itemDesc || (type === "Fabric" ? "Cotton Fabric" : "Button");
      
      const qty1 = Math.floor(numericQty * 0.4);
      const qty2 = Math.floor(numericQty * 0.4);
      const qty3 = numericQty - qty1 - qty2;
      const defaultDeliveryDate = initialPo?.delivery || "2026-06-21";
      
      setPoItems([
        {
          id: "item-1",
          material: type === "Fabric" ? baseMaterial : "Button",
          code: type === "Fabric" ? undefined : "BTN-18L-BLK",
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: type === "Fabric" ? "Grey" : "Black",
          requiredQty: Math.floor(qty1 * 0.95),
          qty: qty1,
          buffer: qty1 - Math.floor(qty1 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty1 * rate,
          deliveryDate: defaultDeliveryDate,
        },
        {
          id: "item-2",
          material: type === "Fabric" ? baseMaterial : "Label",
          code: type === "Fabric" ? undefined : "LBL-WVN-ZRA",
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: type === "Fabric" ? "Navy" : "Navy / White",
          requiredQty: Math.floor(qty2 * 0.95),
          qty: qty2,
          buffer: qty2 - Math.floor(qty2 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty2 * rate,
          deliveryDate: defaultDeliveryDate,
        },
        {
          id: "item-3",
          material: type === "Fabric" ? baseMaterial : "Hangtag",
          code: type === "Fabric" ? undefined : "HTG-PRM-BLK",
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: type === "Fabric" ? "White" : "Black",
          requiredQty: Math.floor(qty3 * 0.95),
          qty: qty3,
          buffer: qty3 - Math.floor(qty3 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty3 * rate,
          deliveryDate: defaultDeliveryDate,
        }
      ]);
    } else {
      setPoItems([]);
    }
  }, [initialPo, methods, type]);

  const handleAddItem = (item: POItem) => {
    if (editingItem) {
      setPoItems(prev => prev.map(i => i.id === item.id ? item : i));
    } else if (type === "Trims") {
      // Group by Trim Item + Code + Color — merge qty if same combination exists
      // Use functional updater to always read latest state (avoids stale closure bug)
      setPoItems(prev => {
        const existing = prev.find(
          i => i.material === item.material && i.code === item.code && i.colorShade === item.colorShade
        );
        if (existing) {
          return prev.map(i =>
            i.id === existing.id
              ? {
                  ...i,
                  qty: i.qty + item.qty,
                  requiredQty: (i.requiredQty || 0) + (item.requiredQty || 0),
                  buffer: (i.buffer || 0) + (item.buffer || 0),
                  amount: (i.qty + item.qty) * i.rate,
                }
              : i
          );
        } else {
          return [{ ...item, soItemId: selectedSoItemContext?.id }, ...prev];
        }
      });
    } else {
      setPoItems(prev => [{ ...item, soItemId: selectedSoItemContext?.id }, ...prev]);
    }
  };


  const handleEditClick = (item: POItem) => {
    setEditingItem(item);
    if (item.soItemId) {
      const found = ALL_SO_ITEMS.find(so => so.id === item.soItemId);
      if (found) setSelectedSoItemContext(found);
    }
    setIsAddDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setPoItems(poItems.filter(item => item.id !== itemId));
  };

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setSelectedSoItemContext(null);
    
    // If not linked to a sales order (e.g., sample PO), skip the SO selection dialog
    if (!isLinkedToSo) {
      setIsAddDialogOpen(true);
    } else {
      // If linked to a sales order, show the SO item selection dialog first
      setIsSelectSoItemDialogOpen(true);
    }
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
  const selectedSoIds = (methods.watch("buyerId") || "").split(",").filter(Boolean);

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
                
                <div className={`grid grid-cols-1 md:grid-cols-3 ${type === "Trims" ? "xl:grid-cols-5" : "xl:grid-cols-4"} gap-5 mb-6`}>
                  {/* Supplier */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Select 
                        value={methods.watch("supplier") || ""}
                        onValueChange={(val) => methods.setValue("supplier", val)}
                      >
                        <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium truncate">
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {type === "Fabric" ? (
                            <>
                              <SelectItem value="Arvind Mills">Arvind Mills</SelectItem>
                              <SelectItem value="Vardhman Textiles">Vardhman Textiles</SelectItem>
                              <SelectItem value="Raymond Fabrics">Raymond Fabrics</SelectItem>
                              <SelectItem value="Welspun">Welspun</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="YKK Zippers">YKK Zippers</SelectItem>
                              <SelectItem value="Laxmi Buttons">Laxmi Buttons</SelectItem>
                              <SelectItem value="Super Labels">Super Labels</SelectItem>
                              <SelectItem value="Vardhman Threads">Vardhman Threads</SelectItem>
                              <SelectItem value="Reliance Packaging">Reliance Packaging</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buyer <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Select
                        value={selectedBuyerId || ""}
                        onValueChange={(val) => { setSelectedBuyerId(val); methods.setValue("buyerId", ""); }}
                      >
                        <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium truncate">
                          <SelectValue placeholder="Select Buyer" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(MOCK_SALES_ORDERS_LIST.map(so => so.buyer))).map(buyer => (
                            <SelectItem key={buyer} value={buyer}>{buyer}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sales Order */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={isLinkedToSo} 
                        onChange={(e) => {
                          setIsLinkedToSo(e.target.checked);
                          if (!e.target.checked) {
                            methods.setValue("buyerId", "");
                          }
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] cursor-pointer"
                      />
                      <span className="cursor-pointer" onClick={() => setIsLinkedToSo(!isLinkedToSo)}>
                        Link to Sales Order {isLinkedToSo && <span className="text-red-500">*</span>}
                      </span>
                    </Label>
                    <div className="relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            disabled={!isLinkedToSo || !selectedBuyerId}
                            className="w-full justify-between h-10 border-slate-200 text-sm font-normal truncate disabled:opacity-50 disabled:cursor-not-allowed bg-white px-3"
                          >
                            {selectedSoIds.length > 0 
                              ? `${selectedSoIds.length} order${selectedSoIds.length > 1 ? "s" : ""} selected` 
                              : <span className="text-muted-foreground">Select Sales Orders</span>}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[600px] max-h-[500px] flex flex-col p-0 shadow-2xl rounded-xl border-slate-200 overflow-hidden" align="start">
                          {(() => {
                            const filteredSalesOrders = MOCK_SALES_ORDERS_LIST.filter(so => !selectedBuyerId || so.buyer === selectedBuyerId);
                            const allSelected = filteredSalesOrders.length > 0 && selectedSoIds.length === filteredSalesOrders.length;
                            
                            return (
                              <>
                                <div className="overflow-y-auto p-4 flex-1 custom-scrollbar">
                                  <div className="grid grid-cols-2 gap-4">
                                    {filteredSalesOrders.map((so, i) => {
                                      const soName = `${so.soNo} — ${["Men's Polo T-Shirt", "Casual Shirt", "Denim Jacket", "Slim Fit Trouser"][i % 4]}`;
                                      const imgUrls = [
                                        "/men casual tshirt.jpeg",
                                        "/men casual half shirt.jpg",
                                        "/mens casual full sleeve shirt.jpg",
                                        "/men regualr fit shirt.jpeg"
                                      ];
                                      const imgUrl = imgUrls[i % 4];
                                      const isSelected = selectedSoIds.includes(so.id);
                                      
                                      return (
                                        <DropdownMenuItem
                                          key={so.id}
                                          onSelect={(e) => {
                                            e.preventDefault();
                                            const newIds = !isSelected 
                                              ? [...selectedSoIds, so.id] 
                                              : selectedSoIds.filter((id: string) => id !== so.id);
                                            methods.setValue("buyerId", newIds.join(","));
                                          }}
                                          className={`relative p-0 flex flex-col items-start rounded-xl overflow-hidden cursor-pointer transition-all border-2 !bg-transparent focus:!bg-transparent ${
                                            isSelected ? 'border-[#0453B8] ring-4 ring-[#0453B8]/10' : 'border-slate-200 hover:border-[#0453B8]/50 hover:shadow-lg'
                                          }`}
                                        >
                                          <div className="h-44 w-full relative group overflow-hidden bg-slate-100 flex items-center justify-center p-2">
                                            <img src={imgUrl} alt={soName} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />
                                            
                                            <div className="absolute top-3 right-3 z-10">
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-md ${isSelected ? 'bg-[#0453B8] text-white border border-[#0453B8]' : 'bg-white/90 border border-slate-300'}`}>
                                                {isSelected && <Check className="w-4 h-4" />}
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="w-full p-3.5 bg-white flex flex-col items-start border-t border-slate-100">
                                            <span className="text-[#0453B8] font-bold text-[11px] uppercase tracking-wider mb-1">{so.soNo}</span>
                                            <span className="text-slate-900 font-bold text-[15px] truncate w-full leading-tight">{["Men's Polo T-Shirt", "Casual Shirt", "Denim Jacket", "Slim Fit Trouser"][i % 4]}</span>
                                          </div>
                                        </DropdownMenuItem>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between shrink-0 items-center">
                                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-slate-700 hover:text-[#0453B8] transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] cursor-pointer"
                                      checked={allSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          methods.setValue("buyerId", filteredSalesOrders.map(so => so.id).join(","));
                                        } else {
                                          methods.setValue("buyerId", "");
                                        }
                                      }}
                                    />
                                    Select All Orders
                                  </label>
                                  
                                  <DropdownMenuItem
                                    disabled={selectedSoIds.length === 0}
                                    onSelect={() => setIsSelectSoItemDialogOpen(true)}
                                    className="bg-[#0453B8] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-md flex items-center justify-center cursor-pointer transition-colors focus:bg-blue-700 focus:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Save & Select Items <ArrowRight className="w-4 h-4 ml-2" />
                                  </DropdownMenuItem>
                                </div>
                              </>
                            );
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {methods.watch("buyerId") && (
                      <span className="text-[11px] font-bold text-emerald-600 tracking-tight px-0.5">Payment Terms: 30 days credit</span>
                    )}
                  </div>

                  {/* Trim Item (Only for Trims) */}
                  {type === "Trims" && (
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-slate-600">Trim Item</Label>
                      <div className="relative">
                        <Select value={selectedTrimItem} onValueChange={setSelectedTrimItem}>
                          <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium truncate">
                            <SelectValue placeholder="Select Trim Item" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Button">Button</SelectItem>
                            <SelectItem value="Label">Label</SelectItem>
                            <SelectItem value="Hangtag">Hangtag</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}



                  {/* Agent / Broker */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Agent / Broker</Label>
                    <Input defaultValue="Nitin Bhai" className="h-10 text-sm bg-white" />
                  </div>
                </div>


                <div className="flex items-center justify-between mt-4">
                  <h3 className="text-sm font-bold text-slate-800">Supplier Address</h3>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-[#0453B8] font-bold h-8 text-xs hover:bg-blue-50"
                  >
                    {showAddress ? "Hide Address" : "Unhide Address"}
                  </Button>
                </div>
                
                {showAddress && (
                  <div className="flex flex-col md:flex-row gap-5 items-stretch mt-2 animate-in fade-in duration-300">
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
                      {selectedSupplier ? (
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
                  </div>
                )}
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
                type={type}
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
          soItem={selectedSoItemContext}
          itemOptions={type === "Fabric" ? ["Cotton Fabric", "Linen"] : itemOptions}
          itemLabel={itemLabel}
          specLabel={specLabel}
          type={type}
          trimItem={selectedTrimItem}
          soItemTotalPcs={selectedSoItemContext ? Object.values(selectedSoItemContext.sizeBreakdown || {}).reduce((a: number, b) => a + (b as number), 0) : 0}
          initialValues={selectedSoItemContext ? {
            requiredQty: selectedSoItemContext.requiredQtyMtr,
            qty: selectedSoItemContext.requiredQtyMtr,
            // For Fabric: pre-fill material name and garment color
            // For Trims: material = trim type (e.g. "Button"), color comes from the variant picker
            colorShade: type === "Fabric" ? selectedSoItemContext.color : "",
            material: type === "Fabric" ? "Cotton Fabric" : selectedTrimItem,
            uom: type === "Fabric" ? "mtr" : "pcs",
          } : undefined}
        />

        <SelectSalesOrderItemsDialog 
          open={isSelectSoItemDialogOpen}
          onOpenChange={setIsSelectSoItemDialogOpen}
          buyerId={methods.watch("buyerId")}
          existingPoItems={poItems}
          onNext={handleSoItemNext}
          type={type}
        />
      </div>
    </FormProvider>
  );
}
