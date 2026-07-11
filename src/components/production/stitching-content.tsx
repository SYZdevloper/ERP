"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Users, Activity, AlertTriangle, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── Yield & Defect Tracking (top-right card) ── */
export function StitchingYieldTracking({ card, onRequestReplacement }: {
  card: { totalReceived: number; goodQty: number; badQty: number; pendingReplacementCount: number };
  onRequestReplacement?: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#0453B8]" /> Yield & Defect Tracking
      </h3>
      <div className="flex gap-3 items-stretch">
        {/* Total Received */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Received</span>
          <span className="text-2xl font-black text-slate-800">{card.totalReceived}</span>
          <span className="text-[9px] font-medium text-slate-400">Pieces</span>
        </div>
        {/* Good */}
        <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Good</span>
          <span className="text-2xl font-black text-emerald-600">{card.goodQty}</span>
          <span className="text-[9px] font-medium text-emerald-400">Pieces</span>
        </div>
        {/* Defect */}
        <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Defect</span>
          <span className="text-2xl font-black text-red-600">{card.badQty}</span>
          <span className="text-[9px] font-medium text-red-400">Pieces</span>
        </div>
        {/* Request Replacements CTA */}
        {card.badQty > 0 && (
          <button
            onClick={onRequestReplacement}
            className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-100 transition-colors min-w-[180px]"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-red-700 block">Request {card.badQty} Replacements</span>
              <span className="text-[10px] text-red-500">Click to raise replacement request</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400 ml-auto" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Recent Operations Table ── */
export function StitchingRecentOperations() {
  const data = [
    { lotNo: "101", date: "2026-07-01", operator: "Suresh", operation: "Collar Making", pieces: 20, rate: 3, amount: 60, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Suresh", operation: "Collar Attaching", pieces: 20, rate: 4, amount: 80, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Rakesh", operation: "Collar Making", pieces: 20, rate: 3, amount: 60, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Rakesh", operation: "Collar Attaching", pieces: 20, rate: 4, amount: 80, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Mahesh", operation: "Collar Making", pieces: 20, rate: 3, amount: 60, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Mahesh", operation: "Collar Attaching", pieces: 20, rate: 4, amount: 80, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Nilesh", operation: "Collar Making", pieces: 20, rate: 3, amount: 60, payment: "Pending", remarks: "" },
    { lotNo: "101", date: "2026-07-01", operator: "Nilesh", operation: "Collar Attaching", pieces: 20, rate: 4, amount: 80, payment: "Pending", remarks: "" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm">Recent Operations</h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[240px]">
        <Table className="w-full border-collapse relative">
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap h-8 px-3 text-xs border border-slate-200">Lot No</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap h-8 px-3 text-xs border border-slate-200">Date</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap h-8 px-3 text-xs border border-slate-200">Operator</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap h-8 px-3 text-xs border border-slate-200">Operation</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap text-right h-8 px-3 text-xs border border-slate-200">Pieces</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap text-right h-8 px-3 text-xs border border-slate-200">Rate</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap text-right h-8 px-3 text-xs border border-slate-200">Amount</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap h-8 px-3 text-xs border border-slate-200">Payment Status</TableHead>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap h-8 px-3 text-xs border border-slate-200">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => (
              <TableRow key={i} className="hover:bg-slate-50/60">
                <TableCell className="font-medium text-slate-900 py-2 px-3 text-xs border border-slate-200">{r.lotNo}</TableCell>
                <TableCell className="text-slate-600 py-2 px-3 text-xs border border-slate-200">{r.date}</TableCell>
                <TableCell className="font-bold text-slate-800 py-2 px-3 text-xs border border-slate-200">{r.operator}</TableCell>
                <TableCell className="text-slate-600 py-2 px-3 text-xs border border-slate-200">{r.operation}</TableCell>
                <TableCell className="text-right font-medium text-slate-600 py-2 px-3 text-xs border border-slate-200">{r.pieces}</TableCell>
                <TableCell className="text-right font-medium text-slate-600 py-2 px-3 text-xs border border-slate-200">{r.rate}</TableCell>
                <TableCell className="text-right font-bold text-emerald-600 py-2 px-3 text-xs border border-slate-200">{r.amount}</TableCell>
                <TableCell className="py-2 px-3 text-xs border border-slate-200">
                  <span className="text-blue-600 font-medium text-[11px]">{r.payment}</span>
                </TableCell>
                <TableCell className="text-slate-400 py-2 px-3 text-xs border border-slate-200">{r.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ── Bundle Operations & Rates Table ── */
export function StitchingBundleOperations() {
  const bundles = [
    { bundle: "Bundle 1-S-1-10 (10Pcs)", op1: "Suresh", r1: 3, op2: "Rakesh", r2: 4 },
    { bundle: "Bundle 1-S-10-20 (10Pcs)", op1: "Suresh", r1: 3, op2: "Rakesh", r2: 4 },
    { bundle: "Bundle 1-M-21-30 (10Pcs)", op1: "Mahesh", r1: 3, op2: "Nilesh", r2: 4 },
    { bundle: "Bundle 1-M-31-40 (10Pcs)", op1: "Mahesh", r1: 3, op2: "Nilesh", r2: 4 },
    { bundle: "Bundle 1-L-41-50 (10Pcs)", op1: "Nilesh", r1: 3, op2: "Mahesh", r2: 4 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm">Bundle Operations & Rates</h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[220px]">
        <Table className="w-full border-collapse relative">
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-bold text-slate-700 whitespace-nowrap align-bottom border border-slate-200 w-[200px] text-xs h-8 px-3" rowSpan={2}>
                Bundle Number
              </TableHead>
              <TableHead className="font-bold text-slate-700 text-center border border-slate-200 h-8 text-xs p-0 px-1" colSpan={2}>
                <Select defaultValue="Collar Making">
                  <SelectTrigger className="h-7 text-xs font-bold border-transparent shadow-none bg-transparent hover:bg-slate-100/50 focus:ring-0 justify-center text-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Collar Making">Collar Making</SelectItem>
                    <SelectItem value="Collar Attaching">Collar Attaching</SelectItem>
                    <SelectItem value="Sleeve Attaching">Sleeve Attaching</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>
              <TableHead className="font-bold text-slate-700 text-center border border-slate-200 h-8 text-xs p-0 px-1" colSpan={2}>
                <Select defaultValue="Collar Attaching">
                  <SelectTrigger className="h-7 text-xs font-bold border-transparent shadow-none bg-transparent hover:bg-slate-100/50 focus:ring-0 justify-center text-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Collar Making">Collar Making</SelectItem>
                    <SelectItem value="Collar Attaching">Collar Attaching</SelectItem>
                    <SelectItem value="Sleeve Attaching">Sleeve Attaching</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="font-bold text-slate-600 text-center bg-slate-50 h-8 border border-slate-200 text-xs">Operator</TableHead>
              <TableHead className="font-bold text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 text-xs">Rate</TableHead>
              <TableHead className="font-bold text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 text-xs">Operator</TableHead>
              <TableHead className="font-bold text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 text-xs">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.map((b, i) => (
              <TableRow key={i} className="hover:bg-slate-50/60">
                <TableCell className="font-medium text-slate-900 border border-slate-200 py-1.5 px-3 text-xs">{b.bundle}</TableCell>
                <TableCell className="text-center font-medium text-slate-800 border border-slate-200 py-1 px-1 text-xs">
                  <Select defaultValue={b.op1}>
                    <SelectTrigger className="h-7 text-xs font-medium border-transparent shadow-none bg-transparent hover:bg-slate-100 focus:ring-0 justify-center">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suresh">Suresh</SelectItem>
                      <SelectItem value="Rakesh">Rakesh</SelectItem>
                      <SelectItem value="Mahesh">Mahesh</SelectItem>
                      <SelectItem value="Nilesh">Nilesh</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center text-slate-600 border border-slate-200 py-1.5 text-xs">{b.r1}</TableCell>
                <TableCell className="text-center font-medium text-slate-800 border border-slate-200 py-1 px-1 text-xs">
                  <Select defaultValue={b.op2}>
                    <SelectTrigger className="h-7 text-xs font-medium border-transparent shadow-none bg-transparent hover:bg-slate-100 focus:ring-0 justify-center">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suresh">Suresh</SelectItem>
                      <SelectItem value="Rakesh">Rakesh</SelectItem>
                      <SelectItem value="Mahesh">Mahesh</SelectItem>
                      <SelectItem value="Nilesh">Nilesh</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center text-slate-600 border border-slate-200 py-1.5 text-xs">{b.r2}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ── Footer Stats Bar ── */
export function StitchingFooter() {
  return (
    <div className="flex justify-center items-center gap-12 bg-white border border-slate-200 rounded-xl py-4 px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bundles</span>
          <span className="text-xl font-black text-slate-800">5</span>
        </div>
      </div>
      <div className="w-px h-10 bg-slate-200"></div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pieces</span>
          <span className="text-xl font-black text-slate-800">50</span>
        </div>
      </div>
      <div className="w-px h-10 bg-slate-200"></div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Yield</span>
          <span className="text-xl font-black text-emerald-600">99%</span>
        </div>
      </div>
    </div>
  );
}
