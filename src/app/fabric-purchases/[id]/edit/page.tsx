"use client";

import { use, useState, useEffect } from "react";
import { PurchaseOrderForm } from "@/components/purchase-orders/po-form";
import { FABRIC_OPTIONS } from "../../create/page";

const MOCK_FABRIC_POS = [
  { id: "FPO-5001", supplier: "Arvind Mills", material: "Cotton 180gsm", qty: "1,200 Pcs", value: 216000, delivery: "2026-06-09", status: "Approved", buyerId: "b-3" },
  { id: "FPO-5002", supplier: "Vardhman Textiles", material: "Denim 12oz", qty: "1,540 Pcs", value: 284900, delivery: "2026-06-05", status: "Approval", buyerId: "b-4" },
  { id: "FPO-5003", supplier: "Raymond Fabrics", material: "Pique 220gsm", qty: "1,880 Pcs", value: 357200, delivery: "2026-06-14", status: "Partially Received", buyerId: "b-5" },
  { id: "FPO-5004", supplier: "Welspun", material: "Twill 240gsm", qty: "2,220 Pcs", value: 432900, delivery: "2026-06-20", status: "Received", buyerId: "b-1" },
  { id: "FPO-5005", supplier: "Arvind Mills", material: "Cotton 180gsm", qty: "2,560 Pcs", value: 512000, delivery: "2026-06-27", status: "Approved", buyerId: "b-3" },
  { id: "FPO-5006", supplier: "Vardhman Textiles", material: "Denim 12oz", qty: "2,900 Pcs", value: 594500, delivery: "2026-06-12", status: "Received", buyerId: "b-4" },
  { id: "FPO-5007", supplier: "Raymond Fabrics", material: "Pique 220gsm", qty: "3,240 Pcs", value: 680400, delivery: "2026-06-03", status: "Approved", buyerId: "b-5" },
  { id: "FPO-5008", supplier: "Welspun", material: "Twill 240gsm", qty: "3,580 Pcs", value: 769700, delivery: "2026-06-16", status: "Approved", buyerId: "b-1" },
  { id: "FPO-5009", supplier: "Arvind Mills", material: "Cotton 180gsm", qty: "3,920 Pcs", value: 862400, delivery: "2026-06-10", status: "Draft", buyerId: "b-3" },
  { id: "FPO-5010", supplier: "Vardhman Textiles", material: "Denim 12oz", qty: "4,260 Pcs", value: 958500, delivery: "2026-06-22", status: "Approved", buyerId: "b-4" },
];

export default function EditFabricPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {
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
      isEditMode={true} 
      type="Fabric"
      itemLabel="Material"
      specLabel="GSM / Content"
      itemOptions={FABRIC_OPTIONS}
      backHref="/fabric-purchases"
    />
  );
}
