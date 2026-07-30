"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, CheckCircle2, Hash, Tag, FileText, Keyboard } from "lucide-react";
import Link from "next/link";
import { useProduction } from "@/components/production/production-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock trim requirements per style
const MOCK_TRIM_REQUIREMENTS = [
  { id: "T-1", itemType: "Main Label", requiredPerPc: 1, inStock: 5000, description: "Woven Label 5x3cm" },
  { id: "T-2", itemType: "Care Label", requiredPerPc: 1, inStock: 4500, description: "Wash Care Label" },
  { id: "T-3", itemType: "Zipper", requiredPerPc: 1, inStock: 1200, description: "5# Nylon Coil 15cm" },
  { id: "T-4", itemType: "Button", requiredPerPc: 3, inStock: 10000, description: "4 Hole Plastic Button 18L" },
];

export default function StoreDeptJobCardView() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { jobCards, updateJobCard } = useProduction();
  
  const jobCard = jobCards.find(c => c.id === id);
  const totalCutQty = jobCard?.totalReceived || 0; // Using totalReceived as mock for cut qty

  const [issueQtys, setIssueQtys] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize quantities based on required per pc * total cut
  useEffect(() => {
    if (totalCutQty > 0) {
      const initialQtys: Record<string, string> = {};
      MOCK_TRIM_REQUIREMENTS.forEach(trim => {
        initialQtys[trim.id] = (trim.requiredPerPc * totalCutQty).toString();
      });
      setIssueQtys(initialQtys);
    }
  }, [totalCutQty]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S to Save
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, router]);

  const handleKeyDownOnInput = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) prevInput.focus();
    }
  };

  const handleSave = () => {
    if (isSaved) return;
    setIsSaved(true);
    // Transition to the next phase: Stitching
    updateJobCard(id, { currentPhase: "Stitching" });
    setTimeout(() => {
      router.push("/production/store");
    }, 1500);
  };

  if (!jobCard) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/production/store">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm rounded-md border-slate-200">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Issue Trims: {id}</h1>
            <p className="text-sm text-slate-500 font-medium">Issue accessories and trims to Stitching/Finishing based on Lot No.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200 text-xs font-semibold text-slate-500">
            <Keyboard className="w-4 h-4" />
            <span><kbd className="font-sans px-1 py-0.5 bg-white border border-slate-300 rounded shadow-sm">Alt</kbd> + <kbd className="font-sans px-1 py-0.5 bg-white border border-slate-300 rounded shadow-sm">S</kbd> to Save</span>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaved}
            className={`h-10 px-6 font-bold shadow-sm transition-all ${isSaved ? 'bg-emerald-600 text-white' : 'bg-[#0453B8] hover:bg-blue-700 text-white hover:shadow-md'}`}
          >
            {isSaved ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Issued to Stitching</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Complete & Issue Trims</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Lot Details */}
        <div className="w-full lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-[#0453B8]" />
              Lot Information
            </h3>
            
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Style</span>
                <span className="text-sm font-bold text-slate-800">{jobCard.style}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Total Cut Quantity</span>
                <span className="text-2xl font-black text-[#0453B8]">{totalCutQty} <span className="text-sm font-bold text-slate-500">Pcs</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Trims Issue Table */}
        <div className="w-full lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
             <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0453B8]" />
                Required Trims & Accessories
              </h3>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5" /> Use <kbd className="px-1 bg-white border border-slate-300 rounded mx-0.5 text-[10px]">↑</kbd> <kbd className="px-1 bg-white border border-slate-300 rounded mx-0.5 text-[10px]">↓</kbd> to navigate
              </span>
            </div>
            
            <div className="overflow-auto p-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Type</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">In Stock</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Req / Pc</TableHead>
                    <TableHead className="text-xs font-bold text-[#0453B8] uppercase tracking-wider text-right w-[160px]">Issue Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TRIM_REQUIREMENTS.map((trim, index) => {
                    const requiredTotal = trim.requiredPerPc * totalCutQty;
                    const val = issueQtys[trim.id] || "";
                    const numericVal = parseInt(val) || 0;
                    const isShort = numericVal > trim.inStock;

                    return (
                      <TableRow key={trim.id} className="border-b-slate-50 hover:bg-slate-50/50">
                        <TableCell className="font-bold text-slate-800">{trim.itemType}</TableCell>
                        <TableCell className="font-medium text-slate-600">{trim.description}</TableCell>
                        <TableCell className="text-center font-bold text-slate-700">
                          {trim.inStock.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-500">
                          {trim.requiredPerPc}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <Input
                              ref={el => { inputRefs.current[index] = el }}
                              type="number"
                              min={0}
                              value={val}
                              onChange={(e) => setIssueQtys({...issueQtys, [trim.id]: e.target.value})}
                              onKeyDown={(e) => handleKeyDownOnInput(e, index)}
                              className={`h-9 text-right font-bold w-full ${isShort ? 'border-red-300 focus-visible:ring-red-500 bg-red-50 text-red-700' : 'focus-visible:ring-[#0453B8]'}`}
                            />
                            {isShort && <span className="text-[10px] font-bold text-red-500 mt-1">Shortfall: {numericVal - trim.inStock}</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
