"use client";

import { use, useState, useEffect } from "react";
import { PurchaseOrderForm } from "@/components/purchase-orders/po-form";
import { FABRIC_OPTIONS } from "../../create/page";
import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";

const MOCK_FABRIC_POS = [
  { id: "FPO-5001", supplier: "Arvind Mills", material: "Cotton Fabric", qty: "1,200 Pcs", value: 216000, delivery: "2026-06-09", status: "Approved", buyerId: "b-3" },
  { id: "FPO-5002", supplier: "Vardhman Textiles", material: "Linen Fabric", qty: "1,540 Pcs", value: 284900, delivery: "2026-06-05", status: "Approval", buyerId: "b-4" },
  { id: "FPO-5003", supplier: "Raymond Fabrics", material: "Cotton Fabric", qty: "1,880 Pcs", value: 357200, delivery: "2026-06-14", status: "Partially Received", buyerId: "b-5" },
  { id: "FPO-5004", supplier: "Welspun", material: "Linen Fabric", qty: "2,220 Pcs", value: 432900, delivery: "2026-06-20", status: "Received", buyerId: "b-1" },
  { id: "FPO-5005", supplier: "Arvind Mills", material: "Cotton Fabric", qty: "2,560 Pcs", value: 512000, delivery: "2026-06-27", status: "Approved", buyerId: "b-3" },
];

export default function ViewFabricPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    const foundPo = MOCK_FABRIC_POS.find(p => p.id === id) || MOCK_FABRIC_POS[0];
    setPo(foundPo);
  }, [id]);

  if (!po) return <div className="p-8">Loading...</div>;

  return (
    <PurchaseOrderForm 
      initialPo={po} 
      isEditMode={false} 
      isViewMode={true}
      type="Fabric"
      itemLabel="Fabric PO"
      specLabel="GSM / Content"
      itemOptions={FABRIC_OPTIONS}
      backHref="/fabric-purchases"
    />
  );
}
