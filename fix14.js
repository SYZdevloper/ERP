const fs = require('fs');
const path = 'c:/ERP/src/components/purchase-orders/po-form.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldHeader = '<h3 className="font-bold text-slate-900">{editingItem ? "Edit Fabric" : "Add Manual Fabric"}</h3>';
const newHeader = `<h3 className="font-bold text-slate-900">
                {editingItem ? "Edit Fabric" : "Add Manual Fabric"}
                {editingItem?.soItemId && (
                  <span className="text-slate-500 font-medium ml-2">
                    - {editingItem.soNo} - L{ALL_SO_ITEMS.filter(i => i.soId === ALL_SO_ITEMS.find(soi => soi.id === editingItem.soItemId)?.soId).findIndex(i => i.id === editingItem.soItemId) + 1}
                  </span>
                )}
              </h3>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync(path, code);
console.log("Done");
