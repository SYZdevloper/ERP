"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockSamples, Sample, SampleStatus } from "@/data/mock-samples";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle2, Clock, MapPin, User, FileText, ChevronRight } from "lucide-react";

export default function SampleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [sample, setSample] = useState<Sample | undefined>(mockSamples.find(s => s.id === id));
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState("");

  if (!sample) {
    return (
      <div className="flex flex-col h-full p-6 items-center justify-center">
        <h2 className="text-xl font-bold text-slate-700">Sample Not Found</h2>
        <Button className="mt-4" onClick={() => router.push("/samples")}>Back to Tracking</Button>
      </div>
    );
  }

  const getNextAction = (status: SampleStatus) => {
    switch (status) {
      case "Fabric Pending": return { label: "Receive Fabric (GRN)", newStatus: "Fabric Issued", newLoc: "Sample Maker WIP" };
      case "Fabric Issued": return { label: "Complete Stitching", newStatus: "Stitching Complete", newLoc: "Sample Department" };
      case "Stitching Complete": return sample.embroideryRequired 
        ? { label: "Send to Embroidery", newStatus: "Embroidery Outward", newLoc: "XYZ Embroidery" }
        : { label: "Complete Sample", newStatus: "Sample Complete", newLoc: "Sample Store" };
      case "Embroidery Outward": return { label: "Receive from Embroidery", newStatus: "Embroidery Return", newLoc: "Sample Department" };
      case "Embroidery Return": return { label: "Complete Sample", newStatus: "Sample Complete", newLoc: "Sample Store" };
      case "Sample Complete": return { label: "Issue to Marketing", newStatus: "Marketing Issue", newLoc: "Marketing" };
      case "Marketing Issue": return { label: "Receive from Marketing", newStatus: "Marketing Return", newLoc: "Sample Store" };
      case "Marketing Return": return { label: "Dispatch to Buyer", newStatus: "Buyer Dispatch", newLoc: "Buyer" };
      default: return null;
    }
  };

  const nextAction = getNextAction(sample.status);

  const confirmNextAction = () => {
    if (!nextAction) return;
    
    const newEvent = {
      id: `EV-${Date.now()}`,
      type: nextAction.newStatus,
      date: new Date().toISOString().split('T')[0],
      actor: "Current User",
      notes: actionNotes || `Status updated to ${nextAction.newStatus}`
    };

    setSample(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: nextAction.newStatus as SampleStatus,
        currentLocation: nextAction.newLoc,
        lastMovementDate: newEvent.date,
        history: [...prev.history, newEvent]
      };
    });
    
    // reset dialog state
    setIsDialogOpen(false);
    setActionNotes("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto">
      {/* Header aligned with ERP theme */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/samples")} className="h-9 w-9 border-slate-200 text-slate-600 bg-white shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0453B8]">{sample.id}</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wider text-[10px] font-bold">
                {sample.status}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">Article: {sample.article} &bull; Type: {sample.sampleType}</p>
          </div>
        </div>
        
        {nextAction && (
          <Button className="h-10 px-5 bg-[#0453B8] hover:bg-[#034294] text-white shadow-md font-semibold" onClick={() => setIsDialogOpen(true)}>
            {nextAction.label} <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> Current Tracking
              </h3>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Location</div>
                <div className="font-semibold text-slate-800 text-base">{sample.currentLocation}</div>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Holder</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{sample.currentHolder}</span>
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Last Movement</div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock className="w-4 h-4 text-amber-500" /> {sample.lastMovementDate}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> Sample Specifications
              </h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Fabric</div>
                <div className="text-sm font-semibold text-slate-800">{sample.fabric}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Color</div>
                <div className="text-sm font-semibold text-slate-800">{sample.color}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Required Qty</div>
                <div className="text-sm font-semibold text-slate-800">{sample.requiredQty}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Embroidery</div>
                <div className="text-sm font-semibold text-slate-800">{sample.embroideryRequired ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Chain of Custody */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-lg">Chain of Custody</h3>
              <p className="text-xs text-slate-500 mt-1">Complete movement history of this sample</p>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                {sample.history.map((event, index) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-50 text-[#0453B8] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800 text-[15px]">{event.type}</h4>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{event.date}</span>
                      </div>
                      <p className="text-[13px] text-slate-500 mb-3 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> <span className="font-semibold text-slate-700">{event.actor}</span>
                      </p>
                      {event.notes && (
                        <div className="text-[13px] text-slate-700 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50 leading-relaxed italic">
                          "{event.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for capturing notes during state change */}
      {nextAction && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Status to "{nextAction.newStatus}"</DialogTitle>
              <DialogDescription>
                This will move the sample to <strong>{nextAction.newLoc}</strong>. Please enter any relevant notes below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-sm font-medium text-slate-700">
                  Notes / Issues <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="notes"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Stitched successfully, 2m fabric used. Minor adjustments needed on hem..."
                  className="w-full min-h-[100px] text-sm border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0453B8] text-slate-900 bg-white resize-none rounded-md border p-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmNextAction} 
                className="bg-[#0453B8] hover:bg-[#034294]"
                disabled={actionNotes.trim().length === 0}
              >
                Confirm Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
