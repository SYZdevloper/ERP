"use client";

import { use, useState, useEffect } from "react";
import { PurchaseOrderForm } from "@/components/purchase-orders/po-form";
import { TRIMS_OPTIONS } from "../../create/page";

const MOCK_TRIMS_POS = [
  { id: "TPO-8001", supplier: "YKK Zippers",       itemDesc: "5# Nylon Coil Zippers",       qty: "5,000 Pcs",  value: 45000,  delivery: "2026-06-12", status: "Approved",           buyer: "Zara Fashion Pvt Limited", soIds: "1,3" },
  { id: "TPO-8002", supplier: "Laxmi Buttons",      itemDesc: "4-Hole Resin Buttons",        qty: "20,000 Pcs", value: 12000,  delivery: "2026-06-08", status: "Approval",            buyer: "H&M",                      soIds: "2"   },
  { id: "TPO-8003", supplier: "Super Labels",        itemDesc: "Woven Main Labels",           qty: "10,000 Pcs", value: 8500,   delivery: "2026-06-15", status: "Partially Received",  buyer: "Uniqlo",                   soIds: "5"   },
  { id: "TPO-8004", supplier: "Vardhman Threads",   itemDesc: "Polyester Sewing Thread",     qty: "500 Cones",  value: 65000,  delivery: "2026-06-22", status: "Received",            buyer: "Levi's",                   soIds: "4"   },
  { id: "TPO-8005", supplier: "Reliance Packaging", itemDesc: "Corrugated Master Cartons",   qty: "2,500 Pcs",  value: 125000, delivery: "2026-06-25", status: "Approved",            buyer: "Marks & Spencer",          soIds: "6"   },
];


export default function EditTrimsPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    const foundPo = MOCK_TRIMS_POS.find(p => p.id === id) || MOCK_TRIMS_POS[0];
    setPo(foundPo);
  }, [id]);

  if (!po) return <div className="p-8">Loading...</div>;

  return (
    <PurchaseOrderForm 
      initialPo={po} 
      isEditMode={true} 
      type="Trims"
      itemLabel="Trim Item"
      specLabel="Specifications"
      itemOptions={TRIMS_OPTIONS}
      backHref="/trims-purchases"
    />
  );
}
