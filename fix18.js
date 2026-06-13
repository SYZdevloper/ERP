const fs = require('fs');
const path = 'c:/ERP/src/app/sales-orders/[id]/tracking/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add State
const stateOld = `  const [stopTrackingModal, setStopTrackingModal] = useState<{`;
const stateNew = `  const [drillDownModal, setDrillDownModal] = useState<{
    open: boolean;
    item: typeof items[0] | null;
    type: 'Ordered' | 'Received';
    amount: number;
  }>({
    open: false,
    item: null,
    type: 'Ordered',
    amount: 0,
  });

  const [stopTrackingModal, setStopTrackingModal] = useState<{`;
code = code.replace(stateOld, stateNew);

// 2. Add onClick to spans
const span1Old = `<span className="cursor-pointer hover:underline hover:text-[#0453B8]">{ordered.toFixed(2)}</span>`;
const span1New = `<span className="cursor-pointer hover:underline hover:text-[#0453B8]" onClick={() => setDrillDownModal({ open: true, item, type: 'Ordered', amount: ordered })}>{ordered.toFixed(2)}</span>`;
code = code.split(span1Old).join(span1New);

const span2Old = `<span className="cursor-pointer hover:underline hover:text-[#0453B8]">{received.toFixed(2)}</span>`;
const span2New = `<span className="cursor-pointer hover:underline hover:text-[#0453B8]" onClick={() => setDrillDownModal({ open: true, item, type: 'Received', amount: received })}>{received.toFixed(2)}</span>`;
code = code.split(span2Old).join(span2New);


// 3. Add modal UI
const uiOld = `    </div>
  );
}`;

const uiNew = `      {/* Drill Down Modal */}
      {drillDownModal.open && drillDownModal.item && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[600px] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                {drillDownModal.type === 'Ordered' ? 'Purchase Orders' : 'Goods Receipts (GRN)'} 
                <span className="text-slate-400 font-normal text-sm">for L{items.findIndex(i => i.id === drillDownModal.item!.id) + 1}</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setDrillDownModal({ open: false, item: null, type: 'Ordered', amount: 0 })} className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200">
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Total {drillDownModal.type}</p>
                  <p className="text-2xl font-bold text-[#0453B8]">{drillDownModal.amount.toFixed(2)} Mtrs</p>
                </div>
                <div className="text-right text-sm font-medium text-slate-600">
                  <p>{drillDownModal.item.fabricBom?.type}</p>
                  <p>{drillDownModal.item.color}</p>
                </div>
              </div>

              {drillDownModal.amount === 0 ? (
                <div className="text-center py-8 text-slate-500 font-medium bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                  No {drillDownModal.type.toLowerCase()} records found.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-bold text-slate-700">{drillDownModal.type === 'Ordered' ? 'PO No.' : 'GRN No.'}</th>
                        <th className="px-4 py-3 font-bold text-slate-700">Date</th>
                        <th className="px-4 py-3 font-bold text-slate-700">Supplier</th>
                        <th className="px-4 py-3 font-bold text-slate-700 text-right">Qty (Mtrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-[#0453B8] cursor-pointer hover:underline">{drillDownModal.type === 'Ordered' ? 'PO-2026-045' : 'GRN-2026-112'}</td>
                        <td className="px-4 py-3 text-slate-600">2026-06-10</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">Vardhman Textiles</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{(drillDownModal.amount * 0.6).toFixed(2)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-[#0453B8] cursor-pointer hover:underline">{drillDownModal.type === 'Ordered' ? 'PO-2026-048' : 'GRN-2026-115'}</td>
                        <td className="px-4 py-3 text-slate-600">2026-06-12</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">Arvind Mills</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{(drillDownModal.amount * 0.4).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(uiOld, uiNew);

fs.writeFileSync(path, code);
console.log("Done");
