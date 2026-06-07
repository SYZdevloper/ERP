export interface FabricItem {
  id: string;
  material: string;
  gsmContent: string;
  colorShade: string;
  qty: number;
  uom: string;
  rate: number;
  gst: number;
  amount: number;
  images?: { name: string; url: string }[];
}
