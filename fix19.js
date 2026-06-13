const fs = require('fs');
const path = 'c:/ERP/src/app/sales-orders/[id]/tracking/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add state and modify handleStartTracking
const stateOld = `  const handleStartTracking = (item: typeof items[0]) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, trackingStatus: "ACTIVE" } : i
      )
    );
  };`;

const stateNew = `  const [startTrackingModal, setStartTrackingModal] = useState<{
    open: boolean;
    item: typeof items[0] | null;
  }>({
    open: false,
    item: null,
  });

  const confirmStartTracking = () => {
    if (!startTrackingModal.item) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === startTrackingModal.item!.id ? { ...i, trackingStatus: "ACTIVE" } : i
      )
    );
    setStartTrackingModal({ open: false, item: null });
  };`;

code = code.replace(stateOld, stateNew);

// 2. Change the onClick for the button
const btnOld = `onClick={() => handleStartTracking(item)}`;
const btnNew = `onClick={() => setStartTrackingModal({ open: true, item })}`;
code = code.replace(btnOld, btnNew);

// 3. Add the modal UI
const modalOld = `      {/* Drill Down Modal */}`;
const modalNew = `      {/* Start Tracking Modal */}
      {startTrackingModal.open && startTrackingModal.item && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[500px] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0E7A3D] text-white font-bold text-xs">5</span>
              <h3 className="font-bold text-slate-900">Start Tracking Again</h3>
            </div>
            
            <div className="p-6 space-y-4 text-[13px]">
              <div className="grid grid-cols-[120px_1fr] gap-3 font-medium border-b border-slate-100 pb-4">
                <span className="text-slate-500 font-semibold">Line: {salesOrder.soNo} - L{items.findIndex(i => i.id === startTrackingModal.item!.id) + 1}</span>
                <span className="text-slate-800"><span className="text-slate-300 mx-1">|</span> {startTrackingModal.item.fabricBom?.type} {startTrackingModal.item.color}</span>
                
                <span className="text-slate-500 font-semibold">Current Status</span>
                <span className="text-red-500">: CLOSED (Tracking OFF)</span>
                
                <span className="text-slate-500 font-semibold">Balance Qty</span>
                <span className="text-[#0453B8] font-bold">: {(startTrackingModal.item.requiredQtyMtr - Math.floor(startTrackingModal.item.requiredQtyMtr * 0.4)).toFixed(2)} Mtrs</span>
              </div>

              <div className="pt-2 text-slate-700 font-medium leading-relaxed">
                <p>Do you want to start tracking this fabric requirement again?</p>
                <p>It will be shown in Fabric PO selection.</p>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 bg-white">
              <Button 
                variant="outline" 
                onClick={() => setStartTrackingModal({ open: false, item: null })} 
                className="font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmStartTracking}
                className="bg-[#0E7A3D] hover:bg-[#0b6330] text-white font-bold rounded-lg px-6 shadow-sm"
              >
                Start Tracking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drill Down Modal */}`;

code = code.replace(modalOld, modalNew);

fs.writeFileSync(path, code);
console.log("Done");
