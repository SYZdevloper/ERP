"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Download, Plus, MoreHorizontal, Eye, Edit2, FileText, IndianRupee, ClipboardList, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewPODialog } from "@/components/purchase-orders/view-po-dialog";
import { formatDate } from "@/lib/utils";
import { MetricCard } from "@/components/ui/metric-card";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";

interface PurchaseOrderListPageProps {
  title: string;
  description: string;
  itemNameLabel: string; // e.g. "Material" or "Trim Item"
  newItemHref: string;   // e.g. "/fabric-purchases/create"
  editItemHrefPrefix: string; // e.g. "/fabric-purchases" (so edit is /fabric-purchases/[id]/edit)
  mockData: any[];
}

export function PurchaseOrderListPage({
  title,
  description,
  itemNameLabel,
  newItemHref,
  editItemHrefPrefix,
  mockData
}: PurchaseOrderListPageProps) {
  const router = useRouter();
  const [poList, setPoList] = useState(mockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [displayLimit, setDisplayLimit] = useState(10);

  // Dialog state
  const [selectedPo, setSelectedPo] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const filteredPOs = useMemo(() => {
    let filtered = poList;
    
    if (activeTab !== "All") {
      filtered = filtered.filter(po => po.status === activeTab);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        po => po.id.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [poList, searchQuery, activeTab]);

  const paginatedPOs = useMemo(() => {
    return filteredPOs.slice(0, displayLimit);
  }, [filteredPOs, displayLimit]);

  const handleStatusChange = (poId: string, newStatus: string) => {
    setPoList(prevList =>
      prevList.map(item => (item.id === poId ? { ...item, status: newStatus } : item))
    );
    setSelectedPo((prevPo: any) => {
      if (prevPo && prevPo.id === poId) {
        return { ...prevPo, status: newStatus };
      }
      return prevPo;
    });
  };

  const handleEdit = (po: any) => {
    setIsViewOpen(false);
    router.push(`${editItemHrefPrefix}/${po.id}/edit`);
  };

  const handleOpenView = (po: any) => {
    setSelectedPo(po);
    setIsViewOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      {/* Header */}
      <ListPageHeader 
        title={title} 
        description={description} 
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total POs"
          value={poList.length}
          subtitle="All time"
          icon={FileText}
          colorScheme="blue"
        />
        <MetricCard 
          title="Total Spend"
          value={`₹ ${poList.reduce((acc, item) => acc + item.value, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          subtitle="All time"
          icon={IndianRupee}
          colorScheme="rose"
        />
        <MetricCard 
          title="Pending Approvals"
          value={poList.filter(o => o.status === "Approval").length}
          subtitle="Awaiting confirmation"
          icon={ClipboardList}
          colorScheme="amber"
        />
        <MetricCard 
          title="Expected Deliveries"
          value="8"
          subtitle="Next 7 days"
          icon={Truck}
          colorScheme="purple"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        {/* Controls */}
        <DataTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search Supplier..."
          filters={
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-slate-200">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses ({poList.length})</SelectItem>
                <SelectItem value="Draft">Draft ({poList.filter(o => o.status === "Draft").length})</SelectItem>
                <SelectItem value="Approval">Approval ({poList.filter(o => o.status === "Approval").length})</SelectItem>
                <SelectItem value="Approved">Approved ({poList.filter(o => o.status === "Approved").length})</SelectItem>
                <SelectItem value="Partially Received">Partially Received ({poList.filter(o => o.status === "Partially Received").length})</SelectItem>
                <SelectItem value="Received">Received ({poList.filter(o => o.status === "Received").length})</SelectItem>
              </SelectContent>
            </Select>
          }
          actions={
            <>
              <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link href={newItemHref}>
                <Button variant="primary" className="h-9 px-4 font-semibold shadow-md text-[13px]">
                  <Plus className="w-4 h-4 mr-2" />
                  New PO
                </Button>
              </Link>
            </>
          }
        />

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white m-6 mt-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4 w-[10%]">Sr No.</TableHead>
                  <TableHead className="px-4 w-[12%]">Date</TableHead>
                  <TableHead className="px-4 w-[24%]">Supplier</TableHead>
                  <TableHead className="px-4 w-[16%]">{itemNameLabel}</TableHead>
                  <TableHead className="px-4 w-[10%]">Qty</TableHead>
                  <TableHead className="px-4 w-[14%]">Amount (₹)</TableHead>
                  <TableHead className="px-4 w-[12%]">Delivery Date</TableHead>
                  <TableHead className="px-4 w-[12%] !text-center">Status</TableHead>
                  <TableHead className="px-4 !text-center w-[8%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-16 text-slate-500 font-medium">No purchase orders found.</TableCell>
                  </TableRow>
                ) : (
                  paginatedPOs.map((po, index) => (
                    <TableRow key={po.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleOpenView(po)}>
                      <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-800" onClick={(e) => e.stopPropagation()}>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-600">
                        {formatDate(po.date || po.delivery)}
                      </TableCell>
                      <TableCell className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F8FAFC] text-slate-700 flex items-center justify-center font-medium text-[13px] shrink-0 border border-slate-200">
                            {(() => {
                              const words = po.supplier.split(' ').filter(Boolean);
                              return words.length >= 2 
                                ? (words[0][0] + words[1][0]).toUpperCase()
                                : po.supplier.substring(0, 2).toUpperCase();
                            })()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-slate-800">{po.supplier}</span>
                            <span className="text-[11px] text-slate-500">{po.location}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600" onClick={(e) => e.stopPropagation()}>
                        {po.material || po.itemDesc}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium" onClick={(e) => e.stopPropagation()}>
                        {po.qty}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium" onClick={(e) => e.stopPropagation()}>
                        {po.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-slate-600" onClick={(e) => e.stopPropagation()}>
                        {formatDate(po.delivery)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={po.status} />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-200">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenView(po); }} className="cursor-pointer flex items-center font-medium text-slate-700">
                              <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(po); }} className="cursor-pointer flex items-center font-medium text-slate-700">
                              <Edit2 className="mr-2 h-4 w-4 text-slate-400" /> Edit PO
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {filteredPOs.length > displayLimit && (
              <div className="flex justify-center my-4 mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setDisplayLimit(prev => prev + 10)}
                  className="bg-white border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Load 10 More...
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ViewPODialog
        po={selectedPo}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        itemNameLabel={itemNameLabel}
      />
    </div>
  );
}
