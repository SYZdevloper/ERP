"use client";

import { useState } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const MOCK_PENDING_TRIMS_GRNS = [
  {
    id: "TPO-8012",
    supplier: "YKK Zippers",
    material: "Metal Zippers 5#",
    qty: "5,000 Pcs",
    poDate: "2026-06-05",
    expectedDelivery: "2026-06-15",
  },
  {
    id: "TPO-8015",
    supplier: "Super Labels",
    material: "Woven Main Labels",
    qty: "10,000 Pcs",
    poDate: "2026-06-08",
    expectedDelivery: "2026-07-05",
  },
  {
    id: "TPO-8018",
    supplier: "Laxmi Buttons",
    material: "Resin Buttons 18L",
    qty: "12,200 Pcs",
    poDate: "2026-06-02",
    expectedDelivery: "2026-08-04",
  },
  {
    id: "TPO-8022",
    supplier: "Vardhman Threads",
    material: "Polyester Sewing Thread",
    qty: "500 Cones",
    poDate: "2026-08-05",
    expectedDelivery: "2026-08-15",
  }
];

export function PendingTrimsGRNs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_PENDING_TRIMS_GRNS.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDelay = (expectedDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expectedDate = new Date(expectedDateStr);
    expectedDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - expectedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (today > expectedDate && diffDays > 0) {
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 pt-0">
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden mt-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by PO, Supplier or Trim Item..."
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
                <TableHead className="px-6 py-3 w-[15%]">PO Number</TableHead>
                <TableHead className="px-6 py-3 w-[20%]">Supplier</TableHead>
                <TableHead className="px-6 py-3 w-[20%]">Trim Item</TableHead>
                <TableHead className="px-6 py-3 w-[10%]">Order Qty</TableHead>
                <TableHead className="px-6 py-3 w-[12%]">Expected Delivery</TableHead>
                <TableHead className="px-6 py-3 w-[13%]">Delay Status</TableHead>
                <TableHead className="px-6 py-3 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-slate-500">
                    No pending trims GRNs found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const delayDays = calculateDelay(item.expectedDelivery);
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell className="px-6 py-3 font-bold text-[#0453B8]">
                        {item.id}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium text-slate-800">
                        {item.supplier}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-slate-600">
                        {item.material}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium text-slate-700">
                        {item.qty}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-slate-600 font-medium">
                        {formatDate(item.expectedDelivery)}
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
                        <Link href={`/trims-store/grn/create?po=${item.id}`}>
                          <Button size="sm" className="bg-[#0453B8] hover:bg-blue-700 text-[12px] h-8">
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Receive GRN
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
