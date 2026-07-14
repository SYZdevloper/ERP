"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, Plus, MoreHorizontal, Eye, Edit2, FileText, Factory, Scissors, CheckSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { MetricCard } from "@/components/ui/metric-card";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";

const MOCK_ISSUES = [
  { id: "FI-2026-001", date: "2026-06-16", so: "SO-2026-008", style: "Winter Parka", rolls: 4, qty: 400.00, status: "Issued" },
  { id: "FI-2026-002", date: "2026-06-15", so: "SO-2026-009", style: "Basic Cotton Hoodie", rolls: 2, qty: 250.00, status: "Issued" },
  { id: "FI-2026-003", date: "2026-06-14", so: "SO-2026-010", style: "Denim Jacket", rolls: 6, qty: 600.50, status: "Draft" },
];

export default function FabricIssueListPage() {
  const [issueList] = useState(MOCK_ISSUES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredIssues = useMemo(() => {
    let filtered = issueList;
    
    if (activeTab !== "All") {
      filtered = filtered.filter(issue => issue.status === activeTab);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        issue => issue.id.toLowerCase().includes(q) || issue.so.toLowerCase().includes(q) || issue.style.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [issueList, searchQuery, activeTab]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <ListPageHeader 
        title="Fabric Issue" 
        description="Manage fabric allocations and issue to production." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Issues"
          value={issueList.length}
          subtitle="All time"
          icon={FileText}
          colorScheme="blue"
        />
        <MetricCard 
          title="Rolls Issued"
          value={issueList.reduce((acc, item) => acc + item.rolls, 0)}
          subtitle="All time"
          icon={Factory}
          colorScheme="emerald"
        />
        <MetricCard 
          title="Total Quantity"
          value={`${issueList.reduce((acc, item) => acc + item.qty, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Mtr`}
          subtitle="Issued fabric quantity"
          icon={Scissors}
          colorScheme="purple"
        />
        <MetricCard 
          title="Draft Issues"
          value={issueList.filter(o => o.status === "Draft").length}
          subtitle="Pending confirmation"
          icon={CheckSquare}
          colorScheme="amber"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        <DataTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search Issue No, SO, or Style..."
          filters={
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-slate-200">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses ({issueList.length})</SelectItem>
                <SelectItem value="Draft">Draft ({issueList.filter(o => o.status === "Draft").length})</SelectItem>
                <SelectItem value="Issued">Issued ({issueList.filter(o => o.status === "Issued").length})</SelectItem>
              </SelectContent>
            </Select>
          }
          actions={
            <>
              <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/fabric-issue/sample">
                <Button className="h-9 px-4 font-semibold shadow-md text-[13px] bg-slate-800 hover:bg-slate-700 text-white">
                  <Scissors className="w-4 h-4 mr-2" />
                  New Sample Issue
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
                  <TableHead className="px-4 py-3">Issue No.</TableHead>
                  <TableHead className="px-4 py-3">Date</TableHead>
                  <TableHead className="px-4 py-3">Sales Order</TableHead>
                  <TableHead className="px-4 py-3">Style</TableHead>
                  <TableHead className="px-4 py-3 text-center">Total Rolls</TableHead>
                  <TableHead className="px-4 py-3 text-right">Issued Qty</TableHead>
                  <TableHead className="px-4 py-3 text-center">Status</TableHead>
                  <TableHead className="px-4 py-3 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-slate-500 font-medium">No Fabric Issues found.</TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={issue.id} className="hover:bg-slate-50/50 cursor-pointer">
                      <TableCell className="px-4 py-3 text-[13px] font-bold text-[#0453B8]">
                        {issue.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-600">
                        {formatDate(issue.date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-800">
                        {issue.so}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                        {issue.style}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-800 font-bold text-center">
                        {issue.rolls}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-800 font-bold text-right">
                        {issue.qty.toLocaleString('en-IN', { minimumFractionDigits: 2 })} m
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <StatusBadge status={issue.status} />
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
                              <Edit2 className="mr-2 h-4 w-4 text-slate-400" /> Edit Issue
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
