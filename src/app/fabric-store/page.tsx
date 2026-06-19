"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, Plus, MoreHorizontal, Eye, Edit2, FileText, IndianRupee, PackageCheck, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { MetricCard } from "@/components/ui/metric-card";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";

const MOCK_GRNS = [
  { id: "GRN-2026-001", date: "2026-06-15", po: "PO-102", supplier: "SALASAR FASHION", rolls: 12, qty: 1250.50, value: 218750.00, status: "Received" },
  { id: "GRN-2026-002", date: "2026-06-14", po: "PO-098", supplier: "ARVIND MILLS", rolls: 8, qty: 820.00, value: 147600.00, status: "Pending QC" },
  { id: "GRN-2026-003", date: "2026-06-12", po: "PO-095", supplier: "VARDHMAN TEXTILES", rolls: 24, qty: 2450.75, value: 367612.50, status: "Received" },
  { id: "GRN-2026-004", date: "2026-06-10", po: "PO-091", supplier: "SALASAR FASHION", rolls: 5, qty: 480.20, value: 84035.00, status: "Draft" },
];

export default function GrnListPage() {
  const [grnList] = useState(MOCK_GRNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredGRNs = useMemo(() => {
    let filtered = grnList;
    
    if (activeTab !== "All") {
      filtered = filtered.filter(grn => grn.status === activeTab);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        grn => grn.id.toLowerCase().includes(q) || grn.supplier.toLowerCase().includes(q) || grn.po.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [grnList, searchQuery, activeTab]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <ListPageHeader 
        title="Goods Receipt Notes (GRN)" 
        description="Manage fabric receipts and roll-wise entries" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total GRNs"
          value={grnList.length}
          subtitle="All time"
          icon={FileText}
          colorScheme="blue"
        />
        <MetricCard 
          title="Total Rolls Received"
          value={grnList.reduce((acc, item) => acc + item.rolls, 0)}
          subtitle="All time"
          icon={PackageCheck}
          colorScheme="emerald"
        />
        <MetricCard 
          title="Total Value"
          value={`₹ ${grnList.reduce((acc, item) => acc + item.value, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          subtitle="Received goods value"
          icon={IndianRupee}
          colorScheme="purple"
        />
        <MetricCard 
          title="Pending QC"
          value={grnList.filter(o => o.status === "Pending QC").length}
          subtitle="Awaiting inspection"
          icon={ClipboardCheck}
          colorScheme="amber"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        <DataTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search GRN, PO, or Supplier..."
          filters={
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-slate-200">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses ({grnList.length})</SelectItem>
                <SelectItem value="Draft">Draft ({grnList.filter(o => o.status === "Draft").length})</SelectItem>
                <SelectItem value="Pending QC">Pending QC ({grnList.filter(o => o.status === "Pending QC").length})</SelectItem>
                <SelectItem value="Received">Received ({grnList.filter(o => o.status === "Received").length})</SelectItem>
              </SelectContent>
            </Select>
          }
          actions={
            <>
              <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/fabric-store/grn/create">
                <Button className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New GRN
                </Button>
              </Link>
            </>
          }
        />

        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white m-6 mt-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4 py-3">GRN No.</TableHead>
                  <TableHead className="px-4 py-3">Date</TableHead>
                  <TableHead className="px-4 py-3">Supplier</TableHead>
                  <TableHead className="px-4 py-3">PO No.</TableHead>
                  <TableHead className="px-4 py-3 text-center">Total Rolls</TableHead>
                  <TableHead className="px-4 py-3 text-right">Received Qty</TableHead>
                  <TableHead className="px-4 py-3 text-right">Amount (₹)</TableHead>
                  <TableHead className="px-4 py-3 text-center">Status</TableHead>
                  <TableHead className="px-4 py-3 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGRNs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-16 text-slate-500 font-medium">No GRNs found.</TableCell>
                  </TableRow>
                ) : (
                  filteredGRNs.map((grn) => (
                    <TableRow key={grn.id} className="hover:bg-slate-50/50 cursor-pointer">
                      <TableCell className="px-4 py-3 text-[13px] font-bold text-[#0453B8]">
                        {grn.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-600">
                        {formatDate(grn.date)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F8FAFC] text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-slate-200">
                            {grn.supplier.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-[13px] font-medium text-slate-800">{grn.supplier}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                        {grn.po}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-800 font-bold text-center">
                        {grn.rolls}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-800 font-bold text-right">
                        {grn.qty.toLocaleString('en-IN', { minimumFractionDigits: 2 })} m
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium text-right">
                        {grn.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <StatusBadge status={grn.status} />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-200">
                            <DropdownMenuItem className="cursor-pointer flex items-center font-medium text-slate-700">
                              <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center font-medium text-slate-700">
                              <Edit2 className="mr-2 h-4 w-4 text-slate-400" /> Edit GRN
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
