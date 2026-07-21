"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Users, Activity, AlertTriangle, ChevronRight, Play, Square, Clock, Barcode } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

/* ── Bundle Scanning Tracker ── */
export function StitchingScanTracker() {
  const [scanInput, setScanInput] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("Suresh");
  const [selectedOperation, setSelectedOperation] = useState("Collar Making");
  
  const [activeJobs, setActiveJobs] = useState<{id: string, bundle: string, operator: string, operation: string, startTime: Date}[]>([]);
  const [completedJobs, setCompletedJobs] = useState<{id: string, bundle: string, operator: string, operation: string, startTime: Date, endTime: Date, duration: string}[]>([]);

  // Update timer every second
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScan = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!scanInput.trim()) return;
    const bundle = scanInput.trim();
    
    // Check if it's already active
    const activeIndex = activeJobs.findIndex(j => j.bundle === bundle && j.operation === selectedOperation);
    
    if (activeIndex >= 0) {
      // Complete it
      const job = activeJobs[activeIndex];
      const endTime = new Date();
      const diffMs = endTime.getTime() - job.startTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      const duration = `${diffMins}m ${diffSecs}s`;
      
      setCompletedJobs(prev => [{...job, endTime, duration}, ...prev]);
      setActiveJobs(prev => prev.filter((_, i) => i !== activeIndex));
    } else {
      // Start it
      setActiveJobs(prev => [{
        id: Math.random().toString(),
        bundle,
        operator: selectedOperator,
        operation: selectedOperation,
        startTime: new Date()
      }, ...prev]);
    }
    setScanInput("");
  };

  const getDuration = (start: Date) => {
    const diffMs = new Date().getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Barcode className="w-4 h-4 text-[#0453B8]" /> Bundle Scanning Station
        </h3>
        <div className="text-xs text-slate-500 font-medium">Scan bundle barcode to Start / Complete operation</div>
      </div>
      
      <div className="p-5">
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 items-end mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operator</label>
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger className="h-10 bg-white border-slate-200 shadow-sm font-semibold text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suresh">Suresh</SelectItem>
                <SelectItem value="Rakesh">Rakesh</SelectItem>
                <SelectItem value="Mahesh">Mahesh</SelectItem>
                <SelectItem value="Nilesh">Nilesh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operation</label>
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger className="h-10 bg-white border-slate-200 shadow-sm font-semibold text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Collar Making">Collar Making</SelectItem>
                <SelectItem value="Collar Attaching">Collar Attaching</SelectItem>
                <SelectItem value="Sleeve Attaching">Sleeve Attaching</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-[2] flex flex-col gap-1.5 relative">
            <label className="text-[10px] font-bold text-[#0453B8] uppercase tracking-wider">Scan Barcode (Bundle No)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <Input 
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  placeholder="e.g. Bundle-1-S"
                  className="h-10 pl-10 bg-white border-blue-200 focus-visible:ring-blue-500 font-bold shadow-sm"
                  autoFocus
                />
              </div>
              <Button type="submit" className="h-10 bg-[#0453B8] hover:bg-blue-700 font-bold px-6">
                Scan
              </Button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Jobs */}
          <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-amber-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-amber-800 text-xs flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> In Progress ({activeJobs.length})
              </h4>
            </div>
            <div className="p-0 overflow-y-auto max-h-[180px]">
              {activeJobs.length === 0 ? (
                <div className="p-6 text-center text-xs font-medium text-slate-400">No active bundles</div>
              ) : (
                <Table className="w-full">
                  <TableBody>
                    {activeJobs.map(job => (
                      <TableRow key={job.id} className="hover:bg-slate-50/50">
                        <TableCell className="py-2 px-3">
                          <div className="font-bold text-slate-800 text-xs">{job.bundle}</div>
                          <div className="text-[10px] text-slate-500">{job.operation}</div>
                        </TableCell>
                        <TableCell className="py-2 px-3 text-xs font-semibold text-slate-700">{job.operator}</TableCell>
                        <TableCell className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" /> {getDuration(job.startTime)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-emerald-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5" /> Completed Today ({completedJobs.length})
              </h4>
            </div>
            <div className="p-0 overflow-y-auto max-h-[180px]">
              {completedJobs.length === 0 ? (
                <div className="p-6 text-center text-xs font-medium text-slate-400">No completed bundles yet</div>
              ) : (
                <Table className="w-full">
                  <TableBody>
                    {completedJobs.map(job => (
                      <TableRow key={job.id} className="hover:bg-slate-50/50">
                        <TableCell className="py-2 px-3">
                          <div className="font-bold text-slate-800 text-xs">{job.bundle}</div>
                          <div className="text-[10px] text-slate-500">{job.operation}</div>
                        </TableCell>
                        <TableCell className="py-2 px-3 text-xs font-semibold text-slate-700">{job.operator}</TableCell>
                        <TableCell className="py-2 px-3 text-right">
                          <span className="text-[10px] text-slate-400 block">{job.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="text-xs font-bold text-emerald-600">{job.duration}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
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
