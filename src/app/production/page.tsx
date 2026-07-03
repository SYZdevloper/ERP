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

// Mock data with Techpack fields, Products, and Roll-wise Fabric Data
const MOCK_ORDERS = {
  "SO-2026-008": {
    id: "SO-2026-008",
    products: [
      {
        id: "P-101",
        style: "Winter Parka - Olive",
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200&q=80",
        techpackDate: "2026-06-15",
        brand: "NorthTrail",
        size: "L",
        fit: "Regular Fit",
        fabricDetail: "100% Nylon Taslan with Poly Lining",
        buyerDesignNumber: "NT-WP-2026",
        targetQty: 850,
        fabricRolls: [
          { id: "R-101", color: "Yellow", meter: 296, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-102", color: "Brown", meter: 297, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-103", color: "Blue", meter: 293, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-104", color: "Black", meter: 300, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-201", color: "Olive", meter: 100, width: 44, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-202", color: "Olive", meter: 100, width: 44, originalQty: 100, availableQty: 100, unit: "Mtr" },
        ],
      },
      {
        id: "P-102",
        style: "Winter Parka - Black",
        image: "https://images.unsplash.com/photo-1551028719-0c14498877bc?w=200&q=80",
        techpackDate: "2026-06-15",
        brand: "NorthTrail",
        size: "M",
        fit: "Regular Fit",
        fabricDetail: "100% Nylon Taslan with Poly Lining",
        buyerDesignNumber: "NT-WP-2026-B",
        targetQty: 400,
        fabricRolls: [
          { id: "R-105", color: "Black", meter: 200, width: 44, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-203", color: "Olive", meter: 150, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
        ],
      }
    ]
  },
  "SO-2026-009": {
    id: "SO-2026-009",
    products: [
      {
        id: "P-201",
        style: "Basic Cotton Hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
        techpackDate: "2026-06-18",
        brand: "Essentials",
        size: "M",
        fit: "Oversized",
        fabricDetail: "100% French Terry Cotton 280 GSM",
        buyerDesignNumber: "ESS-CH-001",
        targetQty: 1200,
        fabricRolls: [
          { id: "R-301", color: "Grey", meter: 180, width: 50, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-302", color: "Grey", meter: 180, width: 50, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-401", color: "Grey", meter: 90, width: 50, originalQty: 50, availableQty: 20, unit: "Mtr" },
        ]
      }
    ]
  },
};

export default function TechpackPage() {
  const router = useRouter();
  const { addJobCard } = useProduction();
  
  const [selectedSO, setSelectedSO] = useState("SO-2026-008");
  const [selectedProductId, setSelectedProductId] = useState("P-101");
  const [isIssued, setIsIssued] = useState(false);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [rollEntries, setRollEntries] = useState<Record<string, { layerLength: string, noOfLayer: string, damage: string, short: string }>>({});

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
        
        <div className="flex-1 max-w-[240px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Sales Order</label>
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

        <div className="flex-1 max-w-sm">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Product / Style</label>
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 h-full overflow-y-auto">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-[#0453B8]" />
              Techpack Details
            </h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-sm">
                {productData.image ? (
                  <img src={productData.image} alt={productData.style} className="object-cover w-full h-full" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mt-5" />
                )}
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-slate-800 text-sm leading-tight">{productData.style}</h4>
                 <p className="text-xs text-slate-500 font-medium mt-1">{orderData.id}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Techpack Date</span>
                <span className="text-sm font-bold text-slate-800">{productData.techpackDate}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Brand</span>
                <span className="text-sm font-bold text-slate-800">{productData.brand}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Style</span>
                <span className="text-sm font-bold text-slate-800">{productData.style}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5"/> Size</span>
                  <span className="text-sm font-bold text-slate-800">{productData.size}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Fit</span>
                  <span className="text-sm font-bold text-slate-800">{productData.fit}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Package className="w-3.5 h-3.5"/> Fabric Detail</span>
                <span className="text-sm font-bold text-slate-800">{productData.fabricDetail}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Buyer Design No.</span>
                <span className="text-sm font-bold text-slate-800">{productData.buyerDesignNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Roll Allocation Table */}
        <div className="w-full lg:w-2/3 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0453B8]" />
              Fabric Roll Allocation
            </h3>
          </div>
          
          <div className="flex-1 overflow-auto p-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
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
                {productData.fabricRolls.map(roll => {
                  const entry = rollEntries[roll.id] || { layerLength: '', noOfLayer: '', damage: '', short: '' };
                  const ll = parseFloat(entry.layerLength) || 0;
                  const nl = parseFloat(entry.noOfLayer) || 0;
                  const total = ll * nl;
                  const damage = parseFloat(entry.damage) || 0;
                  const short = parseFloat(entry.short) || 0;
                  const balance = roll.meter - total - damage - short;
                  
                  return (
                    <TableRow key={roll.id} className="border-b-slate-50 hover:bg-slate-50/50">
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
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">
                      No fabric rolls available for this product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
