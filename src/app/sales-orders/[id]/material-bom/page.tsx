"use client";

import { use } from "react";
import { SalesOrderForm } from "@/components/sales-order/sales-order-form";
import { INITIAL_SALES_ORDER, MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";

export default function TrimsBomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // In a real app, you would fetch data for this specific ID.
  const listOrder = MOCK_SALES_ORDERS_LIST.find(o => o.id === id);

  const mockOrderData = {
    ...INITIAL_SALES_ORDER,
    salesOrderNo: listOrder ? listOrder.soNo : `SO-${id}`,
  };

  if (id === "16") {
    mockOrderData.buyerId = "b-6";
    mockOrderData.products = mockOrderData.products.filter(p => p.id === "line-4" || p.id === "line-5");
  } else {
    mockOrderData.products = mockOrderData.products.filter(p => p.id !== "line-4" && p.id !== "line-5");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SalesOrderForm initialValues={mockOrderData} isReadOnly={true} hideEditDetails={true} />
    </div>
  );
}
