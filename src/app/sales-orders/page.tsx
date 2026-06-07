"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, Plus, MoreHorizontal, Eye, Edit2, FileText, IndianRupee, ClipboardList, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";

export default function SalesOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [displayLimit, setDisplayLimit] = useState(10);

  const filteredOrders = useMemo(() => {
    let filtered = MOCK_SALES_ORDERS_LIST;
    
    if (activeTab !== "All") {
      filtered = filtered.filter(order => order.status === activeTab);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => order.soNo.toLowerCase().includes(q) || order.buyer.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [searchQuery, activeTab]);

  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(0, displayLimit);
  }, [filteredOrders, displayLimit]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
       {/* Header */}
       <div className="flex items-center justify-between mb-4">
         <div>
           <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
           <p className="text-sm text-slate-500 mt-1">All buyer orders, planning and dispatch status</p>
         </div>
       </div>

       {/* Metric Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         {/* Card 1 */}
         <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
             <FileText className="w-6 h-6" />
           </div>
           <div className="flex flex-col">
             <span className="text-[13px] font-medium text-slate-500">Total Orders</span>
             <span className="text-2xl font-bold text-slate-800 leading-tight">127</span>
             <span className="text-[11px] text-slate-400 mt-0.5">All time</span>
           </div>
         </div>

         {/* Card 2 */}
         <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
             <IndianRupee className="w-6 h-6" />
           </div>
           <div className="flex flex-col">
             <span className="text-[13px] font-medium text-slate-500">Total Order Value</span>
             <span className="text-2xl font-bold text-slate-800 leading-tight">₹ 2.45 Cr</span>
             <span className="text-[11px] text-slate-400 mt-0.5">All time</span>
           </div>
         </div>

         {/* Card 3 */}
         <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
             <ClipboardList className="w-6 h-6" />
           </div>
           <div className="flex flex-col">
             <span className="text-[13px] font-medium text-slate-500">Pending Orders</span>
             <span className="text-2xl font-bold text-slate-800 leading-tight">23</span>
             <span className="text-[11px] text-slate-400 mt-0.5">Awaiting confirmation</span>
           </div>
         </div>

         {/* Card 4 */}
         <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
             <Truck className="w-6 h-6" />
           </div>
           <div className="flex flex-col">
             <span className="text-[13px] font-medium text-slate-500">Deliveries This Week</span>
             <span className="text-2xl font-bold text-slate-800 leading-tight">14</span>
             <span className="text-[11px] text-slate-400 mt-0.5">Next 7 days</span>
           </div>
         </div>
       </div>

       {/* Main Card */}
       <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
         {/* Controls */}
         <div className="px-6 py-4 border-b border-slate-100 flex flex-col gap-4">
           
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="relative w-80">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                 <Input 
                   placeholder="Search orders..." 
                   className="pl-9 h-9 bg-slate-50/50 border-slate-200 text-[13px] focus-visible:ring-[#0453B8]"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               
               <Select value={activeTab} onValueChange={setActiveTab}>
                 <SelectTrigger className="w-[160px] h-9 text-[13px] bg-white border-slate-200">
                   <SelectValue placeholder="Filter by Status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="All">All Statuses ({MOCK_SALES_ORDERS_LIST.length})</SelectItem>
                   <SelectItem value="Draft">Draft ({MOCK_SALES_ORDERS_LIST.filter(o => o.status === "Draft").length})</SelectItem>
                   <SelectItem value="Confirmed">Confirmed ({MOCK_SALES_ORDERS_LIST.filter(o => o.status === "Confirmed").length})</SelectItem>
                   <SelectItem value="Cancelled">Cancelled ({MOCK_SALES_ORDERS_LIST.filter(o => o.status === "Cancelled").length})</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             <div className="flex items-center gap-3">
               <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                 <Download className="w-4 h-4 mr-2" />
                 Export CSV
               </Button>
               <Link href="/sales-orders/create">
                 <Button variant="primary" className="h-9 px-4 font-semibold shadow-md text-[13px]">
                   <Plus className="w-4 h-4 mr-2" />
                   New Sales Order
                 </Button>
               </Link>
             </div>
           </div>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-auto custom-scrollbar">
           <div className="border border-slate-200 rounded-lg overflow-hidden bg-white m-6 mt-0">
             <Table>
               <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-4 w-[14%]">Sr No.</TableHead>
                    <TableHead className="px-4 w-[12%]">Date</TableHead>
                    <TableHead className="px-4 w-[24%]">Buyer</TableHead>
                    <TableHead className="px-4 w-[15%]">Amount (₹)</TableHead>
                    <TableHead className="px-4 w-[15%]">Delivery Date</TableHead>
                    <TableHead className="px-4 w-[12%] !text-center">Delivery Status</TableHead>
                    <TableHead className="px-4 !text-center w-[8%]">Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                 {paginatedOrders.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={7} className="text-center py-16 text-slate-500 font-medium">No orders found.</TableCell>
                   </TableRow>
                 ) : (
                   paginatedOrders.map((order, index) => (
                     <TableRow key={order.id}>
                       <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-800">
                         {String(index + 1).padStart(2, '0')}
                       </TableCell>
                       <TableCell className="px-4 py-3 text-[13px] text-slate-600">{order.orderDate}</TableCell>
                       <TableCell className="px-4 py-3">
                         <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-[#F8FAFC] text-slate-700 flex items-center justify-center font-medium text-[13px] shrink-0 border border-slate-200">
                             {(() => {
                               const words = order.buyer.split(' ').filter(Boolean);
                               return words.length >= 2 
                                 ? (words[0][0] + words[1][0]).toUpperCase()
                                 : order.buyer.substring(0, 2).toUpperCase();
                             })()}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[13px] font-medium text-slate-800">{order.buyer}</span>
                             <span className="text-[11px] text-slate-500">{order.location}</span>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-medium">
                         {order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </TableCell>
                       <TableCell className="px-4 py-3 text-[13px] text-slate-600">{order.deliveryDate}</TableCell>
                       <TableCell className="px-4 py-3 text-center">
                         <Badge variant="outline" className={
                           order.status === "Draft" ? "bg-slate-100 text-slate-600 border-slate-200 font-medium text-[11px]" :
                           order.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-200 font-medium text-[11px]" :
                           "bg-rose-50 text-rose-600 border-rose-200 font-medium text-[11px]"
                         }>
                           {order.status}
                         </Badge>
                       </TableCell>
                       <TableCell className="px-4 py-3 text-center">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-200">
                             <DropdownMenuItem className="p-0 cursor-pointer">
                               <Link href={`/sales-orders/${order.id}`} className="flex items-center w-full px-2 py-2 text-slate-700 font-medium">
                                 <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                               </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="p-0 cursor-pointer">
                               <Link href={`/sales-orders/${order.id}/edit`} className="flex items-center w-full px-2 py-2 text-slate-700 font-medium">
                                 <Edit2 className="mr-2 h-4 w-4 text-slate-400" /> Edit Order
                               </Link>
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
             {filteredOrders.length > displayLimit && (
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
    </div>
  );
}
