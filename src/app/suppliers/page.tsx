"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AddSupplierDialog } from "@/components/suppliers/add-supplier-dialog";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { MetricCard } from "@/components/ui/metric-card";
import { Users, Clock, AlertTriangle, ShoppingCart, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MOCK_SUPPLIERS: Supplier[] = [
  { code: "SUP-100", name: "Arvind Mills", contactPerson: "Rakesh", phone: "+91 9810000000", category: "Fabric", onTimePct: 86, rejectionPct: 0.4, openPos: 0, billingAddress: "Ahmedabad, Gujarat" },
  { code: "SUP-101", name: "Vardhman Textiles", contactPerson: "Vinod", phone: "+91 9810000013", category: "Fabric", onTimePct: 87, rejectionPct: 0.8, openPos: 1, billingAddress: "Ludhiana, Punjab" },
  { code: "SUP-102", name: "Raymond Fabrics", contactPerson: "Asha", phone: "+91 9810000026", category: "Fabric", onTimePct: 88, rejectionPct: 1.2, openPos: 2, billingAddress: "Mumbai, Maharashtra" },
  { code: "SUP-103", name: "Welspun", contactPerson: "Tariq", phone: "+91 9810000039", category: "Fabric", onTimePct: 89, rejectionPct: 1.6, openPos: 3, billingAddress: "Anjar, Gujarat" },
  { code: "SUP-104", name: "Trim & Co.", contactPerson: "Rakesh", phone: "+91 9810000052", category: "Both", onTimePct: 90, rejectionPct: 2.0, openPos: 4, billingAddress: "New Delhi, Delhi" },
  { code: "SUP-105", name: "Button House", contactPerson: "Vinod", phone: "+91 9810000065", category: "Trims", onTimePct: 91, rejectionPct: 2.4, openPos: 0, billingAddress: "Tirupur, Tamil Nadu" }
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate metrics
  const avgOnTime = suppliers.length ? Math.round(suppliers.reduce((acc, s) => acc + s.onTimePct, 0) / suppliers.length) : 0;
  const avgRejection = suppliers.length ? (suppliers.reduce((acc, s) => acc + s.rejectionPct, 0) / suppliers.length).toFixed(1) : 0;
  const totalOpenPos = suppliers.reduce((acc, s) => acc + s.openPos, 0);

  const handleAddSupplier = (data: any) => {
    const newCode = `SUP-${100 + suppliers.length}`;
    const newSupplier: Supplier = {
      code: newCode,
      name: data.name,
      contactPerson: data.contactPerson,
      phone: data.phone,
      category: data.category,
      onTimePct: 100, // Default for new supplier
      rejectionPct: 0,
      openPos: 0,
      email: data.email,
      gstState: data.gstState,
      gstin: data.gstin,
      paymentTerms: data.paymentTerms,
      creditDays: parseInt(data.creditDays),
      billingAddress: data.billingAddress
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleUpdateSupplier = (data: any) => {
    if (!editSupplier) return;
    setSuppliers(suppliers.map(s => 
      s.code === editSupplier.code 
        ? { ...s, ...data, creditDays: parseInt(data.creditDays) } 
        : s
    ));
    setEditSupplier(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-8">
        
        {/* Header */}
        <ListPageHeader 
          title="Suppliers"
          description="Vendor master & performance"
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            title="Total Suppliers"
            value={suppliers.length}
            subtitle="Active vendors"
            icon={Users}
            colorScheme="blue"
          />
          <MetricCard 
            title="Avg On-Time"
            value={`${avgOnTime}%`}
            subtitle="Delivery performance"
            icon={Clock}
            colorScheme="emerald"
          />
          <MetricCard 
            title="Avg Rejection"
            value={`${avgRejection}%`}
            subtitle="Quality control"
            icon={AlertTriangle}
            colorScheme="rose"
          />
          <MetricCard 
            title="Open POs"
            value={totalOpenPos}
            subtitle="Active orders"
            icon={ShoppingCart}
            colorScheme="purple"
          />
        </div>

        {/* List Container */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden flex flex-col flex-1">
          {/* Toolbar */}
          <DataTableToolbar 
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search Name or Code..."
            filters={
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-slate-200">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Fabric">Fabric</SelectItem>
                  <SelectItem value="Trims">Trims</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            }
            actions={
              <>
                <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  onClick={() => setIsAddOpen(true)}
                  variant="primary" 
                  className="h-9 px-4 font-semibold shadow-md text-[13px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </>
            }
          />

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white m-6 mt-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-4 w-[6%]">Sr No.</TableHead>
                    <TableHead className="px-4 w-[10%]">Code</TableHead>
                    <TableHead className="px-4 w-[24%]">Supplier</TableHead>
                    <TableHead className="px-4 w-[12%]">Contact</TableHead>
                    <TableHead className="px-4 w-[14%]">Phone</TableHead>
                    <TableHead className="px-4 w-[10%]">Category</TableHead>
                    <TableHead className="px-4 w-[10%]">On-Time %</TableHead>
                    <TableHead className="px-4 w-[10%]">Rejection %</TableHead>
                    <TableHead className="px-4 w-[10%] text-center">Open POs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16 text-slate-500 font-medium">No suppliers found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier, index) => (
                      <TableRow key={supplier.code} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setEditSupplier(supplier)}>
                        <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-800">
                          {String(index + 1).padStart(2, '0')}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-600">
                          {supplier.code}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#F8FAFC] text-slate-700 flex items-center justify-center font-medium text-[13px] shrink-0 border border-slate-200">
                              {(() => {
                                const words = supplier.name.split(' ').filter(Boolean);
                                return words.length >= 2 
                                  ? (words[0][0] + words[1][0]).toUpperCase()
                                  : supplier.name.substring(0, 2).toUpperCase();
                              })()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-medium text-slate-800">{supplier.name}</span>
                              <span className="text-[11px] text-slate-500">{supplier.billingAddress}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                          {supplier.contactPerson}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                          {supplier.phone}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                          {supplier.category}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                          {supplier.onTimePct}%
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                          {supplier.rejectionPct}%
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">
                          {supplier.openPos}
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

      <AddSupplierDialog 
        open={isAddOpen || !!editSupplier} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditSupplier(null);
          }
        }} 
        onSave={editSupplier ? handleUpdateSupplier : handleAddSupplier}
        editSupplier={editSupplier}
      />
    </div>
  );
}
