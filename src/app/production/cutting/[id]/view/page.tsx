"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Scissors, Hash, Tag, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useProduction } from "@/components/production/production-context";

// Mock Rolls for demonstration
const MOCK_ROLLS = [
  { id: "Roll-1", material: "NYLON-TASLAN-04", qty: 50 },
  { id: "Roll-2", material: "NYLON-TASLAN-04", qty: 50 },
  { id: "Roll-3", material: "NYLON-TASLAN-04", qty: 50 },
];

export default function CuttingJobCardView() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { jobCards } = useProduction();
  
  const jobCard = jobCards.find(c => c.id === id);

  const [selectedRoll, setSelectedRoll] = useState<string>("");
  const [layerLength, setLayerLength] = useState<string>("");
  const [noOfLayers, setNoOfLayers] = useState<string>("");
  const [actualLeftover, setActualLeftover] = useState<string>("");
  const [cutSizes, setCutSizes] = useState({ S: "", M: "", L: "", XL: "" });
  const [isSaved, setIsSaved] = useState(false);

  const activeRoll = MOCK_ROLLS.find(r => r.id === selectedRoll);
  
  const length = parseFloat(layerLength) || 0;
  const layers = parseInt(noOfLayers) || 0;
  const fabricUsed = length * layers;
  
  const systemRemaining = activeRoll ? activeRoll.qty - fabricUsed : 0;
  
  const leftover = parseFloat(actualLeftover) || 0;
  // If actual leftover is provided, shortage is what the system thinks is remaining minus what is actually left.
  const shortage = actualLeftover !== "" ? systemRemaining - leftover : 0;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      router.push("/production/cutting");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/production/cutting">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm rounded-md border-slate-200">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Cutting: {id}</h1>
            <p className="text-sm text-slate-500 font-medium">Manage fabric layering and cut sizes.</p>
          </div>
        </div>
        
        <div>
          <Button 
            onClick={handleSave}
            disabled={!selectedRoll || isSaved}
            className={`h-10 px-6 font-bold shadow-sm transition-all ${isSaved ? 'bg-emerald-600 text-white' : 'bg-[#0453B8] hover:bg-blue-700 text-white hover:shadow-md'}`}
          >
            {isSaved ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Record Saved</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Layering Record</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Techpack Info */}
        <div className="w-full lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-[#0453B8]" />
              Techpack Details
            </h3>
            
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Brand Name</span>
                <span className="text-sm font-bold text-slate-800">Essentials</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Style</span>
                <span className="text-sm font-bold text-slate-800">{jobCard?.style || "Basic Cotton Hoodie"}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Scissors className="w-3.5 h-3.5"/> Size Ratio</span>
                <span className="text-sm font-bold text-slate-800">1 : 2 : 2 : 1 (S : M : L : XL)</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Pattern Number</span>
                <span className="text-sm font-bold text-slate-800">PTRN-2026-X8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Layering & Cutting */}
        <div className="w-full lg:col-span-2 flex flex-col gap-6">
          
          {/* Layering Calculation */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <Scissors className="w-5 h-5 text-[#0453B8]" />
              Roll Layering
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Fabric Roll</label>
                <Select value={selectedRoll} onValueChange={setSelectedRoll}>
                  <SelectTrigger className="h-12 border-slate-200 focus:ring-[#0453B8] font-bold text-slate-800 text-base">
                    <SelectValue placeholder="Select a roll" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ROLLS.map(roll => (
                      <SelectItem key={roll.id} value={roll.id} className="font-semibold">
                        {roll.id} - {roll.qty} Meter ({roll.material})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeRoll && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Layer Length (Mtr)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5"
                      value={layerLength}
                      onChange={(e) => setLayerLength(e.target.value)}
                      className="h-12 font-bold text-slate-800 focus:ring-[#0453B8]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">No. of Layers</label>
                    <Input 
                      type="number" 
                      placeholder="e.g., 9"
                      value={noOfLayers}
                      onChange={(e) => setNoOfLayers(e.target.value)}
                      className="h-12 font-bold text-slate-800 focus:ring-[#0453B8]"
                    />
                  </div>

                  <div className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fabric Used</span>
                      <span className="text-2xl font-black text-slate-800">{fabricUsed.toFixed(2)} <span className="text-sm font-semibold text-slate-500">Mtr</span></span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">System Remaining</span>
                      <span className={`text-2xl font-black ${systemRemaining < 0 ? 'text-red-500' : 'text-[#0453B8]'}`}>{systemRemaining.toFixed(2)} <span className="text-sm font-semibold text-slate-500">Mtr</span></span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Actual Leftover (Mtr)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g., 3"
                      value={actualLeftover}
                      onChange={(e) => setActualLeftover(e.target.value)}
                      className="h-12 font-bold text-slate-800 focus:ring-[#0453B8]"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Shortage</label>
                    <div className={`h-12 rounded-md border flex items-center px-4 font-bold ${shortage > 0 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      {shortage > 0 ? `${shortage.toFixed(2)} Mtr Shortage` : '0.00 Mtr'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sizes Cut Section */}
          <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-6 transition-all duration-300 ${activeRoll ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
             <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <Hash className="w-5 h-5 text-[#0453B8]" />
              No. of Pcs Cut Sizewise
            </h3>
            
            <div className="grid grid-cols-4 gap-4">
              {Object.keys(cutSizes).map((size) => (
                <div key={size}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-center bg-slate-100 py-1 rounded border border-slate-200">Size {size}</label>
                  <Input 
                    type="number" 
                    placeholder="Qty"
                    value={cutSizes[size as keyof typeof cutSizes]}
                    onChange={(e) => setCutSizes({...cutSizes, [size]: e.target.value})}
                    className="h-12 text-center font-bold text-slate-800 focus:ring-[#0453B8] text-lg"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
