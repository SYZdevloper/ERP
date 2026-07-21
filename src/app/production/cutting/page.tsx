"use client";

import React, { useState, useEffect } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowRight, Package, Info, FileText, Tag, Hash, Ruler, Sparkles, Image as ImageIcon, History, Save, Clock, Filter, Download, Scissors } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useProduction } from "@/components/production/production-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TechpackDetails } from "@/components/production/techpack-details";
import { MOCK_ORDERS } from "@/data/mock-production";

export default function CuttingPage() {
  const router = useRouter();
  const { addJobCard } = useProduction();
  
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSO, setSelectedSO] = useState("SO-2026-008");
  const [selectedProductId, setSelectedProductId] = useState("P-101");
  const [isIssued, setIsIssued] = useState(false);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [rollEntries, setRollEntries] = useState<Record<string, { layerLength: string, noOfLayer: string, damage: string, short: string }>>({});
  const [revisions, setRevisions] = useState<{ id: string, timestamp: Date, entries: typeof rollEntries }[]>([]);
  const [pcsPerBundle, setPcsPerBundle] = useState(25);


  const handleSaveProgress = () => {
    const newRevision = {
      id: `REV-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date(),
      entries: { ...rollEntries }
    };
    setRevisions(prev => [newRevision, ...prev]);
  };

  const handleRollEntryChange = (rollId: string, field: string, value: string) => {
    setRollEntries(prev => ({
      ...prev,
      [rollId]: {
        ...(prev[rollId] || { layerLength: '', noOfLayer: '', damage: '', short: '' }),
        [field]: value
      }
    }));
  };

  const orderData = MOCK_ORDERS[selectedSO as keyof typeof MOCK_ORDERS];
  const productData = orderData?.products.find(p => p.id === selectedProductId) || orderData?.products[0];
  
  // Set default allocations to maximum available when product changes
  useEffect(() => {
    if (productData) {
      const initialAllocations: Record<string, number> = {};
      productData.fabricRolls.forEach(roll => {
        initialAllocations[roll.id] = roll.availableQty;
      });
      setAllocations(initialAllocations);
    }
  }, [productData]);

  const computedSizeEntries = React.useMemo(() => {
    if (!productData) return [];
    
    // Auto-calculator based on Size Ratio "1 : 2 : 2 : 1" for S, M, L, XL
    const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    const ratioMap: Record<string, number> = { S: 1, M: 2, L: 2, XL: 1 };
    const ratioSum = Object.values(ratioMap).reduce((a, b) => a + b, 0);

    const colorStats: Record<string, { totalLayers: number, usedFabric: number }> = {};
    
    productData.fabricRolls.forEach(roll => {
      const entry = rollEntries[roll.id] || {};
      const noOfLayer = parseFloat(entry.noOfLayer) || 0;
      const layerLength = parseFloat(entry.layerLength) || 0;
      const used = noOfLayer * layerLength;
      
      if (!colorStats[roll.color]) {
        colorStats[roll.color] = { totalLayers: 0, usedFabric: 0 };
      }
      colorStats[roll.color].totalLayers += noOfLayer;
      colorStats[roll.color].usedFabric += used;
    });

    return Object.keys(colorStats).map((color, idx) => {
      const stats = colorStats[color];
      const totalPcs = stats.totalLayers * ratioSum;
      const average = totalPcs > 0 ? (stats.usedFabric / totalPcs).toFixed(2) : '0.00';
      
      const sizeBreakdown: Record<string, string> = {};
      sizes.forEach(s => {
        if (ratioMap[s]) {
          sizeBreakdown[s] = (stats.totalLayers * ratioMap[s]).toString();
        } else {
          sizeBreakdown[s] = '';
        }
      });
      
      return {
        id: idx + 1,
        color: color,
        sizes: sizeBreakdown,
        average: average,
        totalPcs: totalPcs
      };
    });
  }, [productData, rollEntries]);

  const generatedBundles = React.useMemo(() => {
    let bundleCounter = 1;
    let globalPieceCounter = 1;
    const bundles: { lotNo: string; bundleNo: number; color: string; size: string; qty: number; startRange: number; endRange: number }[] = [];
    const lotNo = "1";

    computedSizeEntries.forEach(entry => {
      const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
      sizes.forEach(size => {
        const qty = parseFloat(entry.sizes[size]) || 0;
        if (qty > 0) {
          let remainingQty = qty;
          while (remainingQty > 0) {
            const currentBundleQty = Math.min(remainingQty, pcsPerBundle);
            bundles.push({
              lotNo: lotNo,
              bundleNo: bundleCounter++,
              color: entry.color,
              size: size,
              qty: currentBundleQty,
              startRange: globalPieceCounter,
              endRange: globalPieceCounter + currentBundleQty - 1
            });
            globalPieceCounter += currentBundleQty;
            remainingQty -= currentBundleQty;
          }
        }
      });
    });

    return bundles;
  }, [computedSizeEntries, pcsPerBundle]);

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
      currentPhase: "Stitching",
      totalReceived: productData.targetQty,
      goodQty: productData.targetQty, 
      badQty: 0,
      handoverStatus: "Pending_Acceptance",
      pendingReplacementCount: 0
    });

    setTimeout(() => {
      router.push("/production/stitching");
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
          title="Cutting" 
          description="Manage fabric laying, marking, and cutting operations." 
        />
      </div>

      {currentView === 'list' ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
          <DataTableToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search Sales Order or Style..."
            filters={
              <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            }
            actions={
              <Button className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            }
          />

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales Order</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Style</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Target Qty</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-12 px-4 py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(MOCK_ORDERS).flatMap(order => 
                  order.products.map((product, idx) => (
                    <TableRow 
                      key={`${order.id}-${product.id}`}
                      className="cursor-pointer hover:bg-blue-50/50 transition-colors group"
                      onClick={() => {
                        setSelectedSO(order.id);
                        setSelectedProductId(product.id);
                        setCurrentView('detail');
                      }}
                    >
                      <TableCell className="px-4 py-4">
                        <span className="text-[13px] font-bold text-slate-700">{order.id}</span>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <span className="text-[13px] font-bold text-slate-800">{product.style}</span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-center">
                        <span className="text-[13px] font-black text-slate-700">{product.targetQty}</span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                          {idx === 0 ? "Pending Accept" : "In Progress"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0453B8]" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 flex items-start gap-5">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('list')}
                className="font-bold text-slate-700 h-10 mt-6"
              >
                ← Back to List
              </Button>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-bold text-[#0453B8] uppercase tracking-wider">Issue to</Label>
                  <Input 
                    placeholder="Select Job Worker or Department" 
                    className="h-10 text-sm font-semibold w-[280px] bg-white border-slate-300 focus:border-[#0453B8]" 
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Rate</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="h-8 text-sm font-semibold w-24 bg-white border-slate-300" 
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Summary Box */}
            <div className="hidden md:flex flex-col justify-center px-6 py-2 bg-slate-50 border border-slate-200 rounded-lg h-12">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Target Quantity</span>
              <span className="text-sm font-black text-slate-800">{productData.targetQty} Units</span>
            </div>
        
        <div className="ml-auto flex gap-3 items-end h-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-full px-4 font-bold shadow-sm border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
                <History className="w-4 h-4 mr-2" /> History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#0453B8]"/> Revision History</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                {revisions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 font-medium">No progress saved yet.</div>
                ) : (
                  revisions.map((rev) => (
                    <div key={rev.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                        <span className="font-bold text-slate-800">{rev.id}</span>
                        <span className="text-xs font-semibold text-slate-500">{rev.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {Object.entries(rev.entries).length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(rev.entries).map(([rId, e]) => {
                              if (!e.layerLength && !e.noOfLayer && !e.damage && !e.short) return null;
                              return (
                                <div key={rId} className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                                  <div className="font-bold text-slate-800 mb-1">{rId}</div>
                                  {e.layerLength && <div>Layer Len: <span className="font-semibold">{e.layerLength}</span></div>}
                                  {e.noOfLayer && <div>Layers: <span className="font-semibold">{e.noOfLayer}</span></div>}
                                  {e.damage && <div>Damage: <span className="font-semibold">{e.damage}</span></div>}
                                  {e.short && <div>Short: <span className="font-semibold">{e.short}</span></div>}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="italic">No entries recorded.</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={handleSaveProgress}
            variant="outline"
            className="h-full px-4 font-bold shadow-sm border-blue-200 text-[#0453B8] bg-blue-50 hover:bg-blue-100"
          >
            <Save className="w-4 h-4 mr-2" /> Save Progress
          </Button>

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
              <>Issue to Stitching <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Techpack Details */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <TechpackDetails productData={productData} orderData={orderData} />
        </div>

        {/* Right Column: Roll Allocation Table */}
        <div className="w-full lg:w-2/3 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0453B8]" />
              2. Fabric Roll Allocation
            </h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-[#0453B8] text-[#0453B8] hover:bg-blue-50 font-bold px-6">
                START
              </Button>
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
                Completed
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
                  <TableHead className="w-10 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Sr</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Roll No</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Meter</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Width</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-24">Layer Length</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-24">No. of Layer</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Balance</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-20">Damage</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-20">Short</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData.fabricRolls.map((roll, idx) => {
                  const entry = rollEntries[roll.id] || { layerLength: '', noOfLayer: '', damage: '', short: '' };
                  const ll = parseFloat(entry.layerLength) || 0;
                  const nl = parseFloat(entry.noOfLayer) || 0;
                  const total = ll * nl;
                  const damage = parseFloat(entry.damage) || 0;
                  const short = parseFloat(entry.short) || 0;
                  const balance = roll.meter - total - damage - short;
                  
                  return (
                    <TableRow key={roll.id} className="border-b-slate-50 hover:bg-slate-50/50">
                      <TableCell className="text-center font-bold text-red-600">{idx + 1}</TableCell>
                      <TableCell className="font-bold text-slate-800">{roll.id}</TableCell>
                      <TableCell className="font-semibold text-slate-600">{roll.color}</TableCell>
                      <TableCell className="text-right font-bold text-slate-700">{roll.meter}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-600">{roll.width}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={entry.layerLength}
                          onChange={(e) => handleRollEntryChange(roll.id, 'layerLength', e.target.value)}
                          className="h-8 text-right text-xs focus:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={entry.noOfLayer}
                          onChange={(e) => handleRollEntryChange(roll.id, 'noOfLayer', e.target.value)}
                          className="h-8 text-right text-xs focus:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                        />
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">{total > 0 ? total.toFixed(2) : ''}</TableCell>
                      <TableCell className="text-right font-bold text-slate-800">{balance !== roll.meter ? balance.toFixed(2) : ''}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={entry.damage}
                          onChange={(e) => handleRollEntryChange(roll.id, 'damage', e.target.value)}
                          className="h-8 text-right text-xs focus:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={entry.short}
                          onChange={(e) => handleRollEntryChange(roll.id, 'short', e.target.value)}
                          className="h-8 text-right text-xs focus:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {productData.fabricRolls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center text-slate-500 font-medium">
                      No fabric rolls available for this product.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-slate-50 hover:bg-slate-50 border-t-2 border-slate-200">
                  <TableCell colSpan={3} className="font-bold text-slate-800 text-right pr-4">Totals</TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    {productData.fabricRolls.reduce((sum, r) => sum + r.meter, 0).toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    {productData.fabricRolls.reduce((sum, r) => {
                      const entry = rollEntries[r.id] || {};
                      const ll = parseFloat(entry.layerLength as string) || 0;
                      const nl = parseFloat(entry.noOfLayer as string) || 0;
                      return sum + (ll * nl);
                    }, 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    {productData.fabricRolls.reduce((sum, r) => {
                      const entry = rollEntries[r.id] || {};
                      const ll = parseFloat(entry.layerLength as string) || 0;
                      const nl = parseFloat(entry.noOfLayer as string) || 0;
                      const damage = parseFloat(entry.damage as string) || 0;
                      const short = parseFloat(entry.short as string) || 0;
                      return sum + (r.meter - (ll * nl) - damage - short);
                    }, 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    {productData.fabricRolls.reduce((sum, r) => {
                      const damage = parseFloat(rollEntries[r.id]?.damage as string) || 0;
                      return sum + damage;
                    }, 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    {productData.fabricRolls.reduce((sum, r) => {
                      const short = parseFloat(rollEntries[r.id]?.short as string) || 0;
                      return sum + short;
                    }, 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Size Breakdown */}
          <div className="border-t border-slate-200 bg-white shrink-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">3. Size Breakdown</h3>
              <span className="font-bold text-[#0453B8] text-sm">(Sizewise & Colourwise)</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-sm text-center">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800 w-24">Size</th>
                    {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(s => (
                      <th key={s} className="border border-slate-300 py-2 px-2 font-bold text-slate-800 w-16">{s}</th>
                    ))}
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800 w-24 leading-tight">
                      Average<br/>Mtr. / Pcs.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {computedSizeEntries.map((entry) => (
                    <tr key={entry.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="border border-slate-300 py-2 px-2 font-bold text-slate-800 text-center">
                        {entry.color}
                      </td>
                      {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(s => (
                        <td key={s} className="border border-slate-300 py-2 px-2 text-slate-700 font-semibold text-center">
                          {entry.sizes[s] || '-'}
                        </td>
                      ))}
                      <td className="border border-slate-300 py-2 px-2 text-slate-800 font-bold text-center">
                        {entry.average}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold h-10 border-t-2 border-slate-300">
                    <td className="border border-slate-300 py-2 px-4 text-left text-slate-800">Total</td>
                    {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(s => {
                      const total = computedSizeEntries.reduce((sum, e) => sum + (parseFloat(e.sizes[s]) || 0), 0);
                      return (
                        <td key={s} className="border border-slate-300 py-2 px-2 text-center text-[#0453B8]">
                          {total > 0 ? total : '-'}
                        </td>
                      );
                    })}
                    <td className="border border-slate-300 py-2 px-2 text-center text-[#0453B8]">
                      {computedSizeEntries.reduce((sum, e) => sum + e.totalPcs, 0)} Pcs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bundle Generation */}
          <div className="border-t border-slate-200 bg-white shrink-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative mt-4">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">4. Bundle Sorting</h3>
                <span className="font-bold text-[#0453B8] text-sm">(Auto Generated)</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-slate-700">Pcs Per Bundle:</Label>
                <Input 
                  type="number" 
                  value={pcsPerBundle} 
                  onChange={(e) => setPcsPerBundle(Number(e.target.value) || 25)} 
                  className="w-20 h-8"
                />
              </div>
            </div>
            <div className="p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full border-collapse border border-slate-300 text-sm text-center">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800">Lot No</th>
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800">Bundle No</th>
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800">Color</th>
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800">Size</th>
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800">Quantity (Pcs)</th>
                    <th className="border border-slate-300 py-2 px-2 font-bold text-slate-800">Piece Range</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedBundles.length > 0 ? generatedBundles.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="border border-slate-300 py-1.5 px-2">{b.lotNo}</td>
                      <td className="border border-slate-300 py-1.5 px-2 font-bold text-[#0453B8]">{b.bundleNo}</td>
                      <td className="border border-slate-300 py-1.5 px-2">{b.color}</td>
                      <td className="border border-slate-300 py-1.5 px-2 font-bold">{b.size}</td>
                      <td className="border border-slate-300 py-1.5 px-2">{b.qty}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-slate-600 font-medium">{b.startRange} - {b.endRange}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-slate-500 font-medium">No bundles generated. Please enter roll details to generate sizes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
