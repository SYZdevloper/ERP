"use client";

import { use, useState, useEffect } from "react";
import { TrimsPurchaseOrderForm } from "@/components/purchase-orders/trims-po-form";
import { TRIMS_OPTIONS } from "../../create/page";

const MOCK_TRIMS_POS = [
  { 
    id: "TPO-8001", supplier: "YKK Zippers", itemDesc: "5# Nylon Coil Zippers", qty: "5,000 Pcs", value: 45000, delivery: "2026-06-12", status: "Approved", buyer: "Zara Fashion Pvt Limited", soIds: "1,3",
    trimItems: [
      { id: "trim-1", itemType: "Zipper", designNo: "5# Nylon Coil", color: "Black", sizeSpec: "15cm", linkedLines: [], manualTotalQty: "5000", rate: "9", gst: "12" }
    ]
  },
  { 
    id: "TPO-8002", supplier: "Laxmi Buttons", itemDesc: "4-Hole Resin Buttons", qty: "20,000 Pcs", value: 12000, delivery: "2026-06-08", status: "Approval", buyer: "H&M", soIds: "2",
    trimItems: [
      { id: "trim-2", itemType: "Button", designNo: "4-Hole Resin", color: "Navy", sizeSpec: "18L", linkedLines: [], manualTotalQty: "20000", rate: "0.6", gst: "5" }
    ]
  },
  { 
    id: "TPO-8003", supplier: "Super Labels", itemDesc: "Woven Main Labels", qty: "10,000 Pcs", value: 8500, delivery: "2026-06-15", status: "Partially Received", buyer: "Uniqlo", soIds: "5",
    trimItems: [
      { id: "trim-3", itemType: "Main Label", designNo: "Woven Logo", color: "White", sizeSpec: "-", linkedLines: [], manualTotalQty: "10000", rate: "0.85", gst: "18" }
    ]
  },
  { 
    id: "TPO-8004", supplier: "Vardhman Threads", itemDesc: "Polyester Sewing Thread", qty: "500 Cones", value: 65000, delivery: "2026-06-22", status: "Received", buyer: "Levi's", soIds: "4",
    trimItems: [
      { id: "trim-4", itemType: "Thread", designNo: "Poly Spun 40/2", color: "Navy", sizeSpec: "1000m", linkedLines: [], manualTotalQty: "500", rate: "130", gst: "12" }
    ]
  },
  { 
    id: "TPO-8005", supplier: "Reliance Packaging", itemDesc: "Corrugated Master Cartons", qty: "2,500 Pcs", value: 125000, delivery: "2026-06-25", status: "Approved", buyer: "Marks & Spencer", soIds: "6",
    trimItems: [
      { id: "trim-5", itemType: "Packaging", designNo: "Master Carton", color: "Brown", sizeSpec: "60x40x40cm", linkedLines: [], manualTotalQty: "2500", rate: "50", gst: "18" }
    ]
  },
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
    <TrimsPurchaseOrderForm 
      initialPo={po} 
      isEditMode={true} 
      type="Trims"
      itemLabel="Trim PO"
      specLabel="Specifications"
      itemOptions={TRIMS_OPTIONS}
      backHref="/trims-purchases"
    />
  );
}
