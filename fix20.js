const fs = require('fs');
const path1 = 'c:/ERP/src/app/trims-purchases/create/page.tsx';
const path2 = 'c:/ERP/src/app/trims-purchases/[id]/edit/page.tsx';

let code1 = fs.readFileSync(path1, 'utf8');
code1 = code1.replace(/import \{ PurchaseOrderForm \} from "@\/components\/purchase-orders\/po-form";/g, 'import { TrimsPurchaseOrderForm } from "@/components/purchase-orders/trims-po-form";');
code1 = code1.replace(/<PurchaseOrderForm/g, '<TrimsPurchaseOrderForm');
fs.writeFileSync(path1, code1);

let code2 = fs.readFileSync(path2, 'utf8');
code2 = code2.replace(/import \{ PurchaseOrderForm \} from "@\/components\/purchase-orders\/po-form";/g, 'import { TrimsPurchaseOrderForm } from "@/components/purchase-orders/trims-po-form";');
code2 = code2.replace(/<PurchaseOrderForm/g, '<TrimsPurchaseOrderForm');
fs.writeFileSync(path2, code2);
console.log('Fixed pages');
