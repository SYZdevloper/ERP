"use client";

import { use } from "react";
import { SalesOrderForm } from "@/components/sales-order/sales-order-form";
import { INITIAL_SALES_ORDER } from "@/data/mock-sales-order";

export default function TrimsBomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const mockOrderData = {
    ...INITIAL_SALES_ORDER,
    salesOrderNo: `SO-${id}`,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SalesOrderForm initialValues={mockOrderData} isReadOnly={true} hideEditDetails={true} />
    </div>
  );
}
