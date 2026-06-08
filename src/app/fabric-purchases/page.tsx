"use client";

import { PurchaseOrderListPage } from "@/components/purchase-orders/po-list-page";

const MOCK_FABRIC_POS = [
  { 
    id: "FPO-5001", 
    supplier: "Arvind Mills", 
    location: "Ahmedabad, Gujarat",
    material: "Cotton Fabric", 
    qty: "1,200 Pcs", 
    value: 216000, 
    delivery: "2026-06-09", 
    status: "Approved",
    buyerId: "b-3",
    date: "2026-05-25"
  },
  { 
    id: "FPO-5002", 
    supplier: "Vardhman Textiles", 
    location: "Ludhiana, Punjab",
    material: "Linen Fabric", 
    qty: "1,540 Pcs", 
    value: 284900, 
    delivery: "2026-06-05", 
    status: "Approval",
    buyerId: "b-4",
    date: "2026-05-22"
  },
  { 
    id: "FPO-5003", 
    supplier: "Raymond Fabrics", 
    location: "Mumbai, Maharashtra",
    material: "Cotton Fabric", 
    qty: "1,880 Pcs", 
    value: 357200, 
    delivery: "2026-06-14", 
    status: "Partially Received",
    buyerId: "b-5",
    date: "2026-05-28"
  },
  { 
    id: "FPO-5004", 
    supplier: "Welspun", 
    location: "Anjar, Gujarat",
    material: "Linen Fabric", 
    qty: "2,220 Pcs", 
    value: 432900, 
    delivery: "2026-06-20", 
    status: "Received",
    buyerId: "b-1",
    date: "2026-05-15"
  },
  { 
    id: "FPO-5005", 
    supplier: "Arvind Mills", 
    location: "Ahmedabad, Gujarat",
    material: "Cotton Fabric", 
    qty: "2,560 Pcs", 
    value: 512000, 
    delivery: "2026-06-27", 
    status: "Approved",
    buyerId: "b-3",
    date: "2026-06-01"
  },
  { 
    id: "FPO-5006", 
    supplier: "Vardhman Textiles", 
    location: "Ludhiana, Punjab",
    material: "Linen Fabric", 
    qty: "2,900 Pcs", 
    value: 594500, 
    delivery: "2026-06-12", 
    status: "Received",
    buyerId: "b-4",
    date: "2026-05-10"
  },
  { 
    id: "FPO-5007", 
    supplier: "Raymond Fabrics", 
    location: "Mumbai, Maharashtra",
    material: "Cotton Fabric", 
    qty: "3,240 Pcs", 
    value: 680400, 
    delivery: "2026-06-03", 
    status: "Approved",
    buyerId: "b-5",
    date: "2026-05-20"
  },
  { 
    id: "FPO-5008", 
    supplier: "Welspun", 
    location: "Anjar, Gujarat",
    material: "Linen Fabric", 
    qty: "3,580 Pcs", 
    value: 769700, 
    delivery: "2026-06-16", 
    status: "Approved",
    buyerId: "b-1",
    date: "2026-05-30"
  },
  { 
    id: "FPO-5009", 
    supplier: "Arvind Mills", 
    location: "Ahmedabad, Gujarat",
    material: "Cotton Fabric", 
    qty: "3,920 Pcs", 
    value: 862400, 
    delivery: "2026-06-10", 
    status: "Draft",
    buyerId: "b-3",
    date: "2026-06-02"
  },
  { 
    id: "FPO-5010", 
    supplier: "Vardhman Textiles", 
    location: "Ludhiana, Punjab",
    material: "Linen Fabric", 
    qty: "4,260 Pcs", 
    value: 958500, 
    delivery: "2026-06-22", 
    status: "Approved",
    buyerId: "b-4",
    date: "2026-06-04"
  },
  { 
    id: "FPO-5011", 
    supplier: "Arvind Mills", 
    location: "Ahmedabad, Gujarat",
    material: "Linen Fabric", 
    qty: "800 Pcs", 
    value: 120000, 
    delivery: "2026-06-15", 
    status: "Draft",
    buyerId: "b-2",
    date: "2026-06-05"
  },
  { 
    id: "FPO-5012", 
    supplier: "Raymond Fabrics", 
    location: "Mumbai, Maharashtra",
    material: "Cotton Fabric", 
    qty: "1,100 Pcs", 
    value: 231000, 
    delivery: "2026-06-18", 
    status: "Approval",
    buyerId: "b-5",
    date: "2026-06-06"
  },
  { 
    id: "FPO-5013", 
    supplier: "Welspun", 
    location: "Anjar, Gujarat",
    material: "Linen Fabric", 
    qty: "5,000 Pcs", 
    value: 950000, 
    delivery: "2026-06-25", 
    status: "Received",
    buyerId: "b-1",
    date: "2026-06-01"
  },
  { 
    id: "FPO-5014", 
    supplier: "Vardhman Textiles", 
    location: "Ludhiana, Punjab",
    material: "Cotton Fabric", 
    qty: "2,000 Pcs", 
    value: 360000, 
    delivery: "2026-06-28", 
    status: "Partially Received",
    buyerId: "b-4",
    date: "2026-06-03"
  },
  { 
    id: "FPO-5015", 
    supplier: "Raymond Fabrics", 
    location: "Mumbai, Maharashtra",
    material: "Linen Fabric", 
    qty: "3,000 Pcs", 
    value: 840000, 
    delivery: "2026-07-02", 
    status: "Approved",
    buyerId: "b-5",
    date: "2026-06-07"
  },
  { 
    id: "FPO-5016", 
    supplier: "Welspun", 
    location: "Anjar, Gujarat",
    material: "Cotton Fabric", 
    qty: "6,500 Pcs", 
    value: 585000, 
    delivery: "2026-07-05", 
    status: "Draft",
    buyerId: "b-1",
    date: "2026-06-08"
  },
  { 
    id: "FPO-5017", 
    supplier: "Arvind Mills", 
    location: "Ahmedabad, Gujarat",
    material: "Cotton Fabric", 
    qty: "1,500 Pcs", 
    value: 315000, 
    delivery: "2026-06-19", 
    status: "Approval",
    buyerId: "b-3",
    date: "2026-06-05"
  },
  { 
    id: "FPO-5018", 
    supplier: "Vardhman Textiles", 
    location: "Ludhiana, Punjab",
    material: "Linen Fabric", 
    qty: "2,800 Pcs", 
    value: 532000, 
    delivery: "2026-06-21", 
    status: "Partially Received",
    buyerId: "b-4",
    date: "2026-06-06"
  },
  { 
    id: "FPO-5019", 
    supplier: "Raymond Fabrics", 
    location: "Mumbai, Maharashtra",
    material: "Cotton Fabric", 
    qty: "4,200 Pcs", 
    value: 756000, 
    delivery: "2026-06-30", 
    status: "Received",
    buyerId: "b-5",
    date: "2026-06-02"
  },
  { 
    id: "FPO-5020", 
    supplier: "Welspun", 
    location: "Anjar, Gujarat",
    material: "Linen Fabric", 
    qty: "3,600 Pcs", 
    value: 828000, 
    delivery: "2026-07-10", 
    status: "Approved",
    buyerId: "b-1",
    date: "2026-06-08"
  }
];

export default function FabricPurchasesPage() {
  return (
    <PurchaseOrderListPage 
      title="Fabric POs"
      description="Manage all your fabric purchase orders"
      itemNameLabel="Fabric"
      newItemHref="/fabric-purchases/create"
      editItemHrefPrefix="/fabric-purchases"
      mockData={MOCK_FABRIC_POS}
    />
  );
}
