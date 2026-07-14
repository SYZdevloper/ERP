"use client";

import React, { useState, useEffect } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowRight, Package, Info, FileText, Tag, Hash, Ruler, Sparkles, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useProduction } from "@/components/production/production-context";
import { TechpackDetails } from "@/components/production/techpack-details";

import { MOCK_ORDERS } from "@/data/mock-production";

export default function TechpackPage() {
  const router = useRouter();
  const { addJobCard } = useProduction();

  const [selectedSO, setSelectedSO] = useState("SO-2026-008");
  const [selectedProductId, setSelectedProductId] = useState("P-101");
  const [isIssued, setIsIssued] = useState(false);
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const orderData = MOCK_ORDERS[selectedSO as keyof typeof MOCK_ORDERS];
  const productData = orderData?.products.find(p => p.id === selectedProductId) || orderData?.products[0];

  // Set default allocations to maximum available when product changes
  useEffect(() => {
    if (productData) {
      const initialAllocations: Record<string, number> = {};
      productData.fabricRolls.forEach(roll => {
        initialAllocations[roll.id] = roll.availableQty;
      });
      if (productData.trims) {
        productData.trims.forEach(trim => {
          initialAllocations[trim.id] = trim.allocatedQty;
        });
      }
      setAllocations(initialAllocations);
    }
  }, [productData]);

  if (!productData) return null;

  const totalAllocated = Object.values(allocations).reduce((acc, curr) => acc + (curr || 0), 0);
  const hasAllocations = totalAllocated > 0;

  const handleIssueToProduction = () => {
    setIsIssued(true);

    // Dynamically create the new Job Card in global context
    const newId = `JC-${Math.floor(Math.random() * 900) + 100}`;
    addJobCard({
      id: newId,
      soId: orderData.id,
      style: productData.style,
      currentPhase: "Cutting",
      totalReceived: productData.targetQty,
      goodQty: productData.targetQty,
      badQty: 0,
      handoverStatus: "Pending_Acceptance",
      pendingReplacementCount: 0
    });

    setTimeout(() => {
      router.push("/production/cutting");
    }, 1200);
  };

  const handleSOChange = (val: string) => {
    setSelectedSO(val);
    const order = MOCK_ORDERS[val as keyof typeof MOCK_ORDERS];
    if (order && order.products.length > 0) {
      setSelectedProductId(order.products[0].id);
    }
    setIsIssued(false);
  };

  const handleProductChange = (val: string) => {
    setSelectedProductId(val);
    setIsIssued(false);
  };

  const handleAllocationChange = (rollId: string, value: string, maxAvailable: number) => {
    let numValue = parseFloat(value);
    // Ensure value does not exceed available quantity
    if (!isNaN(numValue) && numValue > maxAvailable) {
      numValue = maxAvailable;
    }
    setAllocations(prev => ({
      ...prev,
      [rollId]: isNaN(numValue) ? 0 : Math.min(numValue, maxAvailable)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <ListPageHeader
          title="TeckPack"
          description="View Techpack details and allocate fabric rolls for production."
        />
      </div>

      {/* Main Control Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-end gap-4">

        <div className="flex-1 max-w-sm">
          <div className="text-sm font-bold text-[#0453B8] mb-1">{orderData?.buyerName || "Buyer Name"}</div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Item Name</label>
          <Select value={selectedProductId} onValueChange={handleProductChange}>
            <SelectTrigger className="h-12 border-slate-200 focus:ring-[#0453B8] font-bold text-slate-800 text-base shadow-sm">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {orderData.products.map(product => (
                <SelectItem key={product.id} value={product.id} className="font-semibold">
                  {product.style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 max-w-[240px]">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Sales Order</label>
          <Select value={selectedSO} onValueChange={handleSOChange}>
            <SelectTrigger className="h-12 border-slate-200 focus:ring-[#0453B8] font-bold text-slate-800 text-base shadow-sm">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(MOCK_ORDERS).map(order => (
                <SelectItem key={order.id} value={order.id} className="font-semibold">
                  {order.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Summary Box */}
        <div className="hidden md:flex flex-col justify-center px-6 py-2 bg-slate-50 border border-slate-200 rounded-lg h-12">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Target Quantity</span>
          <span className="text-sm font-black text-slate-800">{productData.targetQty} Units</span>
        </div>

        <div className="ml-auto flex gap-4 items-end h-12">
          <div className={`px-4 h-full rounded-lg border flex items-center gap-2 shadow-sm ${hasAllocations ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="font-bold text-sm">
              Allocated: {totalAllocated.toFixed(2)} Mtr
            </span>
          </div>

          <Button
            onClick={handleIssueToProduction}
            disabled={!hasAllocations || isIssued}
            className={`h-full px-8 font-bold shadow-sm transition-all ${isIssued ? 'bg-emerald-600 text-white' : !hasAllocations ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#0453B8] hover:bg-blue-700 text-white hover:shadow-md'}`}
          >
            {isIssued ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Job Card Issued</>
            ) : (
              <>Issue to Cutting <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Techpack Details */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <TechpackDetails productData={productData} orderData={orderData} />
        </div>

        {/* Right Column: Allocations */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 overflow-y-auto min-h-0 pb-6 pr-2 custom-scrollbar">

          {/* Fabric Roll Allocation Table */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm flex-shrink-0">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4 rounded-t-xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0453B8]" />
                2. Fabric Roll Details
              </h3>
            </div>

            <div className="overflow-auto p-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Roll No</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Material</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Available Qty</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-[160px]">Allocate Qty</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productData.fabricRolls.map(roll => {
                    const allocated = allocations[roll.id] ?? roll.availableQty; // Default UI shows what's in state
                    const remaining = roll.availableQty - allocated;

                    return (
                      <TableRow key={roll.id} className="border-b-slate-50 hover:bg-slate-50/50">
                        <TableCell className="font-bold text-slate-800">{roll.id}</TableCell>
                        <TableCell className="font-semibold text-slate-600">{roll.material}</TableCell>
                        <TableCell className="text-right font-bold text-slate-700">
                          {roll.availableQty} <span className="text-xs font-semibold text-slate-400">{roll.unit}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={0}
                            max={roll.availableQty}
                            value={allocations[roll.id] !== undefined ? allocations[roll.id] : ''}
                            onChange={(e) => handleAllocationChange(roll.id, e.target.value, roll.availableQty)}
                            className="h-8 text-right font-bold focus:ring-[#0453B8]"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell className={`text-right font-bold ${remaining > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {remaining.toFixed(2)} <span className="text-xs font-semibold text-slate-400">{roll.unit}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {productData.fabricRolls.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">
                        No fabric rolls available for this product.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Accessories Allocation Details Table */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm flex-shrink-0">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4 rounded-t-xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0453B8]" />
                3. Accessories Allocation Details
              </h3>
            </div>

            <div className="overflow-auto p-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Type</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Required Qty</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-[160px]">Allocate Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productData.trims && productData.trims.map(trim => {
                    const allocated = allocations[trim.id] ?? trim.allocatedQty;

                    return (
                      <TableRow key={trim.id} className="border-b-slate-50 hover:bg-slate-50/50">
                        <TableCell className="font-bold text-slate-800">{trim.itemType}</TableCell>
                        <TableCell className="font-semibold text-slate-600">{trim.description}</TableCell>
                        <TableCell className="text-right font-bold text-slate-700">
                          {trim.requiredQty} <span className="text-xs font-semibold text-slate-400">{trim.unit}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={0}
                            value={allocations[trim.id] !== undefined ? allocations[trim.id] : trim.allocatedQty}
                            onChange={(e) => handleAllocationChange(trim.id, e.target.value, trim.requiredQty)}
                            className="h-8 text-right font-bold focus:ring-[#0453B8]"
                            placeholder="0"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!productData.trims || productData.trims.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-slate-500 font-medium">
                        No accessories available for this product.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
