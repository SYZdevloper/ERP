"use client";

import { PurchaseOrderListPage } from "@/components/purchase-orders/po-list-page";

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
    <PurchaseOrderListPage 
      title="Trims POs"
      description="Manage all your trims & accessories purchase orders"
      itemNameLabel="Trim Item"
      newItemHref="/trims-purchases/create"
      editItemHrefPrefix="/trims-purchases"
      mockData={MOCK_TRIMS_POS}
    />
  );
}
