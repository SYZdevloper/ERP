"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProduction } from "./production-context";
import { ArrowLeft, CheckCircle2, XCircle, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WarehouseDetailTableProps {
  id: string;
}

export function WarehouseDetailTable({ id }: WarehouseDetailTableProps) {
  const router = useRouter();
  const { jobCards, updateJobCard } = useProduction();
  
  const card = jobCards.find(c => c.id === id) || {
    id, soId: "SO-UNKNOWN", style: "Unknown", currentPhase: "Warehouse",
    totalReceived: 0, goodQty: 0, badQty: 0, handoverStatus: "Pending_Acceptance", pendingReplacementCount: 0
  };

  const [rejectionNote, setRejectionNote] = useState("");

  // Dummy data for tabular breakdown
  const [items, setItems] = useState([
    { sku: "NT-WP-2026-S-BLU", size: "S", color: "Blue", expected: 50, received: 50, damage: 0, note: "", image: "/men regualr fit shirt.jpeg" },
    { sku: "NT-WP-2026-M-BLU", size: "M", color: "Blue", expected: 100, received: 98, damage: 2, note: "Stitching error on hem", image: "/men regualr fit shirt.jpeg" },
    { sku: "NT-WP-2026-L-BLU", size: "L", color: "Blue", expected: 75, received: 75, damage: 0, note: "", image: "/men regualr fit shirt.jpeg" },
    { sku: "NT-WP-2026-XL-BLU", size: "XL", color: "Blue", expected: 25, received: 25, damage: 0, note: "", image: "/men regualr fit shirt.jpeg" },
  ]);

  const handleBack = () => {
    router.push(`/production/warehouse`);
  };

  const acceptHandover = () => {
    const totalReceived = items.reduce((sum, item) => sum + (Number(item.received) || 0), 0);
    const totalDamage = items.reduce((sum, item) => sum + (Number(item.damage) || 0), 0);
    
    updateJobCard(id, {
      handoverStatus: "Accepted",
      goodQty: totalReceived - totalDamage,
      badQty: totalDamage,
      totalReceived: totalReceived
    });
    alert("Job Card Received into Warehouse!");
    router.push(`/production/warehouse`);
  };

  const rejectHandover = () => {
    if (!rejectionNote.trim()) {
      alert("Please provide a reason for rejection in the notes field below.");
      return;
    }
    alert(`Handover Rejected! Reason: ${rejectionNote}\n\nThis batch will be returned to the previous department for correction.`);
    router.push(`/production/warehouse`);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar">
      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-1 -ml-3 text-slate-500 hover:text-[#0453B8] h-7 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Warehouse Queue
          </Button>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0453B8]" />
            Warehouse Receipt: <span className="text-[#0453B8]">{card.id}</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage processing for {card.soId} • {card.style}</p>
        </div>
        {card.handoverStatus === "Pending_Acceptance" && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
            Pending Verification
          </span>
        )}
      </div>

      {/* ── TABULAR ACTIVE VIEW ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">SKU Breakdown & Inspection</h3>
          <p className="text-xs text-slate-500 font-medium">Verify physical count against expected quantities</p>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="border-b border-slate-200">
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[80px] text-center">Image</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[200px]">SKU</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Size</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Color</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[120px]">Expected Qty</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-[#0453B8] uppercase tracking-wider text-right w-[140px]">Received Qty</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-red-600 uppercase tracking-wider text-right w-[140px]">Damage Qty</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Inspection Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-4 py-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.sku} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-sm font-bold text-slate-800">{item.sku}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-xs font-bold text-slate-700">{item.size}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="text-sm text-slate-600">{item.color}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-500">{item.expected}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Input 
                      type="number" 
                      value={item.received} 
                      onChange={(e) => updateItem(index, 'received', e.target.value)}
                      className="h-8 text-right font-bold text-[#0453B8] bg-blue-50/30 border-blue-200 focus-visible:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Input 
                      type="number" 
                      value={item.damage} 
                      onChange={(e) => updateItem(index, 'damage', e.target.value)}
                      className="h-8 text-right font-bold text-red-600 bg-red-50/30 border-red-200 focus-visible:ring-red-500"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Input 
                      type="text" 
                      value={item.note} 
                      onChange={(e) => updateItem(index, 'note', e.target.value)}
                      placeholder="Add note..."
                      className="h-8 text-sm text-slate-700 border-slate-200 bg-transparent"
                    />
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Totals Row */}
              <TableRow className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <TableCell colSpan={3} className="px-4 py-4 text-right uppercase tracking-wider text-xs text-slate-500">Totals:</TableCell>
                <TableCell className="px-4 py-4 text-right text-slate-800">{items.reduce((sum, item) => sum + item.expected, 0)}</TableCell>
                <TableCell className="px-4 py-4 text-right text-[#0453B8] text-lg">{items.reduce((sum, item) => sum + (Number(item.received) || 0), 0)}</TableCell>
                <TableCell className="px-4 py-4 text-right text-red-600 text-lg">{items.reduce((sum, item) => sum + (Number(item.damage) || 0), 0)}</TableCell>
                <TableCell className="px-4 py-4"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {card.handoverStatus === "Pending_Acceptance" && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col xl:flex-row gap-6 items-start justify-between max-w-[1200px]">
              <div className="w-full xl:max-w-[400px]">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Rejection Reason / General Note</label>
                <textarea 
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Required if rejecting the entire batch..."
                  className="w-full h-[80px] bg-white border border-slate-300 rounded-lg text-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#0453B8] font-medium text-slate-700 placeholder:text-slate-400 resize-none shadow-sm"
                />
              </div>
              <div className="flex gap-4 w-full xl:w-auto self-end">
                <Button onClick={rejectHandover} variant="outline" className="flex-1 xl:w-[140px] bg-white hover:bg-red-50 text-red-600 border-red-200 h-11 font-bold shadow-sm transition-all">
                  <XCircle className="w-4 h-4 mr-2" /> Reject Batch
                </Button>
                <Button onClick={acceptHandover} className="flex-1 xl:w-[180px] bg-[#0453B8] hover:bg-blue-700 text-white h-11 font-bold shadow-sm transition-all">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Accept & Stock In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
