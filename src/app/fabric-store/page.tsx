"use client";

import { useState } from "react";
import { Package, Layers, ShieldAlert, BarChart2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FabricReceipt {
  grn: string;
  date: string;
  po: string;
  supplier: string;
  expected: number;
  received: number;
  status: "Received" | "Pending" | "Partially Received";
}

interface FabricStock {
  code: string;
  description: string;
  color: string;
  supplier: string;
  lot: string;
  location: string;
  available: number;
  reserved: number;
  qcHold: number;
  lastMovement: string;
  receipts: FabricReceipt[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_FABRIC_STOCK: FabricStock[] = [
  { code: "F-100", description: "Cotton 180gsm", color: "Black",    supplier: "Arvind Mills",      lot: "LOT-2300", location: "Rack A1", available: 800,  reserved: 0,   qcHold: 50, lastMovement: "2026-06-06", receipts: [{ grn: "GRN-9000", date: "2026-06-06", po: "FPO-5000", supplier: "Arvind Mills",      expected: 850,  received: 800,  status: "Partially Received" }] },
  { code: "F-101", description: "Denim 12oz",    color: "White",    supplier: "Vardhman Textiles", lot: "LOT-2301", location: "Rack B2", available: 1030, reserved: 110, qcHold: 0,  lastMovement: "2026-06-04", receipts: [{ grn: "GRN-9001", date: "2026-06-04", po: "FPO-5001", supplier: "Vardhman Textiles", expected: 1140, received: 1140, status: "Received" }] },
  { code: "F-102", description: "Pique 220gsm",  color: "Navy",     supplier: "Raymond Fabrics",   lot: "LOT-2302", location: "Rack C3", available: 1260, reserved: 220, qcHold: 0,  lastMovement: "2026-06-02", receipts: [{ grn: "GRN-9002", date: "2026-06-02", po: "FPO-5002", supplier: "Raymond Fabrics",   expected: 1480, received: 1480, status: "Received" }] },
  { code: "F-103", description: "Twill 240gsm",  color: "Sky Blue", supplier: "Welspun",           lot: "LOT-2303", location: "Rack D1", available: 1490, reserved: 330, qcHold: 50, lastMovement: "2026-05-31", receipts: [{ grn: "GRN-9003", date: "2026-05-31", po: "FPO-5003", supplier: "Welspun",           expected: 1870, received: 1820, status: "Partially Received" }] },
  { code: "F-104", description: "Cotton 180gsm", color: "Red",      supplier: "Arvind Mills",      lot: "LOT-2304", location: "Rack A1", available: 1720, reserved: 440, qcHold: 0,  lastMovement: "2026-05-29", receipts: [{ grn: "GRN-9004", date: "2026-05-29", po: "FPO-5004", supplier: "Arvind Mills",      expected: 2160, received: 2160, status: "Received" }] },
  { code: "F-105", description: "Denim 12oz",    color: "Olive",    supplier: "Vardhman Textiles", lot: "LOT-2305", location: "Rack B2", available: 1950, reserved: 550, qcHold: 0,  lastMovement: "2026-05-27", receipts: [{ grn: "GRN-9005", date: "2026-05-27", po: "FPO-5005", supplier: "Trim & Co.",        expected: 1950, received: 1950, status: "Received" }] },
  { code: "F-106", description: "Pique 220gsm",  color: "Beige",    supplier: "Raymond Fabrics",   lot: "LOT-2306", location: "Rack C3", available: 2180, reserved: 660, qcHold: 50, lastMovement: "2026-05-25", receipts: [{ grn: "GRN-9006", date: "2026-05-25", po: "FPO-5006", supplier: "Raymond Fabrics",   expected: 2890, received: 2840, status: "Partially Received" }] },
  { code: "F-107", description: "Twill 240gsm",  color: "Maroon",   supplier: "Welspun",           lot: "LOT-2307", location: "Rack D1", available: 2410, reserved: 770, qcHold: 0,  lastMovement: "2026-06-06", receipts: [{ grn: "GRN-9007", date: "2026-06-06", po: "FPO-5007", supplier: "Welspun",           expected: 3180, received: 3180, status: "Received" }] },
  { code: "F-108", description: "Cotton 180gsm", color: "Black",    supplier: "Arvind Mills",      lot: "LOT-2308", location: "Rack A1", available: 2640, reserved: 80,  qcHold: 0,  lastMovement: "2026-06-04", receipts: [{ grn: "GRN-9008", date: "2026-06-04", po: "FPO-5008", supplier: "Arvind Mills",      expected: 2720, received: 2720, status: "Received" }] },
  { code: "F-109", description: "Denim 12oz",    color: "White",    supplier: "Vardhman Textiles", lot: "LOT-2309", location: "Rack B2", available: 2870, reserved: 190, qcHold: 50, lastMovement: "2026-06-02", receipts: [{ grn: "GRN-9009", date: "2026-06-02", po: "FPO-5009", supplier: "Vardhman Textiles", expected: 3110, received: 3060, status: "Partially Received" }] },
  { code: "F-110", description: "Pique 220gsm",  color: "Navy",     supplier: "Raymond Fabrics",   lot: "LOT-2310", location: "Rack C3", available: 3100, reserved: 300, qcHold: 0,  lastMovement: "2026-05-31", receipts: [{ grn: "GRN-9010", date: "2026-05-31", po: "FPO-5010", supplier: "Raymond Fabrics",   expected: 3400, received: 3400, status: "Received" }] },
  { code: "F-111", description: "Twill 240gsm",  color: "Sky Blue", supplier: "Welspun",           lot: "LOT-2311", location: "Rack D1", available: 3330, reserved: 410, qcHold: 0,  lastMovement: "2026-05-29", receipts: [{ grn: "GRN-9011", date: "2026-05-29", po: "FPO-5011", supplier: "Welspun",           expected: 3740, received: 3740, status: "Received" }] },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FabricStorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFabric, setSelectedFabric] = useState<FabricStock | null>(null);

  const filtered = MOCK_FABRIC_STOCK.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      f.code.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.color.toLowerCase().includes(q) ||
      f.supplier.toLowerCase().includes(q) ||
      f.lot.toLowerCase().includes(q)
    );
  });

  // Metrics
  const totalAvailable = MOCK_FABRIC_STOCK.reduce((a, f) => a + f.available, 0);
  const totalReserved  = MOCK_FABRIC_STOCK.reduce((a, f) => a + f.reserved, 0);
  const totalQcHold    = MOCK_FABRIC_STOCK.reduce((a, f) => a + f.qcHold, 0);
  const skusInStock    = MOCK_FABRIC_STOCK.length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-8">

        {/* Header */}
        <ListPageHeader
          title="Fabric Store"
          description="Roll-wise fabric availability & lots"
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Available (MTR)"
            value={totalAvailable.toLocaleString()}
            subtitle="Free to allocate"
            icon={Package}
            colorScheme="blue"
          />
          <MetricCard
            title="Reserved"
            value={totalReserved.toLocaleString()}
            subtitle="Allocated to orders"
            icon={Layers}
            colorScheme="purple"
          />
          <MetricCard
            title="QC Hold"
            value={totalQcHold.toLocaleString()}
            subtitle="Under quality check"
            icon={ShieldAlert}
            colorScheme="amber"
          />
          <MetricCard
            title="SKUs in Stock"
            value={skusInStock}
            subtitle="Fabric variants"
            icon={BarChart2}
            colorScheme="emerald"
          />
        </div>

        {/* List Container */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden flex flex-col flex-1">
          {/* Toolbar */}
          <DataTableToolbar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search code, fabric, color, lot..."
            recordCount={filtered.length}
            actions={
              <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            }
          />

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white m-6 mt-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-4 w-[5%]">Sr No.</TableHead>
                    <TableHead className="px-4 w-[7%]">Code</TableHead>
                    <TableHead className="px-4 w-[14%]">Description</TableHead>
                    <TableHead className="px-4 w-[9%]">Color</TableHead>
                    <TableHead className="px-4 w-[15%]">Supplier</TableHead>
                    <TableHead className="px-4 w-[9%]">Lot</TableHead>
                    <TableHead className="px-4 w-[9%]">Location</TableHead>
                    <TableHead className="px-4 w-[9%] text-right">Available (m)</TableHead>
                    <TableHead className="px-4 w-[8%] text-right">Reserved</TableHead>
                    <TableHead className="px-4 w-[8%] text-right">QC Hold</TableHead>
                    <TableHead className="px-4 w-[10%]">Last Movement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-16 text-slate-500 font-medium">
                        No fabric stock found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((fabric, index) => (
                      <TableRow
                        key={fabric.code}
                        className="hover:bg-slate-50/50 cursor-pointer"
                        onClick={() => setSelectedFabric(fabric)}
                      >
                        <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-700">
                          {fabric.code}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-800">
                          {fabric.description}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600">
                          {fabric.color}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-[11px] shrink-0 border border-slate-200">
                              {(() => {
                                const words = fabric.supplier.split(' ').filter(Boolean);
                                return words.length >= 2
                                  ? (words[0][0] + words[1][0]).toUpperCase()
                                  : fabric.supplier.substring(0, 2).toUpperCase();
                              })()}
                            </div>
                            <span className="text-[13px] font-medium text-slate-800">{fabric.supplier}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 font-mono">
                          {fabric.lot}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-700">
                          {fabric.location}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-800 text-right">
                          {fabric.available.toLocaleString()}
                        </TableCell>
                        <TableCell className={`px-4 py-3 text-[13px] font-semibold text-right ${fabric.reserved > 0 ? "text-purple-600" : "text-slate-400"}`}>
                          {fabric.reserved.toLocaleString()}
                        </TableCell>
                        <TableCell className={`px-4 py-3 text-[13px] font-semibold text-right ${fabric.qcHold > 0 ? "text-amber-600" : "text-slate-400"}`}>
                          {fabric.qcHold.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-500">
                          {fabric.lastMovement}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedFabric && (
        <FabricDetailDialog
          fabric={selectedFabric}
          onClose={() => setSelectedFabric(null)}
        />
      )}
    </div>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────

function FabricDetailDialog({ fabric, onClose }: { fabric: FabricStock; onClose: () => void }) {
  const totalOnHand = fabric.available + fabric.reserved + fabric.qcHold;
  const totalReceived = fabric.receipts.reduce((a, r) => a + r.received, 0);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0 rounded-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {fabric.code} · {fabric.description}
          </DialogTitle>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">
            {fabric.color} · Lot {fabric.lot} · {fabric.location}
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          <div className="flex flex-col gap-6 mb-4">

            {/* Stock Summary */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Stock Summary</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Available</span>
                  <p className="text-xl font-bold text-[#0453B8] mt-1">{fabric.available.toLocaleString()} m</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Reserved</span>
                  <p className="text-xl font-bold text-slate-700 mt-1">{fabric.reserved.toLocaleString()} m</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">QC Hold</span>
                  <p className={`text-xl font-bold mt-1 ${fabric.qcHold > 0 ? "text-amber-600" : "text-slate-400"}`}>
                    {fabric.qcHold.toLocaleString()} m
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total On-Hand</span>
                  <p className="text-xl font-bold text-emerald-600 mt-1">{totalOnHand.toLocaleString()} m</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</span>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{fabric.code}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material</span>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{fabric.description}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color</span>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{fabric.color}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supplier</span>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{fabric.supplier}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lot</span>
                <p className="text-[13px] font-semibold text-slate-800 font-mono mt-0.5">{fabric.lot}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{fabric.location}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Movement</span>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{fabric.lastMovement}</p>
              </div>
            </div>

            {/* Receipt History */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">
                Receipt History ({fabric.receipts.length})
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-800">
                    <TableRow className="border-0 hover:bg-slate-800">
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider">GRN</TableHead>
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider">Date</TableHead>
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider">PO</TableHead>
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider">Supplier</TableHead>
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider text-right">Expected</TableHead>
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider text-right">Received</TableHead>
                      <TableHead className="px-4 py-2.5 text-white font-semibold text-[11px] uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fabric.receipts.map((r, i) => (
                      <TableRow key={i} className="bg-white border-t border-slate-100 hover:bg-slate-50/50">
                        <TableCell className="px-4 py-3 text-[13px] font-mono text-slate-700">{r.grn}</TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600">{r.date}</TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-medium text-slate-700">{r.po}</TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600">{r.supplier}</TableCell>
                        <TableCell className="px-4 py-3 text-[13px] text-slate-600 text-right">{r.expected.toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-3 text-[13px] font-bold text-slate-800 text-right">{r.received.toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Total row */}
                    <TableRow className="bg-slate-50 border-t-2 border-slate-200">
                      <TableCell colSpan={5} className="px-4 py-2.5 text-[12px] font-semibold text-slate-500 text-right uppercase tracking-wider">
                        Total Received
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-[13px] font-bold text-[#0453B8] text-right">
                        {totalReceived.toLocaleString()} m
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-6 py-5 sm:justify-end rounded-b-xl z-10">
          <Button
            variant="primary"
            onClick={onClose}
            className="min-w-[110px] h-10 px-5 font-semibold text-sm rounded-lg"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
