"use client";

import { use } from "react";
import { SalesOrderForm } from "@/components/sales-order/sales-order-form";
import { INITIAL_SALES_ORDER } from "@/data/mock-sales-order";

export default function EditSalesOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // In a real app, you would fetch data for this specific ID.
  // We'll mock it by overriding the salesOrderNo to reflect the ID.
  const mockOrderData = {
    ...INITIAL_SALES_ORDER,
    salesOrderNo: `SO-${id}`,
  };

  return <SalesOrderForm initialValues={mockOrderData} isReadOnly={false} isEditMode={true} />;
}
