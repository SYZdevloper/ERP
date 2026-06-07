export interface POItem {
  id: string;
  material: string; // The item name/description
  gsmContent: string; // Additional spec like GSM/Content or dimensions
  colorShade: string; // Color/Shade or variation
  qty: number;
  uom: string;
  rate: number;
  gst: number;
  amount: number;
  images?: { name: string; url: string }[];
}
