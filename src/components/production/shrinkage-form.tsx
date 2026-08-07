"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ShrinkageEntry {
  id: string;
  rollNo: string;
  mtr: string;
  widthShrinkage: string;
  lengthShrinkage: string;
  inDetail: string;
}

export function ShrinkageForm() {
  const [selectedGrn, setSelectedGrn] = useState<string>("");
  const [supplierName, setSupplierName] = useState("");
  const [totalMeters, setTotalMeters] = useState(0);
  const [metersPerRoll, setMetersPerRoll] = useState(0);
  
  const [entries, setEntries] = useState<ShrinkageEntry[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleLoadGrn = (val: string) => {
    setSelectedGrn(val);
    if (val === "GRN-001") {
      setSupplierName("ABC Supplier");
      setTotalMeters(200);
      setMetersPerRoll(50);
      setEntries([
        { id: "1", rollNo: "Roll 1", mtr: "50", widthShrinkage: "1", lengthShrinkage: "2", inDetail: "50*50 Fabric" },
        { id: "2", rollNo: "Roll 2", mtr: "50", widthShrinkage: "4", lengthShrinkage: "0", inDetail: "50*50 Fabric" },
        { id: "3", rollNo: "Roll 3", mtr: "50", widthShrinkage: "10", lengthShrinkage: "0", inDetail: "50*50 Fabric" },
        { id: "4", rollNo: "Roll 4", mtr: "50", widthShrinkage: "0", lengthShrinkage: "0", inDetail: "50*50 Fabric" },
      ]);
    }
  };

  const updateEntry = (id: string, field: keyof ShrinkageEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSave = () => {
    console.log("Saving Shrinkage Data:", entries);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 pb-20 custom-scrollbar">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/production/qc" className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-white rounded-full border border-slate-200 flex items-center justify-center w-10 h-10 text-emerald-600 shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Fabric Shrinkage Entry
              </h1>
            </div>
          </div>
        </div>

        {/* Selection Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Select Fabric GRN</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-700">GRN No. <span className="text-red-500">*</span></Label>
              <Select value={selectedGrn} onValueChange={handleLoadGrn}>
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="Select GRN to load rolls" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRN-001">GRN-2026-001 (01/06/2026)</SelectItem>
                  <SelectItem value="GRN-002">GRN-2026-002 (05/06/2026)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedGrn && (
              <div className="col-span-2 flex items-center bg-blue-50/50 border border-blue-100 rounded-lg p-3 px-5">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Supplier</span>
                  <span className="text-sm font-bold text-slate-800">{supplierName}</span>
                </div>
                <div className="flex flex-col gap-1 flex-1 border-l border-blue-100 pl-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Received</span>
                  <span className="text-sm font-bold text-[#0453B8]">{totalMeters} Meter</span>
                </div>
                <div className="flex flex-col gap-1 flex-1 border-l border-blue-100 pl-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Per Roll Avg.</span>
                  <span className="text-sm font-bold text-slate-800">{metersPerRoll} Meter</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rollwise Table */}
        {selectedGrn && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h2 className="text-sm font-bold text-[#0453B8]">Rollwise Shrinkage Details</h2>
            </div>
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-slate-700 text-[11px] font-bold py-3 px-4 w-32 border-r border-slate-200">Roll No</TableHead>
                    <TableHead className="text-slate-700 text-[11px] font-bold py-3 px-4 w-32 border-r border-slate-200 text-center">Mtr</TableHead>
                    <TableHead colSpan={2} className="text-slate-700 text-[11px] font-bold py-1 px-0 text-center border-r border-slate-200 bg-slate-100/50">
                      <div className="border-b border-slate-200 py-1.5 bg-slate-100">Shrinkage %</div>
                      <div className="flex divide-x divide-slate-200">
                        <div className="flex-1 py-1.5">(Width)</div>
                        <div className="flex-1 py-1.5">(Length)</div>
                      </div>
                    </TableHead>
                    <TableHead className="text-slate-700 text-[11px] font-bold py-3 px-4 w-64 border-l border-slate-200">In</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                  {entries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-slate-50/50 group">
                      <TableCell className="py-3 px-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30">
                        {entry.rollNo}
                      </TableCell>
                      <TableCell className="py-2 px-2 text-center w-32 border-r border-slate-200">
                        <Input 
                          type="number"
                          value={entry.mtr}
                          onChange={(e) => updateEntry(entry.id, "mtr", e.target.value)}
                          className="h-9 text-center font-bold text-slate-800 focus-visible:ring-1 focus-visible:ring-[#0453B8] border-slate-200 bg-white"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-2 text-center w-40">
                        <div className="relative w-24 mx-auto">
                          <Input 
                            type="number"
                            value={entry.widthShrinkage}
                            onChange={(e) => updateEntry(entry.id, "widthShrinkage", e.target.value)}
                            className="h-9 text-center font-bold text-slate-800 pr-7 focus-visible:ring-1 focus-visible:ring-[#0453B8] border-slate-200 bg-white"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-2 text-center w-40 border-r border-slate-200">
                        <div className="relative w-24 mx-auto">
                          <Input 
                            type="number"
                            value={entry.lengthShrinkage}
                            onChange={(e) => updateEntry(entry.id, "lengthShrinkage", e.target.value)}
                            className="h-9 text-center font-bold text-slate-800 pr-7 focus-visible:ring-1 focus-visible:ring-[#0453B8] border-slate-200 bg-white"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4">
                        <Input 
                          value={entry.inDetail}
                          onChange={(e) => updateEntry(entry.id, "inDetail", e.target.value)}
                          placeholder="e.g. 50*50 Fabric"
                          className="h-9 text-sm font-medium text-slate-700 focus-visible:ring-1 focus-visible:ring-[#0453B8] border-slate-200 bg-white w-full max-w-[200px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {entries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium bg-slate-50/50">
                        Select a GRN to load rolls.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {entries.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-600">
                  Total Rolls: {entries.length}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Footer */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="text-xs text-slate-500 font-medium">
          {isSaved && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Data saved successfully</span>}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-6 font-bold border-slate-200 text-slate-700 hover:bg-slate-50">
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-10 px-8 bg-[#0453B8] hover:bg-blue-700 text-white font-bold">
            <Save className="w-4 h-4 mr-2" />
            Save Details
          </Button>
        </div>
      </div>
    </div>
  );
}
