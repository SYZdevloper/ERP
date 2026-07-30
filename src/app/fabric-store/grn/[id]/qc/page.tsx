"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, PackageCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MOCK_GRN_DATA = {
  "GRN-2026-002": {
    id: "GRN-2026-002",
    date: "2026-06-14",
    supplier: "ARVIND MILLS",
    po: "PO-098",
    rolls: [
      { id: "R-001", rollNo: "R-8001", material: "SHADOWMESH-220", length: 100, width: "60", color: "NAVY" },
      { id: "R-002", rollNo: "R-8002", material: "SHADOWMESH-220", length: 120, width: "60", color: "NAVY" },
      { id: "R-003", rollNo: "R-8003", material: "ASTROFILL-016", length: 150, width: "58", color: "BLACK" },
      { id: "R-004", rollNo: "R-8004", material: "ASTROFILL-016", length: 150, width: "58", color: "BLACK" },
    ]
  }
};

export default function FabricQcPage() {
  const params = useParams();
  const router = useRouter();
  const grnId = typeof params.id === 'string' ? params.id : "GRN-2026-002";
  
  // Fallback to a default if the specific ID isn't mocked
  const grnData = MOCK_GRN_DATA[grnId as keyof typeof MOCK_GRN_DATA] || MOCK_GRN_DATA["GRN-2026-002"];

  // State to hold shrinkage input values
  const [shrinkageData, setShrinkageData] = useState<Record<string, { lengthwise: string, widthwise: string, status: string }>>({});

  const handleShrinkageChange = (rollId: string, field: 'lengthwise' | 'widthwise' | 'status', value: string) => {
    setShrinkageData(prev => ({
      ...prev,
      [rollId]: {
        ...prev[rollId],
        [field]: value
      }
    }));
  };

  const handlePassQc = () => {
    alert("QC Shrinkage Entries Saved Successfully! GRN marked as Received.");
    router.push("/fabric-store");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/fabric-store">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Fabric QC & Shrinkage Test</h1>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                Pending QC
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">
              Enter shrinkage values for {grnData.id} • {grnData.supplier} • {grnData.po}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/fabric-store">
            <Button variant="outline" className="h-10 text-[13px] font-bold text-slate-600 border-slate-300">
              Cancel
            </Button>
          </Link>
          <Button onClick={handlePassQc} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] shadow-sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Pass QC & Save Entries
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#0453B8]" />
              <h2 className="text-sm font-bold text-slate-800">Rolls Available for Testing</h2>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-bold text-slate-600">Roll No</TableHead>
                  <TableHead className="font-bold text-slate-600">Material / Color</TableHead>
                  <TableHead className="font-bold text-slate-600 text-center">Length (m)</TableHead>
                  <TableHead className="font-bold text-slate-600 text-center">Width (in)</TableHead>
                  <TableHead className="font-bold text-[#0453B8] bg-blue-50/50">Shrinkage Lengthwise (%)</TableHead>
                  <TableHead className="font-bold text-[#0453B8] bg-blue-50/50">Shrinkage Widthwise (%)</TableHead>
                  <TableHead className="font-bold text-[#0453B8] bg-blue-50/50">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grnData.rolls.map(roll => (
                  <TableRow key={roll.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-700">{roll.rollNo}</TableCell>
                    <TableCell>
                      <div className="text-[13px] font-bold text-slate-800">{roll.material}</div>
                      <div className="text-xs text-slate-500">{roll.color}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{roll.length}</TableCell>
                    <TableCell className="text-center font-medium">{roll.width}&quot;</TableCell>
                    <TableCell className="bg-blue-50/30">
                      <Input 
                        type="number"
                        placeholder="e.g. -2.5"
                        className="w-full h-8 text-[13px] border-blue-200 focus-visible:ring-blue-500"
                        value={shrinkageData[roll.id]?.lengthwise || ""}
                        onChange={(e) => handleShrinkageChange(roll.id, 'lengthwise', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="bg-blue-50/30">
                      <Input 
                        type="number"
                        placeholder="e.g. -1.0"
                        className="w-full h-8 text-[13px] border-blue-200 focus-visible:ring-blue-500"
                        value={shrinkageData[roll.id]?.widthwise || ""}
                        onChange={(e) => handleShrinkageChange(roll.id, 'widthwise', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="bg-blue-50/30">
                      <Select 
                        value={shrinkageData[roll.id]?.status || "Pass"} 
                        onValueChange={(val) => handleShrinkageChange(roll.id, 'status', val)}
                      >
                        <SelectTrigger className="h-8 text-[13px] w-[110px] bg-white border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pass" className="text-emerald-700 font-medium">Pass</SelectItem>
                          <SelectItem value="Reject" className="text-red-700 font-medium">Reject</SelectItem>
                          <SelectItem value="Hold" className="text-amber-700 font-medium">Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
            <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold mb-1">Testing Guidelines</p>
              <p className="text-blue-700/80">Negative values indicate shrinkage, positive values indicate elongation. Rolls marked as &quot;Reject&quot; will be held back from being allocated to job cards until physically disposed or returned to the supplier.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
