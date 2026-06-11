export interface MasterPattern {
  code: string;
  brand: string;
  fit: string;
}

export const INITIAL_MASTER_PATTERNS: MasterPattern[] = [
  { code: "PAT001", brand: "Allen Solly", fit: "Slim Fit" },
  { code: "PAT002", brand: "Peter England", fit: "Regular Fit" },
  { code: "PAT003", brand: "Customer A", fit: "Special Fit" },
  { code: "PA101", brand: "Allen Solley", fit: "Casual Fit" },
  { code: "PA102", brand: "Zara", fit: "Regular Fit" },
  { code: "PA103", brand: "H&M", fit: "Slim Fit" },
  { code: "PA104", brand: "Allen Solley", fit: "Slim Fit" },
  { code: "PA105", brand: "Zara", fit: "Oversized" },
  { code: "PA106", brand: "Levi's", fit: "Regular Fit" },
];

export interface MasterFit {
  id: string;
  name: string;
}

export const INITIAL_MASTER_FITS: MasterFit[] = [
  { id: "FIT-01", name: "Regular" },
  { id: "FIT-02", name: "Slim Fit" },
  { id: "FIT-03", name: "Oversized" },
  { id: "FIT-04", name: "Casual Fit" },
];

export interface MasterFabric {
  id: string;
  name: string;
}

export const INITIAL_MASTER_FABRICS: MasterFabric[] = [
  { id: "FAB-01", name: "Cotton Poplin" },
  { id: "FAB-02", name: "Linen" },
  { id: "FAB-03", name: "Denim" },
  { id: "FAB-04", name: "Polyester" },
];

export interface MasterBrand {
  id: string;
  name: string;
  fullName: string;
}

export const INITIAL_MASTER_BRANDS: MasterBrand[] = [
  { id: "BRD-01", name: "Zara", fullName: "Zara fashion group" },
  { id: "BRD-02", name: "H&M", fullName: "Hennes & Mauritz" },
  { id: "BRD-03", name: "Levi's", fullName: "Levi Strauss & Co." },
  { id: "BRD-04", name: "Allen Solly", fullName: "Premium workwear" },
  { id: "BRD-05", name: "Peter England", fullName: "Menswear brand" },
];

export interface MasterColor {
  id: string;
  name: string;
  hexCode: string;
}

export const INITIAL_MASTER_COLORS: MasterColor[] = [
  { id: "COL-01", name: "White", hexCode: "#ffffff" },
  { id: "COL-02", name: "Black", hexCode: "#000000" },
  { id: "COL-03", name: "Navy", hexCode: "#000080" },
  { id: "COL-04", name: "Red", hexCode: "#ef4444" },
  { id: "COL-05", name: "Grey", hexCode: "#808080" },
];
