"use client";

import { useState } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const MOCK_PENDING_TRIMS_POS = [
  {
    id: "SO-2026-081",
    client: "Zara",
    style: "AW26-Jacket",
    material: "Metal Zippers 5#",
    qty: "4,500 Pcs",
    soDate: "2026-08-04",
  },
  {
    id: "SO-2026-085",
    client: "H&M",
    style: "SS27-Shirt",
    material: "Resin Buttons 18L",
    qty: "12,200 Pcs",
    soDate: "2026-07-28",
  },
  {
    id: "SO-2026-092",
    client: "Levis",
    style: "FW26-Jeans",
    material: "Leather Brand Patches",
    qty: "8,000 Pcs",
    soDate: "2026-08-06",
  },
  {
    id: "SO-2026-095",
    client: "Uniqlo",
    style: "FW26-Basic",
    material: "Woven Main Labels",
    qty: "12,000 Pcs",
    soDate: "2026-08-07",
  }
];

export function PendingTrimsPOs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_PENDING_TRIMS_POS.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDelay = (soDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const soDate = new Date(soDateStr);
    soDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - soDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (today > soDate && diffDays > 0) {
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 pt-0">
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden mt-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by SO, Client or Trim Item..."
              className="pl-9 h-9 bg-slate-50 border-slate-200 text-[13px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead className="px-6 py-3 w-[15%]">SO Number</TableHead>
                <TableHead className="px-6 py-3 w-[15%]">Client</TableHead>
                <TableHead className="px-6 py-3 w-[15%]">Style</TableHead>
                <TableHead className="px-6 py-3 w-[20%]">Required Trim</TableHead>
                <TableHead className="px-6 py-3 w-[10%]">Req. Qty</TableHead>
                <TableHead className="px-6 py-3 w-[12%]">SO Date</TableHead>
                <TableHead className="px-6 py-3 w-[13%]">Delay Status</TableHead>
                <TableHead className="px-6 py-3 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-slate-500">
                    No pending trims POs found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const delayDays = calculateDelay(item.soDate);
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell className="px-6 py-3 font-bold text-[#0453B8]">
                        {item.id}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium text-slate-800">
                        {item.client}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-slate-600">
                        {item.style}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-slate-600">
                        {item.material}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium text-slate-700">
                        {item.qty}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-slate-600 font-medium">
                        {formatDate(item.soDate)}
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        {delayDays > 0 ? (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-[12px] bg-red-50 border border-red-100 px-2.5 py-1 rounded-md w-fit">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Delay by {delayDays} {delayDays === 1 ? 'Day' : 'Days'}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[12px] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md w-fit">
                            On Time
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-center">
                        <Link href={`/trims-purchases/create?so=${item.id}`}>
                          <Button size="sm" className="bg-[#0453B8] hover:bg-blue-700 text-[12px] h-8">
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Raise PO
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
