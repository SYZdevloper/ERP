const fs = require('fs');
const path = 'c:/ERP/src/components/purchase-orders/select-so-items-dialog.tsx';
let code = fs.readFileSync(path, 'utf8');

const typeOld = 'export const ALL_SO_ITEMS: (ProductLineItem & { soItem: string, requiredQtyMtr: number, soId: string, soNo: string })[] = [';
const typeNew = `export const ALL_SO_ITEMS: (ProductLineItem & { 
  soItem: string, 
  requiredQtyMtr: number, 
  soId: string, 
  soNo: string,
  trackingStatus?: 'ACTIVE' | 'CLOSED' | 'COMPLETE',
  trackingReason?: string,
  trackingRemarks?: string
})[] = [`;
code = code.replace(typeOld, typeNew);

const l2Old = '{ id: "line-2", productId: "ST003", name: "Men\'s Casual Shirt", type: "Half Sleeve Cuban Collar", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 }, rate: 250, soItem: "SO001-02", requiredQtyMtr: 760.00, soId: "1", soNo: "SO-2026-001", fabricBom: { gsm: "160", width: "44", color: "Navy", type: "Linen Blend" }, trims: { buttons: { code: "B002", color: "Navy", image: "" } } } as any,';
const l2New = '{ id: "line-2", productId: "ST003", name: "Men\'s Casual Shirt", type: "Half Sleeve Cuban Collar", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 }, rate: 250, soItem: "SO001-02", requiredQtyMtr: 760.00, soId: "1", soNo: "SO-2026-001", fabricBom: { gsm: "160", width: "44", color: "Navy", type: "Linen Blend" }, trackingStatus: "CLOSED", trackingReason: "Fabric not available from supplier", trackingRemarks: "Supplier discontinued this color", trims: { buttons: { code: "B002", color: "Navy", image: "" } } } as any,';
code = code.replace(l2Old, l2New);

fs.writeFileSync(path, code);
console.log("Done");
