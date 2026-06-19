"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Plus, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";

interface RollEntry {
  id: string;
  srNo: number;
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
    { id: "1", material: "ASTROFILL-016", width: "58", gsm: "250", color: "BLACK", type: "POLYESTER", hsn: "540752", rate: 175.00, gst: 5 },
    { id: "2", material: "COTTON SLUB", width: "44", gsm: "180", color: "WHITE", type: "COTTON", hsn: "5208", rate: 120.00, gst: 5 },
  ]);

  const handleLoadPo = () => {
    if (po) {
      setPoLoaded(true);
    }
  };
  
  const [entries, setEntries] = useState<RollEntry[]>([]);

  const [newEntry, setNewEntry] = useState<Partial<RollEntry>>({
    description: "", rollNo: "", width: "", gsm: "", color: "", fabricType: "", mtrQty: 0, hsn: "", rate: 0, gst: 5
  });

  const handleAddRow = () => {
    if (!newEntry.description) {
      // Prevent adding empty rows since description is now required from PO
      return;
    }

    const mtrQty = Number(newEntry.mtrQty) || 0;
    const rate = Number(newEntry.rate) || 0;
    const gst = Number(newEntry.gst) || 5;

    const row: RollEntry = {
      id: Math.random().toString(),
      srNo: entries.length + 1,
      description: newEntry.description || "",
      rollNo: newEntry.rollNo || "",
      width: newEntry.width || "",
      gsm: newEntry.gsm || "",
      color: newEntry.color || "",
      fabricType: newEntry.fabricType || "",
      mtrQty,
      hsn: newEntry.hsn || "",
      rate,
      gst,
      amount: mtrQty * rate,
    };
    
    setEntries([...entries, row]);
    setNewEntry({ description: "", rollNo: "", width: "", gsm: "", color: "", fabricType: "", mtrQty: 0, hsn: "", rate: 0, gst: 5 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRow();
    }
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
            <div className="flex items-start gap-4">
              <Link href="/fabric-store" className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors mt-0.5">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-11 h-11 text-blue-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-6">
                  <h1 className="text-xl font-semibold text-slate-900">
                    New Fabric GRN
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/fabric-store">
                <Button variant="outline" className="h-10 px-4 text-slate-700 bg-white font-medium shadow-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  View GRNs
                </Button>
              </Link>
            </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
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
                
                <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                  <Label className="text-xs font-bold text-slate-600">Load Fabric PO <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Select value={po} onValueChange={setPo}>
                      <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium flex-1">
                        <SelectValue placeholder="Select PO" />
                      </SelectTrigger>
                      <SelectContent>
                        {FABRIC_POS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleLoadPo} className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white shadow-sm font-medium">Load</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Challan & Invoice Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">2</div>
                <h2 className="text-sm font-bold text-slate-900">Challan & Logistics Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Challan No</Label>
                  <Input placeholder="Enter Challan" className="h-10 text-sm bg-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Challan Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Invoice No</Label>
                  <Input placeholder="Enter Invoice" className="h-10 text-sm bg-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Invoice Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white" />
                </div>
                <div className="flex flex-col gap-2 lg:col-span-2">
                  <Label className="text-xs font-bold text-slate-600">Transport</Label>
                  <Input placeholder="Transport Name" className="h-10 text-sm bg-white" />
                </div>
                <div className="flex flex-col gap-2 lg:col-span-2">
                  <Label className="text-xs font-bold text-slate-600">LR No</Label>
                  <Input placeholder="LR No" className="h-10 text-sm bg-white" />
                </div>
              </div>
            </div>

            {/* 3. PO Summary Highlights */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0453B8] mb-4">PO Summary {po ? `(${po})` : ''}</h3>
              <div className="grid grid-cols-5 gap-4 text-center divide-x divide-slate-200">
                <div className="flex flex-col gap-1 px-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Ordered Qty</span>
                  <span className="text-base font-bold text-slate-800">{po ? '1,000.00' : '0.00'} <span className="text-xs text-slate-500">Mtr</span></span>
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Previously Received</span>
                  <span className="text-base font-bold text-slate-800">{po ? '400.00' : '0.00'} <span className="text-xs text-slate-500">Mtr</span></span>
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <span className="text-[11px] font-semibold text-[#0453B8] uppercase tracking-wide">Current GRN</span>
                  <span className="text-base font-bold text-[#0453B8]">{totalMeters.toFixed(2)} <span className="text-xs text-slate-500">Mtr</span></span>
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Total Received</span>
                  <span className="text-base font-bold text-emerald-600">{po ? (400 + totalMeters).toFixed(2) : totalMeters.toFixed(2)} <span className="text-xs text-slate-500">Mtr</span></span>
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wide">Balance Qty</span>
                  <span className="text-base font-bold text-red-500">{po ? (1000 - (400 + totalMeters)).toFixed(2) : '0.00'} <span className="text-xs text-slate-500">Mtr</span></span>
                </div>
              </div>
            </div>

            {/* 4. Roll Wise Entry Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-5">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">3</div>
                  <h2 className="text-sm font-bold text-slate-900">Roll Wise Fabric Entry</h2>
                </div>
                <Button onClick={handleAddRow} disabled={!poLoaded} className="h-8 px-4 bg-[#0453B8] hover:bg-blue-700 disabled:bg-slate-300 disabled:opacity-50 text-white text-xs font-medium shadow-sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Row
              </Button>
              </div>
              
              <div className="overflow-x-auto w-full custom-scrollbar">
                <Table className="min-w-[1200px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-10">Sr</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2">Description <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2">Roll/Bale No</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-20">Width</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-20">GSM</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-24">Color</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32">Fabric Type</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32 text-center">Mtr Qty <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-24">HSN</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-24 text-center">Rate <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-24 text-center">GST % <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32 text-right">Amount</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-16 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm">
                    {!poLoaded ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-12 text-slate-400 font-medium bg-slate-50/50">
                          Please load a Fabric PO first to enter rolls.
                        </TableCell>
                      </TableRow>
                    ) : entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-slate-400 font-medium">
                          No rolls added yet. Use the quick add row below to enter rolls.
                        </TableCell>
                      </TableRow>
                    ) : null}
                    
                    {entries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-slate-50/50">
                        <TableCell className="text-center text-slate-600 py-2.5 px-2 text-xs font-semibold">{entry.srNo}</TableCell>
                        <TableCell className="py-2.5 px-2 font-medium text-slate-800 text-[12px]">{entry.description}</TableCell>
                        <TableCell className="py-2.5 px-2">
                          <Input value={entry.rollNo} onChange={(e) => updateEntry(entry.id, 'rollNo', e.target.value)} className="h-8 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]" />
                        </TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.width}</TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.gsm}</TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.color}</TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.fabricType}</TableCell>
                        <TableCell className="py-2.5 px-2">
                          <Input type="number" value={entry.mtrQty} onChange={(e) => updateEntry(entry.id, 'mtrQty', e.target.value)} className="h-8 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] text-right font-medium" />
                        </TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.hsn}</TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.rate}</TableCell>
                        <TableCell className="py-2.5 px-2 text-slate-600 text-[12px]">{entry.gst}%</TableCell>
                        <TableCell className="text-right py-2.5 px-2 text-[12px] font-bold text-[#0453B8]">
                          {entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center py-2.5 px-2">
                          <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors mx-auto block">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* New Entry Row (Quick Add) */}
                    {poLoaded && (
                      <TableRow className="bg-[#f8fafd] border-t-2 border-blue-100">
                        <TableCell className="text-center text-[#0453B8] py-3 px-2 text-xs font-bold">{entries.length + 1}</TableCell>
                        <TableCell className="py-3 px-2">
                          <Select 
                            value={newEntry.description} 
                            onValueChange={(val) => {
                              const item = poItems.find(i => i.material === val);
                              if (item) {
                                setNewEntry({
                                  ...newEntry,
                                  description: item.material,
                                  width: item.width,
                                  gsm: item.gsm,
                                  color: item.color,
                                  fabricType: item.type,
                                  hsn: item.hsn,
                                  rate: item.rate,
                                  gst: item.gst
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 text-[12px] bg-white border-blue-300 focus:ring-1 focus:ring-[#0453B8] w-full min-w-[140px] font-medium text-slate-800">
                              <SelectValue placeholder="Select PO Item" />
                            </SelectTrigger>
                            <SelectContent>
                              {poItems.map(item => (
                                <SelectItem key={item.id} value={item.material} className="text-[12px] font-medium">{item.material}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <Input placeholder="Roll No" value={newEntry.rollNo} onChange={(e) => setNewEntry({...newEntry, rollNo: e.target.value})} onKeyDown={handleKeyDown} className="h-8 text-[13px] bg-white border-blue-300 focus-visible:ring-1 focus-visible:ring-[#0453B8]" />
                        </TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50">{newEntry.width || "-"}</TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50">{newEntry.gsm || "-"}</TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50">{newEntry.color || "-"}</TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50">{newEntry.fabricType || "-"}</TableCell>
                        <TableCell className="py-3 px-2">
                          <Input placeholder="Qty" type="number" value={newEntry.mtrQty || ""} onChange={(e) => setNewEntry({...newEntry, mtrQty: Number(e.target.value)})} onKeyDown={handleKeyDown} className="h-8 text-[13px] bg-white border-blue-300 focus-visible:ring-1 focus-visible:ring-[#0453B8] text-right font-medium" />
                        </TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50">{newEntry.hsn || "-"}</TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50 text-right">{newEntry.rate || "-"}</TableCell>
                        <TableCell className="py-3 px-2 text-slate-500 text-[12px] bg-slate-50/50">{newEntry.gst ? `${newEntry.gst}%` : "-"}</TableCell>
                        <TableCell className="text-right py-3 px-2 text-[12px] font-bold text-slate-400">
                          {((newEntry.mtrQty || 0) * (newEntry.rate || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center py-3 px-2">
                          <button type="button" disabled className="p-1.5 text-slate-300 rounded border border-transparent mx-auto block cursor-not-allowed">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {poLoaded && (
                <div className="p-2 text-center bg-[#F8FAFC] text-[11px] font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:bg-slate-100 hover:text-[#0453B8] transition-colors border-t border-slate-200" onClick={handleAddRow}>
                  Press ENTER to add new row
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
            {/* GRN Date/Status Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">GRN DATE</span>
                <span className="text-base font-black text-[#0453B8] tracking-wide">
                  15-JUN-2026
                </span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                  MONDAY
                </span>
              </div>
              <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">STATUS</span>
                <span className="text-base font-black text-[#0453B8] tracking-wide">
                  Draft
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 invisible">
                  SPACER
                </span>
              </div>
              <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center col-span-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">GRN NUMBER</span>
                <span className="text-base font-black text-slate-400 tracking-wide italic">
                  Auto-Generated
                </span>
              </div>
            </div>

            <NotesPanel isReadOnly={false} />
            <AttachmentsModal isReadOnly={false} />

            {/* GRN Summary Totals */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-5">GRN Totals</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Rolls</span>
                  <span className="font-semibold text-slate-900">{entries.length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span>Total Meter</span>
                  <span className="font-semibold text-slate-900">{totalMeters.toLocaleString('en-IN', { minimumFractionDigits: 2 })} m</span>
                </div>
                <div className="border-t border-slate-100 my-1"></div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Sub Total</span>
                  <span className="font-semibold text-slate-900">₹ {subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span>Total GST</span>
                  <span className="font-semibold text-slate-900">₹ {totalGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
    </FormProvider>
  );
}
