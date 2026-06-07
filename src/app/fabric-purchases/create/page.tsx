"use client";

import { PurchaseOrderForm } from "@/components/purchase-orders/po-form";

export const FABRIC_OPTIONS = [
  "Cotton 180gsm",
  "Denim 12oz",
  "Pique 220gsm",
  "Twill 240gsm",
  "Linen 160gsm"
];

export default function CreateFabricPurchaseOrderPage() {
  return (
    <PurchaseOrderForm 
      type="Fabric"
      itemLabel="Material"
      specLabel="GSM / Content"
      itemOptions={FABRIC_OPTIONS}
      backHref="/fabric-purchases"
      isEditMode={false}
    />
  );
}
