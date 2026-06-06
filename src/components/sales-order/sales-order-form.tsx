import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalesOrderSchema, SalesOrder } from "@/types/sales-order";
import { EMPTY_SALES_ORDER, MOCK_SALES_ORDERS_LIST, MOCK_BUYERS } from "@/data/mock-sales-order";
import { useRouter } from "next/navigation";

import { OrderHeader } from "@/components/sales-order/order-header";
import { BuyerOrderDetailsCard } from "@/components/sales-order/buyer-order-details-card";
import { BillingAddressCard } from "@/components/sales-order/billing-address-card";
import { ShippingAddressCard } from "@/components/sales-order/shipping-address-card";
import { ProductsTable } from "@/components/sales-order/products-table";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { OrderSummaryPanel } from "@/components/sales-order/order-summary-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useEffect } from "react";

export interface SalesOrderFormProps {
  initialValues?: Partial<SalesOrder>;
  isReadOnly?: boolean;
  isEditMode?: boolean;
}

export function SalesOrderForm({ initialValues, isReadOnly = false, isEditMode = false }: SalesOrderFormProps) {
  const methods = useForm<SalesOrder>({
    resolver: zodResolver(SalesOrderSchema),
    defaultValues: initialValues || EMPTY_SALES_ORDER,
    disabled: isReadOnly,
  });

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      methods.reset(initialValues);
    }
  }, [initialValues, methods]);

  const router = useRouter();

  const onSubmit = (data: SalesOrder) => {
    if (!isEditMode && !initialValues) {
      const buyer = MOCK_BUYERS.find(b => b.id === data.buyerId)?.name || "Unknown Buyer";
      const amount = data.products.reduce((acc, p) => {
        const qty = (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + 
                    (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + 
                    (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + 
                    (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0);
        return acc + (qty * p.rate);
      }, 0);
      
      const taxAmount = amount - (amount * (data.discountPercentage || 0) / 100);
      const grandTotal = taxAmount + (taxAmount * (data.cgstRate || 0) / 100) + (taxAmount * (data.sgstRate || 0) / 100);

      MOCK_SALES_ORDERS_LIST.unshift({
        id: String(Date.now()),
        soNo: data.salesOrderNo,
        buyer,
        style: data.products[0]?.name || "Multiple Styles",
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split('T')[0] : "TBD",
        status: (data.status === "Sent" ? "Confirmed" : data.status) as any,
        fabricPo: "Pending",
        trimsPo: "Pending",
        amount: grandTotal,
      });
    }

    router.push("/sales-orders");
  };

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col h-full overflow-hidden bg-slate-50/50" onSubmit={methods.handleSubmit(onSubmit)}>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
          <OrderHeader
            salesOrderNo={methods.getValues("salesOrderNo")}
            orderDate={methods.getValues("orderDate")}
            status={methods.getValues("status")}
            isReadOnly={isReadOnly}
          />

          <div className="flex flex-col xl:flex-row gap-5">

            {/* Left Column (Main Content) */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <BuyerOrderDetailsCard isReadOnly={isReadOnly} isEditMode={isEditMode} />

                <div className="flex flex-col md:flex-row gap-5 mt-2 items-stretch">
                  <BillingAddressCard isReadOnly={isReadOnly || isEditMode} />
                  <ShippingAddressCard isReadOnly={isReadOnly || isEditMode} />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <ProductsTable isReadOnly={isReadOnly} />
              </div>
            </div>

            {/* Right Column (Information Rail) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              <NotesPanel isReadOnly={isReadOnly} />
              <OrderSummaryPanel isReadOnly={isReadOnly} />
              <AttachmentsModal isReadOnly={isReadOnly} />
            </div>

          </div>
        </div>
      </form>
    </FormProvider>
  );
}
