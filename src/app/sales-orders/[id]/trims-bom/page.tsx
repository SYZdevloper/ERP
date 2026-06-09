"use client";

import { use } from "react";
import { SalesOrderForm } from "@/components/sales-order/sales-order-form";
import { INITIAL_SALES_ORDER } from "@/data/mock-sales-order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrimConfigs } from "@/components/sales-order/trim-configs";

export default function TrimsBomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const mockOrderData = {
    ...INITIAL_SALES_ORDER,
    salesOrderNo: `SO-${id}`,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="preview" className="flex flex-col h-full group/tabs data-horizontal:flex-col">
        <div className="px-5 pt-3 bg-white border-b border-slate-200 shrink-0">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="preview" className="data-[state=active]:bg-white">Sales Order Preview</TabsTrigger>
            <TabsTrigger value="trim-configs" className="data-[state=active]:bg-white">Trim Configs</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="flex-1 overflow-hidden m-0 outline-none data-[state=active]:flex data-[state=active]:flex-col">
          <SalesOrderForm initialValues={mockOrderData} isReadOnly={true} hideEditDetails={true} />
        </TabsContent>
        <TabsContent value="trim-configs" className="flex-1 overflow-y-auto bg-slate-50/50 p-5 m-0 outline-none">
          <TrimConfigs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
