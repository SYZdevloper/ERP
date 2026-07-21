"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Phase, HandoverStatus, JobCard } from "./department-list";
import { useProduction } from "./production-context";
import { ArrowLeft, UserCheck, AlertTriangle, ArrowRight, CornerDownRight, CheckCircle2, XCircle, Package, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StitchingYieldTracking, StitchingRecentOperations, StitchingBundleOperations, StitchingScanTracker } from "./stitching-content";

interface JobCardDetailProps {
  id: string;
  department: Phase;
}

export function JobCardDetail({ id, department }: JobCardDetailProps) {
  const router = useRouter();
  const { jobCards, updateJobCard } = useProduction();
  
  const card = jobCards.find(c => c.id === id) || {
    id, soId: "SO-UNKNOWN", style: "Unknown", currentPhase: department,
    totalReceived: 0, goodQty: 0, badQty: 0, handoverStatus: "Accepted" as HandoverStatus, pendingReplacementCount: 0
  };

  const [receiveCut, setReceiveCut] = useState(card.totalReceived.toString());
  const [receiveDamage, setReceiveDamage] = useState("0");
  const [receiveLost, setReceiveLost] = useState("0");
  const [receiveOk, setReceiveOk] = useState(card.totalReceived.toString());
  const [rejectionNote, setRejectionNote] = useState("");

  const phases: Phase[] = ["Cutting", "Stitching", "Washing", "Finishing", "Warehouse"];

  const handleBack = () => {
    router.push(`/production/${department.toLowerCase()}`);
  };

  const acceptHandover = () => {
    const ok = parseInt(receiveOk) || 0;
    const damage = parseInt(receiveDamage) || 0;
    const lost = parseInt(receiveLost) || 0;
    const totalBad = damage + lost;
    updateJobCard(id, {
      handoverStatus: "Accepted",
      goodQty: ok,
      badQty: totalBad,
      totalReceived: ok + totalBad
    });
  };

  const rejectHandover = () => {
    if (!rejectionNote.trim()) {
      alert("Please provide a reason for rejection in the notes field.");
      return;
    }
    alert(`Handover Rejected! Reason: ${rejectionNote}\n\nThis batch will be returned to the previous department for correction.`);
    router.push(`/production/${department.toLowerCase()}`);
  };
  
  const markDefect = () => {
    if (card.goodQty > 0) {
      updateJobCard(id, { goodQty: card.goodQty - 1, badQty: card.badQty + 1 });
    }
  };

  const unmarkDefect = () => {
    if (card.badQty > 0) {
      updateJobCard(id, { goodQty: card.goodQty + 1, badQty: card.badQty - 1 });
    }
  };

  const requestReplacement = () => {
    if (card.badQty > 0) {
      updateJobCard(id, {
        pendingReplacementCount: card.pendingReplacementCount + card.badQty,
        badQty: 0
      });
    }
  };

  const receiveReplacement = () => {
    if (card.pendingReplacementCount > 0) {
      updateJobCard(id, {
        totalReceived: card.totalReceived + card.pendingReplacementCount,
        goodQty: card.goodQty + card.pendingReplacementCount,
        pendingReplacementCount: 0
      });
    }
  };

  const moveToPhase = (nextPhase: Phase) => {
    updateJobCard(id, {
      currentPhase: nextPhase,
      handoverStatus: "Pending_Acceptance",
      totalReceived: card.goodQty,
      goodQty: card.goodQty,
      badQty: 0,
      pendingReplacementCount: 0
    });
    router.push(`/production/${department.toLowerCase()}`);
  };

  const phaseOrder: Record<Phase, number> = {
    "Cutting": 0, "Stitching": 1, "Washing": 2, "Finishing": 3, "Warehouse": 4
  };
  const isReplacementView = phaseOrder[department] === phaseOrder[card.currentPhase] - 1 && card.pendingReplacementCount > 0;
  const isAccepted = !isReplacementView && card.handoverStatus === "Accepted";
  const isStitching = department === "Stitching";

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar">
      
      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-1 -ml-3 text-slate-500 hover:text-[#0453B8] h-7 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to {department} Queue
          </Button>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Job Card: <span className="text-[#0453B8]">{card.id}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage processing for {card.soId} • {card.style}</p>
        </div>


      </div>

      {/* ── TOP SECTION: TWO COLUMNS ── */}
      <div className="w-full max-w-[1600px] flex flex-col xl:flex-row gap-4 mb-4">

        {/* ════ LEFT COLUMN (Actions / Tracking) ════ */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Pending Acceptance State */}
          {card.handoverStatus === "Pending_Acceptance" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base">Pending Verification</h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                  Action Required
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                Expected batch: <span className="font-bold text-slate-800">{card.totalReceived}</span> pieces. Please verify the physical count and log any immediate defects from the previous phase.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6 items-stretch">
                <div className="flex-[2] flex flex-col justify-between">
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[120px]">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Buyer Design No.</label>
                      <span className="text-xl font-black text-slate-800">NT-WP-2026</span>
                    </div>
                    
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[100px]">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Cut Pcs</label>
                      <Input 
                        type="number" 
                        value={receiveCut} 
                        onChange={(e) => setReceiveCut(e.target.value)}
                        className="h-8 border-none bg-transparent p-0 text-2xl font-black text-slate-800 focus-visible:ring-0 shadow-none px-0"
                      />
                    </div>
                    
                    <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3 min-w-[100px]">
                      <label className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block mb-1">Damage</label>
                      <Input 
                        type="number" 
                        value={receiveDamage} 
                        onChange={(e) => setReceiveDamage(e.target.value)}
                        className="h-8 border-none bg-transparent p-0 text-2xl font-black text-amber-700 focus-visible:ring-0 shadow-none px-0"
                      />
                    </div>
                    
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 min-w-[100px]">
                      <label className="text-[9px] font-bold text-red-700 uppercase tracking-wider block mb-1">Lost Pcs</label>
                      <Input 
                        type="number" 
                        value={receiveLost} 
                        onChange={(e) => setReceiveLost(e.target.value)}
                        className="h-8 border-none bg-transparent p-0 text-2xl font-black text-red-700 focus-visible:ring-0 shadow-none px-0"
                      />
                    </div>
                    
                    <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3 min-w-[100px]">
                      <label className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">OK Pcs</label>
                      <Input 
                        type="number" 
                        value={receiveOk} 
                        onChange={(e) => setReceiveOk(e.target.value)}
                        className="h-8 border-none bg-transparent p-0 text-2xl font-black text-emerald-700 focus-visible:ring-0 shadow-none px-0"
                      />
                    </div>
                  </div>

                  {((parseInt(receiveOk) || 0) + (parseInt(receiveDamage) || 0) + (parseInt(receiveLost) || 0)) !== card.totalReceived && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs font-medium text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <p><strong>Discrepancy Detected:</strong> The sum does not match the Expected batch size ({card.totalReceived}).</p>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Rejection Reason / Discrepancy Note</label>
                  <textarea 
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    placeholder="Required if rejecting..."
                    className="w-full h-full bg-slate-50 border border-slate-200 rounded-md text-sm p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0453B8] font-medium text-slate-700 placeholder:text-slate-400 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={rejectHandover} variant="outline" className="flex-1 bg-white hover:bg-red-50 text-red-600 border-slate-200 hover:border-red-200 h-11 font-bold shadow-sm transition-all">
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button onClick={acceptHandover} className="flex-1 bg-[#0453B8] hover:bg-blue-700 text-white h-11 font-bold shadow-sm transition-all">
                  <UserCheck className="w-4 h-4 mr-2" /> Accept
                </Button>
              </div>
            </div>
          )}

          {/* Yield & Defect Tracking (accepted state) */}
          {isAccepted && isStitching && (
            <StitchingYieldTracking 
              card={card}
              onRequestReplacement={requestReplacement}
            />
          )}

          {/* Generic Yield Tracking for non-stitching depts */}
          {isAccepted && !isStitching && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800 text-sm">Yield & Defect Tracking</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Received</span>
                  <span className="text-xl font-black text-slate-800">{card.totalReceived}</span>
                </div>
                <div className="flex gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex flex-col items-center flex-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Good</span>
                    <span className="text-lg font-black text-emerald-700">{card.goodQty}</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex flex-col items-center flex-1 relative group">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-0.5">Defect</span>
                    <span className="text-lg font-black text-red-700">{card.badQty}</span>
                    <div className="absolute inset-0 bg-red-100/95 text-red-700 opacity-0 group-hover:opacity-100 transition-opacity flex rounded-lg overflow-hidden backdrop-blur-sm">
                      <button 
                        onClick={unmarkDefect}
                        disabled={card.badQty === 0}
                        className="flex-1 flex flex-col items-center justify-center font-bold hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed border-r border-red-200/50"
                      >
                        <span className="text-xl leading-none">-</span>
                        <span className="text-[10px] uppercase">Undo</span>
                      </button>
                      <button 
                        onClick={markDefect}
                        disabled={card.goodQty === 0}
                        className="flex-1 flex flex-col items-center justify-center font-bold hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <span className="text-xl leading-none">+</span>
                        <span className="text-[10px] uppercase">Defect</span>
                      </button>
                    </div>
                  </div>
                </div>
                {card.badQty > 0 && (
                  <Button 
                    onClick={requestReplacement}
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold h-8"
                  >
                    <AlertTriangle className="w-3 h-3 mr-2" /> Request {card.badQty} Replacements
                  </Button>
                )}
                {card.pendingReplacementCount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-xs font-bold text-blue-800 mb-2">
                      Waiting on {card.pendingReplacementCount} replacements from previous phase.
                    </p>
                    <Button 
                      onClick={receiveReplacement}
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-8"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Receive Replacements
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Replacement Fulfillment View */}
          {isReplacementView && (
            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 mt-1">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Replacement Request
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                  Urgent Priority
                </span>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 text-center">
                <p className="text-sm text-slate-600 mb-2 uppercase tracking-wider font-bold">Requested Quantity</p>
                <p className="text-5xl font-black text-red-600">{card.pendingReplacementCount}</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Pieces needed by {card.currentPhase} department</p>
              </div>

              <div className="text-sm text-slate-600 mb-6 leading-relaxed">
                The <strong className="text-slate-800">{card.currentPhase}</strong> department has logged {card.pendingReplacementCount} defective pieces for Job Card <strong className="text-slate-800">{card.id}</strong>. They cannot proceed with the full batch until replacements are provided.
              </div>

              <Button 
                onClick={() => {
                  alert(`Dispatched ${card.pendingReplacementCount} replacements to ${card.currentPhase}!\n\nThis Job Card will remain in your queue until ${card.currentPhase} physically receives them.`);
                  router.push(`/production/${department.toLowerCase()}`);
                }} 
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold shadow-md text-base"
              >
                <Package className="w-5 h-5 mr-2" /> Fulfill Replacements & Dispatch
              </Button>
            </div>
          )}

          {/* Finalize & Route */}
          {isAccepted && department !== "Warehouse" && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2 text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-slate-500" /> Finalize & Route
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Once processing is complete, select the next destination.
                Routing <span className="font-bold text-emerald-600">{card.goodQty} good pieces</span>.
              </p>

              {department === "Stitching" ? (
                <div className="flex flex-col gap-2">
                  <Button onClick={() => moveToPhase("Washing")} className="w-full bg-slate-800 hover:bg-slate-900 text-white h-9 text-xs font-bold shadow-sm">
                    Send to Washing <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                  <Button onClick={() => moveToPhase("Finishing")} variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 h-9 text-xs font-bold shadow-sm bg-white">
                    Skip to Finish <CornerDownRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => moveToPhase(phases[phases.indexOf(department) + 1])} className="w-full bg-[#0453B8] hover:bg-blue-700 text-white h-9 text-xs font-bold shadow-sm">
                  Send to {phases[phases.indexOf(department) + 1]} <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
              )}
            </div>
          )}

          {/* Warehouse Finalization */}
          {isAccepted && department === "Warehouse" && (
            <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Finished Goods
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                This batch is ready to be added to finished goods inventory.
              </p>
              <Button onClick={() => { 
                alert("Job Card Completed! Added to Finished Goods Inventory."); 
                router.push("/production/warehouse"); 
              }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs font-bold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark as Completed
              </Button>
            </div>
          )}

        </div>

        {/* ════ RIGHT COLUMN (Info / Image) ════ */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">

          {/* Style Image */}
          {isStitching && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
              <div className="p-4">
                <div className="w-full h-[300px] rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <img 
                    src="/men casual tshirt.jpeg" 
                    alt="Style Image" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── BOTTOM SECTION: TABLES (50/50) ── */}
      {isStitching && (
        <div className="w-full max-w-[1600px] flex flex-col gap-4">
          <StitchingScanTracker />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="flex flex-col min-w-0">
              <StitchingRecentOperations />
            </div>
            <div className="flex flex-col min-w-0">
              <StitchingBundleOperations />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
