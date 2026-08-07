"use client";

import { PurchaseOrderListPage } from "@/components/purchase-orders/po-list-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingTrimsPOs } from "./pending-trims-pos";

const MOCK_TRIMS_POS = [
  { 
    id: "TPO-8001", 
    supplier: "YKK Zippers", 
    location: "Gurugram, Haryana",
    itemDesc: "5# Nylon Coil Zippers", 
    qty: "5,000 Pcs", 
    value: 45000, 
    delivery: "2026-06-12", 
    status: "Approved",
    buyerId: "b-1",
    date: "2026-05-28"
  },
  { 
    id: "TPO-8002", 
    supplier: "Laxmi Buttons", 
    location: "Delhi",
    itemDesc: "4-Hole Resin Buttons", 
    qty: "20,000 Pcs", 
    value: 12000, 
    delivery: "2026-06-08", 
    status: "Approval",
    buyerId: "b-2",
    date: "2026-05-25"
  },
  { 
    id: "TPO-8003", 
    supplier: "Super Labels", 
    location: "Tirupur, TN",
    itemDesc: "Woven Main Labels", 
    qty: "10,000 Pcs", 
    value: 8500, 
    delivery: "2026-06-15", 
    status: "Partially Received",
    buyerId: "b-3",
    date: "2026-05-18"
  },
  { 
    id: "TPO-8004", 
    supplier: "Vardhman Threads", 
    location: "Ludhiana, Punjab",
    itemDesc: "Polyester Sewing Thread", 
    qty: "500 Cones", 
    value: 65000, 
    delivery: "2026-06-22", 
    status: "Received",
    buyerId: "b-4",
    date: "2026-05-10"
  },
  { 
    id: "TPO-8005", 
    supplier: "Reliance Packaging", 
    location: "Mumbai, MH",
    itemDesc: "Corrugated Master Cartons", 
    qty: "2,500 Pcs", 
    value: 125000, 
    delivery: "2026-06-25", 
    status: "Approved",
    buyerId: "b-5",
    date: "2026-06-02"
  }
];

export default function TrimsPurchasesPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="px-6 pt-6 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trims POs</h1>
            <p className="text-sm text-slate-500 mt-1">Manage all your trims & accessories purchase orders</p>
          </div>
        </div>
        
        <Tabs defaultValue="raised" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 border border-slate-200">
            <TabsTrigger value="raised" className="data-[state=active]:bg-white data-[state=active]:text-[#0453B8] data-[state=active]:shadow-sm font-bold px-6">
              Raised POs
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-[#0453B8] data-[state=active]:shadow-sm font-bold px-6">
              Pending PO Raising
            </TabsTrigger>
          </TabsList>

          <TabsContent value="raised" className="mt-0 h-[calc(100vh-170px)]">
            <PurchaseOrderListPage 
              title=""
              description=""
              itemNameLabel="Trim Item"
              newItemHref="/trims-purchases/create"
              editItemHrefPrefix="/trims-purchases"
              mockData={MOCK_TRIMS_POS}
              hideHeader={true}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-4 h-[calc(100vh-186px)]">
            <PendingTrimsPOs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
