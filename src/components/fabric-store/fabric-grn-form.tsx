"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Plus, FileText, CheckCircle2, Paperclip, Edit2, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";

interface RollEntry {
  id: string;
  srNo: number;
  image?: string;
  description: string;
  rollNo: string;
  width: string;
  gsm: string;
  color: string;
  fabricType: string;
  mtrQty: number;
  hsn: string;
  rate: number;
  gst: number;
  amount: number;
  poItemIds?: string[];
  orderedQty?: number;
  isClosed?: boolean;
  billedQtyAsPerBill?: number;
  rollDetails?: { id: string, rollNo: string, billedQty: number, actualQty: number, color?: string }[];
}

const INITIAL_SUPPLIERS = ["SALASAR FASHION", "ARVIND MILLS", "VARDHMAN TEXTILES"];
const FABRIC_POS = ["PO-102 (01/06/2026)", "PO-103 (05/06/2026)"];

export function FabricGrnForm() {
  const methods = useForm({
    defaultValues: {
      notes: "",
      remarks: ""
    }
  });

  const [supplier, setSupplier] = useState("");
  const [po, setPo] = useState("");
  const [poLoaded, setPoLoaded] = useState(false);
  
  const [poItems] = useState([
    { id: "1", material: "ASTROFILL-016", width: "58", gsm: "250", color: "BLACK", type: "POLYESTER", hsn: "540752", rate: 175.00, gst: 5, orderedQty: 1000, balanceQty: 600, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=100&q=80" },
    { id: "2", material: "SHADOWMESH-220", width: "60", gsm: "220", color: "NAVY", type: "MESH", hsn: "540752", rate: 120.00, gst: 5, orderedQty: 500, balanceQty: 300, image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=100&q=80" },
    { id: "3", material: "VELVOTEX-330", width: "62", gsm: "330", color: "GREY", type: "VELVET", hsn: "540752", rate: 150.00, gst: 5, orderedQty: 800, balanceQty: 800, image: "https://images.unsplash.com/photo-1542157585-ef20bbcce178?w=100&q=80" },
  ]);

  const handleLoadPo = (selectedPo: string) => {
    if (selectedPo) {
      setPoLoaded(true);
      setViewMode("po-table");
    }
  };
  
  const [showAddress, setShowAddress] = useState(true);
  const [viewMode, setViewMode] = useState<"address" | "po-table">("address");
  const [poFilter, setPoFilter] = useState("");
  const [shortReceiptPrompt, setShortReceiptPrompt] = useState<{isOpen: boolean, entryId: string | null, totalMeters: number, orderedQty: number}>({ isOpen: false, entryId: null, totalMeters: 0, orderedQty: 0 });
  const [entries, setEntries] = useState<RollEntry[]>([]);

  // Popup States
  const [isLoadPoItemsOpen, setIsLoadPoItemsOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isRollDetailsOpen, setIsRollDetailsOpen] = useState(false);
  const [activeRollEntryId, setActiveRollEntryId] = useState<string | null>(null);
  const [activeBilledQtyAsPerBill, setActiveBilledQtyAsPerBill] = useState<string>("");
  const [activeRollDetails, setActiveRollDetails] = useState<{ id: string, rollNo: string, billedQty: string, actualQty: string, color?: string }[]>([]);

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [manualFormData, setManualFormData] = useState({
    description: "", rollNo: "", width: "", gsm: "", color: "", fabricType: "", mtrQty: "", hsn: "", rate: "", gst: "5", image: ""
  });

  const [selectedPoItems, setSelectedPoItems] = useState<Record<string, boolean>>({});
  const [combineLines, setCombineLines] = useState(false);

  const [splitRollCount, setSplitRollCount] = useState("10");
  const [splitTotalMeters, setSplitTotalMeters] = useState("1000");

  const handleAutoSplit = () => {
    const count = parseInt(splitRollCount) || 1;
    const total = parseFloat(splitTotalMeters) || 0;
    const mtrPerRoll = (total / count).toFixed(2);
    
    const newRolls = Array.from({ length: count }).map((_, idx) => ({
      id: Math.random().toString(),
      rollNo: `R-${(idx + 1).toString().padStart(2, '0')}`,
      billedQty: mtrPerRoll,
      actualQty: mtrPerRoll,
      color: ""
    }));
    setActiveRollDetails(newRolls);
  };

  const handleOpenRollDetails = (entry: RollEntry) => {
    setActiveRollEntryId(entry.id);
    setActiveBilledQtyAsPerBill(entry.billedQtyAsPerBill ? entry.billedQtyAsPerBill.toString() : "");
    if (entry.rollDetails && entry.rollDetails.length > 0) {
      setActiveRollDetails(entry.rollDetails.map(r => ({ ...r, billedQty: r.billedQty.toString(), actualQty: r.actualQty.toString() })));
    } else {
      // Default to 1 roll
      setActiveRollDetails([{ id: Math.random().toString(), rollNo: "R-01", billedQty: entry.mtrQty ? entry.mtrQty.toString() : "", actualQty: entry.mtrQty ? entry.mtrQty.toString() : "", color: "" }]);
    }
    setIsRollDetailsOpen(true);
  };

  const handleSaveRollDetails = () => {
    if (!activeRollEntryId) return;
    
    const validRolls = activeRollDetails.map((r, idx) => ({
      ...r,
      rollNo: r.rollNo || `R-${(idx + 1).toString().padStart(2, '0')}`,
      billedQty: Number(r.billedQty) || 0,
      actualQty: Number(r.actualQty) || 0,
      color: r.color || ""
    }));
    
    const totalActual = validRolls.reduce((acc, curr) => acc + curr.actualQty, 0);
    const totalBilled = validRolls.reduce((acc, curr) => acc + curr.billedQty, 0);
    const expectedBilled = Number(activeBilledQtyAsPerBill) || 0;

    if (expectedBilled > 0 && Math.abs(totalBilled - expectedBilled) > 0.01) {
      alert(`Total Billed Qty of rolls (${totalBilled.toFixed(2)}) must tally with the Billed Qty as per Bill (${expectedBilled.toFixed(2)}).`);
      return;
    }
    
    const currentEntry = entries.find(e => e.id === activeRollEntryId);
    if (currentEntry && currentEntry.orderedQty && totalActual > currentEntry.orderedQty) {
      alert(`Total actual meter (${totalActual}) cannot exceed the ordered quantity (${currentEntry.orderedQty}) from the PO.`);
      return;
    }
    
    setEntries(entries.map(e => {
      if (e.id === activeRollEntryId) {
        const amount = totalActual * e.rate;
        return {
          ...e,
          rollDetails: validRolls,
          mtrQty: totalActual,
          billedQtyAsPerBill: expectedBilled,
          amount: amount
        };
      }
      return e;
    }));
    
    setIsRollDetailsOpen(false);

    // Check for short receipt if it's linked to a PO item
    if (currentEntry && currentEntry.orderedQty && totalActual < currentEntry.orderedQty) {
      setShortReceiptPrompt({
        isOpen: true,
        entryId: currentEntry.id,
        totalMeters,
        orderedQty: currentEntry.orderedQty
      });
    }
  };

  const handleOpenManualEntry = () => {
    setEditingEntryId(null);
    setManualFormData({
      description: "", rollNo: "", width: "", gsm: "", color: "", fabricType: "", mtrQty: "", hsn: "", rate: "", gst: "5", image: ""
    });
    setIsManualEntryOpen(true);
  };

  const handleEditEntry = (entry: RollEntry) => {
    setEditingEntryId(entry.id);
    setManualFormData({
      description: entry.description,
      rollNo: entry.rollNo,
      width: entry.width,
      gsm: entry.gsm,
      color: entry.color,
      fabricType: entry.fabricType,
      mtrQty: entry.mtrQty.toString(),
      hsn: entry.hsn,
      rate: entry.rate.toString(),
      gst: entry.gst.toString(),
      image: entry.image || ""
    });
    setIsManualEntryOpen(true);
  };

  const handleSaveManualEntry = () => {
    const mtrQty = Number(manualFormData.mtrQty) || 0;
    const rate = Number(manualFormData.rate) || 0;
    const gst = Number(manualFormData.gst) || 5;

    if (editingEntryId) {
      setEntries(entries.map(e => e.id === editingEntryId ? {
        ...e,
        ...manualFormData,
        mtrQty,
        rate,
        gst,
        amount: mtrQty * rate,
        image: manualFormData.image
      } : e));
    } else {
      const row: RollEntry = {
        id: Math.random().toString(),
        srNo: entries.length + 1,
        description: manualFormData.description,
        rollNo: manualFormData.rollNo,
        width: manualFormData.width,
        gsm: manualFormData.gsm,
        color: manualFormData.color,
        fabricType: manualFormData.fabricType,
        mtrQty,
        hsn: manualFormData.hsn,
        rate,
        gst,
        amount: mtrQty * rate,
        image: manualFormData.image,
      };
      setEntries([...entries, row]);
    }
    setIsManualEntryOpen(false);
  };

  const handleAddSelectedPoItems = () => {
    const selectedItemIds = Object.keys(selectedPoItems).filter(id => selectedPoItems[id]);
    const selectedItems = selectedItemIds.map(id => poItems.find(i => i.id === id)).filter(Boolean) as typeof poItems;

    if (selectedItems.length === 0) return;

    if (combineLines && selectedItems.length > 0) {
      const combinedQty = selectedItems.reduce((acc, curr) => acc + (curr.balanceQty || 0), 0);
      const combinedDesc = selectedItems.map(i => i.material).join(" + ");
      const firstItem = selectedItems[0];
      
      const newRow: RollEntry = {
        id: Math.random().toString(),
        srNo: entries.length + 1,
        description: combinedDesc,
        rollNo: "",
        width: firstItem.width,
        gsm: firstItem.gsm,
        color: Array.from(new Set(selectedItems.map(i => i.color))).join("/"),
        fabricType: firstItem.type,
        mtrQty: combinedQty,
        hsn: firstItem.hsn,
        rate: firstItem.rate,
        gst: firstItem.gst,
        amount: combinedQty * firstItem.rate,
        poItemIds: selectedItems.map(i => i.id),
        image: firstItem.image,
      };
      setEntries([...entries, newRow]);
    } else {
      const newRows = selectedItems.map((item, index) => {
        const qty = item.balanceQty || 0;
        return {
          id: Math.random().toString(),
          srNo: entries.length + index + 1,
          description: item.material,
          rollNo: "",
          width: item.width,
          gsm: item.gsm,
          color: item.color,
          fabricType: item.type,
          mtrQty: qty,
          hsn: item.hsn,
          rate: item.rate,
          gst: item.gst,
          amount: qty * item.rate,
          poItemIds: [item.id],
          image: item.image,
        };
      });
      setEntries([...entries, ...newRows]);
    }
    
    setIsLoadPoItemsOpen(false);
    setSelectedPoItems({});
  };

  const updateEntry = (id: string, field: keyof RollEntry, value: any) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        if (field === 'mtrQty' || field === 'rate') {
          updated.amount = Number(updated.mtrQty) * Number(updated.rate);
        }
        return updated;
      }
      return entry;
    }));
  };

  const removeEntry = (id: string) => {
    const newEntries = entries.filter(e => e.id !== id).map((e, idx) => ({ ...e, srNo: idx + 1 }));
    setEntries(newEntries);
  };

  const totalMeters = entries.reduce((acc, curr) => acc + (Number(curr.mtrQty) || 0), 0);
  const subTotal = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const totalGstAmount = entries.reduce((acc, curr) => acc + (curr.amount * (Number(curr.gst) || 0) / 100), 0);
  const grandTotal = subTotal + totalGstAmount;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fabric-store" className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-10 h-10 text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                New Fabric GRN
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GRN Date</Label>
                <div className="flex items-center border border-slate-200 rounded-md bg-white px-3 h-9 text-sm font-medium text-slate-700 min-w-[140px]">
                  15-Jun-2026
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GRN Number</Label>
                <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 px-3 h-9 text-sm font-medium text-slate-400 italic min-w-[140px]">
                  Auto-Generated
                </div>
              </div>
              <div className="flex flex-col gap-1.5 items-center">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                <div className="bg-blue-50 text-[#0453B8] font-bold px-4 py-1.5 rounded-md text-sm">
                  Draft
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-5">
          {/* Left Column (Main Content) */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            
            {/* 1. Supplier & Document Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-[#0453B8] mb-5">1. Supplier & Document Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                  <Select value={supplier} onValueChange={setSupplier}>
                    <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {INITIAL_SUPPLIERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Fabric PO <span className="text-red-500">*</span></Label>
                  <Select value={po} onValueChange={(val) => { setPo(val); handleLoadPo(val); }}>
                    <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium">
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {FABRIC_POS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Delivery Challan No.</Label>
                  <Input placeholder="Enter Challan No." className="h-10 text-sm bg-white border-slate-200" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Challan Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white border-slate-200" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Invoice No.</Label>
                  <Input placeholder="Enter Invoice No." className="h-10 text-sm bg-white border-slate-200" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Invoice Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white border-slate-200" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">GRN Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white border-slate-200" />
                </div>
              </div>

              <div className="mt-4 overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    {viewMode === "address" ? "Supplier Address" : `Available Designs for Zara Fashion Pvt Limited`}
                  </h3>
                  {!poLoaded === false && viewMode === "po-table" && (
                    <div className="flex-1 max-w-sm ml-4">
                      <Input 
                        placeholder="Filter by PO..." 
                        value={poFilter}
                        onChange={(e) => setPoFilter(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    {poLoaded && (
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        onClick={() => setViewMode(viewMode === "address" ? "po-table" : "address")}
                        className="h-8 text-xs font-medium border-slate-200"
                      >
                        {viewMode === "address" ? "Show Designs" : "Show Address"}
                      </Button>
                    )}
                    {viewMode === "address" && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAddress(!showAddress)}
                        className="text-[#0453B8] font-bold h-8 text-xs hover:bg-blue-50"
                      >
                        {showAddress ? "Hide Address" : "Unhide Address"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  {/* Address View */}
                  <div className={`transition-all duration-500 ease-in-out ${viewMode === 'address' ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 -translate-y-4 absolute inset-0 pointer-events-none'}`}>
                    <div className={`grid transition-all duration-300 ease-in-out ${showAddress ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-[#F8FAFC]">
                          <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setShowAddress(!showAddress)}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0453B8]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              </div>
                              <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase">Address</h3>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{supplier || "Select Supplier"}</p>
                              </div>
                            </div>
                          </div>
                          {supplier && (
                            <div className="px-4 pb-4 pl-[3.25rem] text-sm text-slate-600">
                              <p>123, Ring Road, Surat - 395002, Gujarat, India</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Designs Table View */}
                  <div className={`transition-all duration-500 ease-in-out ${viewMode === 'po-table' ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none hidden'}`}>
                    <div className="border border-slate-200 rounded-lg overflow-y-auto custom-scrollbar bg-white shadow-sm max-h-[300px]">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-4 py-3 font-bold text-slate-700">SO No.</th>
                            <th className="px-4 py-3 font-bold text-slate-700">Image</th>
                            <th className="px-4 py-3 font-bold text-slate-700">Style / Design</th>
                            <th className="px-4 py-3 font-bold text-slate-700 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {poItems.filter(i => i.material.toLowerCase().includes(poFilter.toLowerCase())).length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-6 text-center text-slate-500">No available designs found.</td>
                            </tr>
                          ) : (
                            poItems.filter(i => i.material.toLowerCase().includes(poFilter.toLowerCase())).map((item: any, idx) => {
                              const isAdded = entries.some(e => e.poItemIds?.includes(item.id));
                              return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-[#0453B8]">SO-2026-001</div>
                                    <div className="text-xs text-slate-500 font-medium">Line {String(idx + 1).padStart(2, '0')}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="w-10 h-12 flex items-center justify-center overflow-hidden border border-slate-200 rounded bg-slate-50">
                                      <img src={item.image || "/men regualr fit shirt.jpeg"} alt={item.material} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-slate-800">{item.material}</div>
                                    <div className="text-xs text-slate-600 font-medium">{item.color} • {item.gsm}GSM</div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button 
                                      variant={isAdded ? "ghost" : "outline"}
                                      size="sm" 
                                      disabled={isAdded}
                                      onClick={() => {
                                        const newEntry: RollEntry = {
                                          id: Math.random().toString(),
                                          srNo: entries.length + 1,
                                          description: item.material,
                                          rollNo: "", 
                                          width: item.width,
                                          gsm: item.gsm,
                                          color: item.color,
                                          fabricType: item.type,
                                          mtrQty: 0, 
                                          hsn: item.hsn,
                                          rate: item.rate,
                                          gst: item.gst,
                                          amount: 0,
                                          image: item.image,
                                          poItemIds: [item.id],
                                          orderedQty: item.orderedQty
                                        };
                                        const updatedEntries = [...entries, newEntry];
                                        setEntries(updatedEntries);
                                        // Open roll details immediately after selecting
                                        setTimeout(() => handleOpenRollDetails(newEntry), 0);
                                      }}
                                      className={`h-7 text-xs font-semibold ${isAdded ? 'text-emerald-600 bg-emerald-50' : 'border-[#0453B8] text-[#0453B8] hover:bg-blue-50'}`}
                                    >
                                      {isAdded ? "Added" : "Select"}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Roll Wise Entry Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-5 mt-5">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-[#0453B8]">2. Fabric Receiving Entry</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleOpenManualEntry} disabled={!poLoaded} className="h-8 px-3 text-[#00A86B] border-[#00A86B]/30 hover:bg-[#00A86B]/10 font-semibold text-xs bg-white shadow-sm border">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Manual Fabric
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto w-full custom-scrollbar">
                <Table className="min-w-[1200px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-12">Sr</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-16">Image</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2">Description <span className="text-red-500">*</span> <span className="inline-block w-3.5 h-3.5 rounded-full border border-blue-400 text-blue-500 text-[9px] text-center leading-[12px] font-bold ml-1 cursor-help">i</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 text-center w-[12%]">Rolls <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 text-center w-[12%]">Mtr Qty <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 text-center w-[12%]">Rate (₹/Mtr) <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 text-center w-[12%]">GST % <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 text-right w-[12%]">Amount (₹)</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 text-center w-[10%]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm">
                    {!poLoaded ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-slate-400 font-medium bg-slate-50/50">
                          Please load a Fabric PO first to enter rolls.
                        </TableCell>
                      </TableRow>
                    ) : entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-slate-400 font-medium">
                          No rolls added yet. Use the quick add row below to enter rolls.
                        </TableCell>
                      </TableRow>
                    ) : null}
                    
                    {entries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-slate-50/50 group cursor-pointer" onClick={() => handleEditEntry(entry)}>
                        <TableCell className="text-center text-slate-600 py-3 px-2 text-xs font-semibold">{entry.srNo}</TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          {entry.image ? (
                            <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto overflow-hidden">
                              {entry.image.startsWith('http') || entry.image.startsWith('/') ? (
                                <img src={entry.image} alt={entry.description} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center mx-auto cursor-pointer hover:bg-slate-100 transition-colors">
                              <Plus className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="font-bold text-slate-800 text-sm uppercase mb-1 flex items-center gap-2">
                            {entry.description || "-"}
                            {entry.isClosed && <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px] font-bold">CLOSED</span>}
                          </div>
                          {(entry.width || entry.gsm || entry.color || entry.fabricType) ? (
                            <p className="text-[10px] text-slate-500 font-medium">
                              {[
                                entry.width ? `${entry.width}"` : null,
                                entry.gsm ? `${entry.gsm} GSM` : null,
                                entry.color,
                                entry.fabricType
                              ].filter(Boolean).join(" • ")}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-medium">(Width, GSM, Color, Fabric Type will appear here after save)</p>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleOpenRollDetails(entry); }}
                            className="bg-blue-50 hover:bg-blue-100 text-[#0453B8] border border-blue-200 h-8 px-4 text-xs font-bold rounded"
                            variant="outline"
                          >
                            {entry.rollDetails ? entry.rollDetails.length : (entry.mtrQty > 0 ? 1 : 0)} Rolls
                          </Button>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <div className="text-sm font-bold text-slate-700">{entry.mtrQty} <span className="text-[10px] text-slate-400 ml-0.5">Mtr</span></div>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <div className="text-sm font-bold text-slate-700">₹ {entry.rate}</div>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <div className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded w-fit mx-auto">{entry.gst}%</div>
                        </TableCell>
                        <TableCell className="text-right py-3 px-2 text-sm font-bold text-slate-900">
                          {entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center py-3 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleEditEntry(entry); }} type="button" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded border border-blue-200 transition-colors bg-white shadow-sm">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors bg-white shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-700">
                  Total Items: {entries.length}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm font-bold text-slate-700">Total Qty:</div>
                  <div className="text-sm font-black text-slate-900">{totalMeters.toFixed(2)} Mtr</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
            {/* Logistics Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Logistics Details</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-700">Transport Name</Label>
                  <Input placeholder="Enter Transport Name" className="h-9 text-sm bg-white border-slate-200" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-700">LR Number</Label>
                  <Input placeholder="Enter LR Number" className="h-9 text-sm bg-white border-slate-200" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-700">Amount</Label>
                  <Input type="number" placeholder="Enter Amount" className="h-9 text-sm bg-white border-slate-200" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold text-slate-900">Notes</Label>
              <textarea
                placeholder="Add any internal notes or special instructions for this order..."
                className="w-full min-h-[120px] resize-none border border-slate-200 rounded-xl p-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <Button type="button" variant="outline" className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 flex justify-center items-center font-bold bg-white shadow-sm rounded-xl">
              <Paperclip className="w-4 h-4 mr-2 text-slate-500" />
              Attachments (0)
            </Button>

            {/* Total Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-5">Total Summary</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-xs">Sub Total</span>
                  <span className="font-bold text-slate-900">₹ {subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Discount</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded bg-slate-50 w-[70px] h-7 overflow-hidden">
                      <select className="bg-transparent text-xs font-medium w-full h-full px-1 focus:outline-none">
                        <option>%</option>
                        <option>₹</option>
                      </select>
                    </div>
                    <div className="flex items-center border border-slate-200 rounded bg-white w-[70px] overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8]">
                      <input type="number" defaultValue="0" className="w-full text-right text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">₹ 0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Total GST</span>
                  <span className="font-bold text-slate-900">₹ {totalGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Freight</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded bg-white w-20 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8]">
                      <span className="text-[10px] text-slate-500 font-medium">₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">₹ 0.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Round Off</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded bg-white w-20 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8]">
                      <span className="text-[10px] text-slate-500 font-medium">±₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">₹ 0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 border-t border-slate-200 pt-4">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <span className="font-bold text-[#0453B8] text-xl">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
        <Link href="/fabric-store">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium h-10 px-6">
            Cancel
          </Button>
        </Link>
        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 px-6">
          <FileText className="w-4 h-4 mr-2 opacity-70" /> Save Draft
        </Button>
        <Button className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save & Confirm GRN
        </Button>
      </div>
    </div>
      {/* Load PO Items Dialog */}
      <Dialog open={isLoadPoItemsOpen} onOpenChange={setIsLoadPoItemsOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] w-full bg-white p-0 overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-800">Load PO Items</DialogTitle>
          </DialogHeader>
          <div className="px-5 py-3 overflow-y-auto flex-1">
            <p className="text-sm font-medium text-slate-600 mb-4">Select Items from PO: PO-102 (01/06/2026)</p>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-12 text-center py-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] w-4 h-4 cursor-pointer disabled:opacity-50"
                        disabled={poItems.every(item => new Set(entries.flatMap(e => e.poItemIds || [])).has(item.id))}
                        checked={poItems.length > 0 && Object.keys(selectedPoItems).length > 0 && Object.keys(selectedPoItems).every(id => selectedPoItems[id] || new Set(entries.flatMap(e => e.poItemIds || [])).has(id))}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newSelection: Record<string, boolean> = {};
                          const alreadyAdded = new Set(entries.flatMap(e => e.poItemIds || []));
                          poItems.forEach(item => {
                            if (!alreadyAdded.has(item.id)) {
                              newSelection[item.id] = checked;
                            }
                          });
                          setSelectedPoItems(newSelection);
                        }}
                      />
                    </TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-center w-16">Image</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs">Item Description</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-center">Width (Inch)</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-center">GSM</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs">Color</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs">Fabric Type</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-right">Ordered (Mtr)</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-right">Balance (Mtr)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poItems.map((item) => {
                    const isAdded = new Set(entries.flatMap(e => e.poItemIds || [])).has(item.id);
                    return (
                    <TableRow key={item.id} className={`hover:bg-slate-50/50 ${isAdded ? 'opacity-50 bg-slate-50' : ''}`}>
                      <TableCell className="text-center py-3">
                        <input 
                          type="checkbox" 
                          disabled={isAdded}
                          className="rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                          checked={isAdded || selectedPoItems[item.id] || false}
                          onChange={(e) => setSelectedPoItems({...selectedPoItems, [item.id]: e.target.checked})}
                        />
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {item.image ? (
                          <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto overflow-hidden">
                            {item.image.startsWith('http') || item.image.startsWith('/') ? (
                              <img src={item.image} alt={item.material} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center mx-auto">
                            <ImageIcon className="w-4 h-4 text-slate-300" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2">
                          {item.material}
                          {isAdded && <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px] font-bold">ADDED</span>}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 text-center font-medium">
                        {item.width}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 text-center font-medium">
                        {item.gsm}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 font-medium uppercase">
                        {item.color}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 font-medium uppercase">
                        {item.type}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-semibold text-slate-700 text-right">
                        {item.orderedQty?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-semibold text-slate-700 text-right">
                        {item.balanceQty?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  )})}
                  {poItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-400">No items available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-slate-800">
                  Selected Items: {Object.values(selectedPoItems).filter(Boolean).length}
                </span>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="combineLines" 
                      className="text-[#0453B8] focus:ring-[#0453B8]"
                      checked={combineLines}
                      onChange={() => setCombineLines(true)}
                    />
                    <span className="text-sm text-slate-600 font-medium">Add both in one line</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="combineLines" 
                      className="text-[#0453B8] focus:ring-[#0453B8]"
                      checked={!combineLines}
                      onChange={() => setCombineLines(false)}
                    />
                    <span className="text-sm text-slate-600 font-medium">Add in different lines</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setIsLoadPoItemsOpen(false)} className="h-9 px-4 text-slate-700 font-medium border-slate-200">
                  Cancel
                </Button>
                <Button onClick={handleAddSelectedPoItems} className="h-9 px-4 bg-[#0453B8] hover:bg-blue-700 text-white font-medium">
                  Add Selected
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual / Edit Entry Dialog */}
      <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] w-full max-h-[90vh] overflow-y-auto bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
              {editingEntryId ? "Edit Fabric Details" : "Add Manual Fabric"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2 flex items-center gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="w-16 h-16 rounded-md bg-white border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                {manualFormData.image ? (
                  manualFormData.image.startsWith('http') || manualFormData.image.startsWith('/') ? (
                    <img src={manualFormData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-[#0453B8]" />
                  )
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label className="text-xs font-bold text-slate-700">Fabric Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="h-8 text-xs font-semibold bg-white border-slate-200" onClick={() => setManualFormData({...manualFormData, image: "uploaded.png"})}>
                    <Upload className="w-3 h-3 mr-1.5 text-slate-500" /> Upload Image
                  </Button>
                  {manualFormData.image && (
                    <Button variant="ghost" className="h-8 text-xs text-red-500 hover:text-red-600 px-2 hover:bg-red-50" onClick={() => setManualFormData({...manualFormData, image: ""})}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Description <span className="text-red-500">*</span></Label>
              <Input 
                value={manualFormData.description} 
                onChange={(e) => setManualFormData({...manualFormData, description: e.target.value})} 
                placeholder="Enter fabric description"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Roll/Bale No</Label>
              <Input 
                value={manualFormData.rollNo} 
                onChange={(e) => setManualFormData({...manualFormData, rollNo: e.target.value})} 
                placeholder="Enter roll no"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Fabric Type</Label>
              <Input 
                value={manualFormData.fabricType} 
                onChange={(e) => setManualFormData({...manualFormData, fabricType: e.target.value})} 
                placeholder="e.g. COTTON, POLYESTER"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Width</Label>
              <Input 
                value={manualFormData.width} 
                onChange={(e) => setManualFormData({...manualFormData, width: e.target.value})} 
                placeholder='e.g. 44"'
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">GSM</Label>
              <Input 
                value={manualFormData.gsm} 
                onChange={(e) => setManualFormData({...manualFormData, gsm: e.target.value})} 
                placeholder="e.g. 180"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Color</Label>
              <Input 
                value={manualFormData.color} 
                onChange={(e) => setManualFormData({...manualFormData, color: e.target.value})} 
                placeholder="e.g. GREY"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">HSN Code</Label>
              <Input 
                value={manualFormData.hsn} 
                onChange={(e) => setManualFormData({...manualFormData, hsn: e.target.value})} 
                placeholder="e.g. 5208"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 relative">
              <Label className="text-xs font-bold text-slate-700">Mtr Qty <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input 
                  type="number"
                  value={manualFormData.mtrQty} 
                  onChange={(e) => setManualFormData({...manualFormData, mtrQty: e.target.value})} 
                  placeholder="Enter qty"
                  className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Mtr</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Rate (₹/Mtr) <span className="text-red-500">*</span></Label>
              <Input 
                type="number"
                value={manualFormData.rate} 
                onChange={(e) => setManualFormData({...manualFormData, rate: e.target.value})} 
                placeholder="Enter rate"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">GST % <span className="text-red-500">*</span></Label>
              <Select value={manualFormData.gst} onValueChange={(v) => setManualFormData({...manualFormData, gst: v})}>
                <SelectTrigger className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] w-full max-w-[200px]">
                  <SelectValue placeholder="Select GST" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsManualEntryOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveManualEntry} disabled={!manualFormData.description} className="bg-[#0453B8] hover:bg-blue-700 text-white shadow-sm px-6">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Roll Details Dialog */}
      <Dialog open={isRollDetailsOpen} onOpenChange={setIsRollDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] w-full bg-white p-0 overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-800">
              Roll Wise Meter Entry {activeRollEntryId ? `- ${entries.find(e => e.id === activeRollEntryId)?.description}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="px-5 py-4 overflow-y-auto h-[500px] custom-scrollbar flex flex-col">
            {(() => {
              const currentEntry = entries.find(e => e.id === activeRollEntryId);
              const orderQty = currentEntry?.orderedQty || 0;
              const receivedQty = activeRollDetails.reduce((acc, curr) => acc + (Number(curr.actualQty) || 0), 0);
              const balance = Math.max(0, orderQty - receivedQty);

              return (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg shrink-0">
                  <div className="flex items-center gap-8 px-2">
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Order Qty</Label>
                      <div className="text-lg font-black text-slate-800">{orderQty}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px] font-bold text-[#0453B8] uppercase">Received Qty</Label>
                      <div className="text-lg font-black text-[#0453B8]">{receivedQty}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px] font-bold text-red-500 uppercase">Balance</Label>
                      <div className="text-lg font-black text-red-600">{balance}</div>
                    </div>
                    <div className="h-10 w-px bg-blue-200 mx-2"></div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px] font-bold text-slate-700 uppercase">Billed Qty as per Bill <span className="text-red-500">*</span></Label>
                      <div className="flex items-center">
                        <Input 
                          type="number"
                          value={activeBilledQtyAsPerBill}
                          onChange={(e) => setActiveBilledQtyAsPerBill(e.target.value)}
                          placeholder="e.g. 300"
                          className="h-8 w-28 text-sm font-bold border-blue-200 focus-visible:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="ml-2 text-xs font-medium text-slate-500">Mtr</span>
                      </div>
                    </div>
                  </div>
              <Button 
                onClick={() => {
                  setActiveRollDetails([
                    ...activeRollDetails, 
                    { id: Math.random().toString(), rollNo: `R-${(activeRollDetails.length + 1).toString().padStart(2, '0')}`, billedQty: "", actualQty: "", color: "" }
                  ]);
                }}
                variant="outline" 
                className="h-8 text-xs font-semibold text-[#0453B8] border-blue-200 bg-blue-50/50 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Roll
              </Button>
            </div>
            );
          })()}

            {(() => {
              const totalBilled = activeRollDetails.reduce((acc, curr) => acc + (Number(curr.billedQty) || 0), 0);
              const totalActual = activeRollDetails.reduce((acc, curr) => acc + (Number(curr.actualQty) || 0), 0);

              return (
                <div className="flex-1 overflow-auto rounded-md border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-12 text-center py-2.5 text-xs font-bold text-slate-700">Sr</TableHead>
                        <TableHead className="py-2.5 text-xs font-bold text-slate-700">Roll No.</TableHead>
                        <TableHead className="py-2.5 text-xs font-bold text-slate-700">Color</TableHead>
                        <TableHead className="w-28 py-2.5 text-xs font-bold text-slate-700 text-right">Billed (Mtr) <span className="text-red-500">*</span></TableHead>
                        <TableHead className="w-28 py-2.5 text-xs font-bold text-slate-700 text-right">Actual (Mtr) <span className="text-red-500">*</span></TableHead>
                        <TableHead className="w-12 py-2.5"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeRollDetails.map((roll, idx) => (
                        <TableRow key={roll.id}>
                          <TableCell className="text-center font-semibold text-slate-600 text-xs py-2">{idx + 1}</TableCell>
                          <TableCell className="py-2">
                            <Input 
                              value={roll.rollNo}
                              onChange={(e) => {
                                const newDetails = [...activeRollDetails];
                                newDetails[idx].rollNo = e.target.value;
                                setActiveRollDetails(newDetails);
                              }}
                              className="h-8 text-xs border-slate-200"
                              placeholder={`R-${(idx + 1).toString().padStart(2, '0')}`}
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <Input 
                              value={roll.color || ""}
                              onChange={(e) => {
                                const newDetails = [...activeRollDetails];
                                newDetails[idx].color = e.target.value;
                                setActiveRollDetails(newDetails);
                              }}
                              className="h-8 text-xs border-slate-200"
                              placeholder="e.g. Red"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <Input 
                              type="number"
                              value={roll.billedQty}
                              onChange={(e) => {
                                const newDetails = [...activeRollDetails];
                                newDetails[idx].billedQty = e.target.value;
                                setActiveRollDetails(newDetails);
                              }}
                              className="h-8 text-xs text-right border-slate-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <Input 
                              type="number"
                              value={roll.actualQty}
                              onChange={(e) => {
                                const newDetails = [...activeRollDetails];
                                newDetails[idx].actualQty = e.target.value;
                                setActiveRollDetails(newDetails);
                              }}
                              className="h-8 text-xs text-right border-slate-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell className="py-2 text-center">
                            <button 
                              onClick={() => {
                                const newDetails = activeRollDetails.filter((_, i) => i !== idx);
                                setActiveRollDetails(newDetails);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter className="bg-transparent border-t-0">
                      <TableRow className="hover:bg-transparent border-b-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell className="py-4 text-center align-top border-t border-slate-200">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">{totalBilled.toFixed(2)} Mtr</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Billed Qty</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center align-top border-t border-slate-200">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#0453B8]">{totalActual.toFixed(2)} Mtr</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Actual Received</span>
                          </div>
                        </TableCell>
                        <TableCell className="border-t border-slate-200"></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              );
            })()}
          </div>

          {(() => {
            const totalBilled = activeRollDetails.reduce((acc, curr) => acc + (Number(curr.billedQty) || 0), 0);
            const totalActual = activeRollDetails.reduce((acc, curr) => acc + (Number(curr.actualQty) || 0), 0);
            const shortageRolls = activeRollDetails.filter(r => (Number(r.billedQty) || 0) > (Number(r.actualQty) || 0));
            const totalShortage = shortageRolls.reduce((acc, r) => acc + ((Number(r.billedQty) || 0) - (Number(r.actualQty) || 0)), 0);
            const expectedBilled = Number(activeBilledQtyAsPerBill) || 0;
            const isExceeding = expectedBilled > 0 && totalBilled > expectedBilled + 0.01;
            const isShort = expectedBilled > 0 && totalBilled < expectedBilled - 0.01;
            const doesNotTally = expectedBilled > 0 && Math.abs(totalBilled - expectedBilled) > 0.01;

            return (
              <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsRollDetailsOpen(false)} className="h-9 px-4 text-sm bg-white">Cancel</Button>
                    <Button onClick={handleSaveRollDetails} disabled={doesNotTally || expectedBilled === 0} className="bg-[#0453B8] hover:bg-blue-700 text-white h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Save Roll Details</Button>
                  </div>
                </div>
                {isExceeding && (
                  <div className="text-red-600 font-bold text-sm bg-red-50 p-2 border border-red-200 rounded-md">
                    Error: Total Billed Qty ({totalBilled.toFixed(2)}) exceeds Billed Qty as per Bill ({expectedBilled.toFixed(2)}). You cannot enter more than the Billed Qty.
                  </div>
                )}
                {isShort && (
                  <div className="text-amber-600 font-bold text-sm bg-amber-50 p-2 border border-amber-200 rounded-md">
                    Warning: Total Billed Qty ({totalBilled.toFixed(2)}) is less than Billed Qty as per Bill ({expectedBilled.toFixed(2)}). Please tally to save.
                  </div>
                )}
                {totalShortage > 0 && (
                  <div className="text-red-600 font-bold text-sm bg-red-50 p-2 border border-red-100 rounded-md">
                    Shortage {totalShortage.toFixed(2)} Meter in Roll No {shortageRolls.map(r => r.rollNo).join(", ")}
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={shortReceiptPrompt.isOpen} onOpenChange={(open) => !open && setShortReceiptPrompt(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Short Receipt Confirmation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 mb-2">
              You are receiving <span className="font-bold text-slate-900">{shortReceiptPrompt.totalMeters.toFixed(2)} Mtr</span> against an ordered quantity of <span className="font-bold text-slate-900">{shortReceiptPrompt.orderedQty.toFixed(2)} Mtr</span>.
            </p>
            <p className="text-sm font-semibold text-[#0453B8] mb-4">
              Is your Required Fabric Fulfilled? Do you want to Close the PO?
            </p>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="font-bold">If Yes:</span> No further tracking for this item. PO will be closed.
              <br />
              <span className="font-bold">If No:</span> {(shortReceiptPrompt.orderedQty - shortReceiptPrompt.totalMeters).toFixed(2)} Mtr will still be Pending Against PO.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShortReceiptPrompt({ isOpen: false, entryId: null, totalMeters: 0, orderedQty: 0 });
              }}
              className="px-6 font-semibold"
            >
              No, Keep Pending
            </Button>
            <Button 
              onClick={() => {
                if (shortReceiptPrompt.entryId) {
                  setEntries(entries.map(e => e.id === shortReceiptPrompt.entryId ? { ...e, isClosed: true } : e));
                }
                setShortReceiptPrompt({ isOpen: false, entryId: null, totalMeters: 0, orderedQty: 0 });
              }}
              className="px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-semibold"
            >
              Yes, Close PO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
