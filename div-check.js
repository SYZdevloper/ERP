const fs = require('fs');
const content = fs.readFileSync('src/components/purchase-orders/po-form.tsx', 'utf-8').split('\n');
let open = 0;
for(let i = 972; i <= 1400; i++) {
  const l = content[i];
  if (l === undefined) continue;
  
  // if line contains {isManualEntryOpen && (
  if (l.includes('{isManualEntryOpen && (')) {
    console.log(`Line ${i+1}: START MANUAL ENTRY BLOCK`);
  }
  
  const opens = (l.match(/<div/g) || []).length;
  const closes = (l.match(/<\/div>/g) || []).length;
  open += (opens - closes);
  
  if (opens > 0 || closes > 0) {
      console.log(`Line ${i+1}: open=${open} (+${opens} / -${closes}) content=${l.trim()}`);
  }
}
