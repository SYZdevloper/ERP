"use client";

import { WarehouseDetailTable } from "@/components/production/warehouse-detail-table";
import { useParams } from "next/navigation";

export default function WarehouseJobCardView() {
  const params = useParams();
  const id = params.id as string;
  
  return <WarehouseDetailTable id={id} />;
}
