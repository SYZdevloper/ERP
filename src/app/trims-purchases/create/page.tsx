"use client";

import { PurchaseOrderForm } from "@/components/purchase-orders/po-form";

export const TRIMS_OPTIONS = [
  "Buttons 18L",
  "YKK Zipper 6\"",
  "Woven Label",
  "Polybag 12x16",
  "Care Label",
  "Hangtag",
  "Thread 40s"
];

export default function CreateTrimsPurchaseOrderPage() {
  return (
    <PurchaseOrderForm 
      type="Trims"
      itemLabel="Trim PO"
      specLabel="Specifications"
      itemOptions={TRIMS_OPTIONS}
      backHref="/trims-purchases"
      isEditMode={false}
    />
  );
}
