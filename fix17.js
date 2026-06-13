const fs = require('fs');
const path = 'c:/ERP/src/components/purchase-orders/po-form.tsx';
let code = fs.readFileSync(path, 'utf8');

const filterOld = 'ALL_SO_ITEMS.filter(i => i.soId === activeSoForLines.id)';
const filterNew = 'ALL_SO_ITEMS.filter(i => i.soId === activeSoForLines.id && i.trackingStatus !== "CLOSED")';
// Replace all occurrences (using split/join)
code = code.split(filterOld).join(filterNew);

// Wait, what about line 628 where it calculates total SO items:
const countOld = 'const totalSoItems = ALL_SO_ITEMS.filter(i => i.soId === so.id).length || 5;';
const countNew = 'const totalSoItems = ALL_SO_ITEMS.filter(i => i.soId === so.id && i.trackingStatus !== "CLOSED").length || 5;';
code = code.replace(countOld, countNew);

fs.writeFileSync(path, code);
console.log("Done");
