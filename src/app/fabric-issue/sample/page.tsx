"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Factory, AlertCircle, Scissors } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListPageHeader } from "@/components/ui/list-page-header";

// Mock Data for Available Rolls
const MOCK_ROLLS = [
  { id: "ROLL-001", name: "Roll 1 - Basic Cotton", item: "Basic Cotton", lot: "L-2026-A", availableQty: 100 },
  { id: "ROLL-002", name: "Roll 2 - Denim Blue", item: "Denim Blue", lot: "L-2026-B", availableQty: 50.5 },
  { id: "ROLL-003", name: "Roll 3 - Winter Fleece", item: "Winter Fleece", lot: "L-2026-C", availableQty: 15.25 },
];

export default function SampleFabricIssuePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [styleName, setStyleName] = useState("");
  const [selectedRollId, setSelectedRollId] = useState("");
  const [issueQuantity, setIssueQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const selectedRoll = MOCK_ROLLS.find(r => r.id === selectedRollId);
  const availableQty = selectedRoll ? selectedRoll.availableQty : 0;
  const issueQtyNum = parseFloat(issueQuantity) || 0;
  const remainingQty = selectedRollId ? Math.max(0, availableQty - issueQtyNum) : 0;

  const isOverIssue = issueQtyNum > availableQty;

  const handleSave = () => {
    // In a real app, this would submit to API
    alert(`Successfully issued ${issueQtyNum} m of fabric for sample ${styleName}. Remaining roll stock: ${remainingQty} m.`);
    window.location.href = "/fabric-issue";
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/fabric-issue">
          <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 bg-white shadow-sm">
            <ArrowLeft className="h-4 w-4 text-slate-500" />
          </Button>
        </Link>
        <ListPageHeader 
          title="New Sample Issue" 
          description="Issue fabric directly from available roll stock for sample making." 
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-full">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-800 flex items-center">
            <Scissors className="h-4 w-4 mr-2 text-[#0453B8]" />
            Sample Details
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">Provide details for the sample you are creating.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-slate-700">Issue Date <span className="text-red-500">*</span></Label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-slate-700">Style / Sample Name <span className="text-red-500">*</span></Label>
            <Input 
              placeholder="e.g. Winter Parka Prototye" 
              value={styleName} 
              onChange={(e) => setStyleName(e.target.value)} 
              className="h-9"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-800 flex items-center mb-1">
            <Factory className="h-4 w-4 mr-2 text-[#0453B8]" />
            Fabric Roll Selection & Issue
          </h2>
          <p className="text-[13px] text-slate-500 mb-6">Select a roll from stock and specify how much fabric is required.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-2 lg:col-span-2">
              <Label className="text-[13px] font-medium text-slate-700">Select Roll <span className="text-red-500">*</span></Label>
              <Select value={selectedRollId} onValueChange={setSelectedRollId}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select an available roll" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ROLLS.map(roll => (
                    <SelectItem key={roll.id} value={roll.id}>
                      {roll.name} (Lot: {roll.lot}) - {roll.availableQty} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-slate-700">Available Qty (m)</Label>
              <div className="h-9 flex items-center px-3 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-bold text-slate-600">
                {selectedRollId ? `${availableQty.toFixed(2)} m` : "--"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-slate-700">Issue Qty (m) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                min="0" 
                step="0.1" 
                placeholder="e.g. 1.50" 
                value={issueQuantity} 
                onChange={(e) => setIssueQuantity(e.target.value)} 
                className={`h-9 font-semibold ${isOverIssue ? 'border-red-300 text-red-600 focus-visible:ring-red-500' : ''}`}
                disabled={!selectedRollId}
              />
            </div>
          </div>
          
          {isOverIssue && (
            <div className="mt-2 text-[12px] font-medium text-red-600 flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Cannot issue more than available roll quantity.
            </div>
          )}

          {selectedRollId && !isOverIssue && issueQtyNum > 0 && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-emerald-800">Remaining Roll Stock</div>
                <div className="text-[12px] text-emerald-600 mt-0.5">Calculated actual fabric left in stock after issue</div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {remainingQty.toFixed(2)} <span className="text-sm font-semibold">m</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-slate-700">Remarks (Optional)</Label>
            <Input 
              placeholder="Any additional notes..." 
              value={remarks} 
              onChange={(e) => setRemarks(e.target.value)} 
              className="h-9"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <Link href="/fabric-issue">
            <Button variant="outline" className="h-9 px-4 text-[13px] font-medium">
              Cancel
            </Button>
          </Link>
          <Button 
            className="h-9 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-semibold text-[13px] shadow-sm"
            disabled={!selectedRollId || !issueQuantity || isOverIssue || !styleName || !date}
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Sample Issue
          </Button>
        </div>
      </div>
    </div>
  );
}
