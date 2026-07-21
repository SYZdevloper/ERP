export interface Supplier {
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  category: "Fabric" | "Trims" | "Both";
  onTimePct: number;
  rejectionPct: number;
  openPos: number;
  gstState?: string;
  gstin?: string;
  paymentTerms?: string;
  creditDays?: number;
  advancePercentage?: number;
  billingAddress?: string;
}
