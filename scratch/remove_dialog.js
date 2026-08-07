const fs = require('fs');
let content = fs.readFileSync('c:/ERP/src/components/trims-store/trims-grn-form.tsx', 'utf-8');
content = content.replace(/\{\/\* Load PO Items Dialog \*\/}[\s\S]*?<\/Dialog>/g, '');
fs.writeFileSync('c:/ERP/src/components/trims-store/trims-grn-form.tsx', content, 'utf-8');
