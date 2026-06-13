const fs = require('fs');
const path = 'c:/ERP/src/components/purchase-orders/po-form.tsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// We want to replace lines 921 to 1026 (index 920 to 1025)
// Let's verify line 921 starts with `<div className="bg-slate-50 border-b`
// and line 1026 is `        )}`

if (lines[920].includes('<div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">') && lines[1025].includes(')}')) {
  lines.splice(920, 106, 
    '                Add Selected Lines',
    '              </Button>',
    '            </div>',
    '          </div>',
    '        )}'
  );
  fs.writeFileSync(path, lines.join('\n'));
  console.log('Successfully fixed duplicate block');
} else {
  console.log('Lines mismatch:');
  console.log('Line 921:', lines[920]);
  console.log('Line 1026:', lines[1025]);
}
