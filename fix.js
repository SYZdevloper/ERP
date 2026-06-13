const fs = require('fs');
let c = fs.readFileSync('c:/ERP/src/components/purchase-orders/po-form.tsx', 'utf8');
let idx = c.indexOf('"use client";', 10);
if(idx !== -1) {
  fs.writeFileSync('c:/ERP/src/components/purchase-orders/po-form.tsx', c.substring(idx));
  console.log('Done');
} else {
  console.log('Not found');
}
