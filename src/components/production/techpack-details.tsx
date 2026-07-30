import React, { useState } from "react";
import { FileText, Tag, Hash, Ruler, Sparkles, Image as ImageIcon, Package, Scissors, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TechpackDetailsProps {
  productData: any;
  orderData: any;
}

export function TechpackDetails({ productData, orderData }: TechpackDetailsProps) {
  const [stages, setStages] = useState({
    embroidery: "",
    printing: "",
    washing: "",
    finishing: "Required"
  });

  if (!productData || !orderData) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 h-full overflow-y-auto custom-scrollbar flex flex-col">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3 shrink-0">
        <FileText className="w-5 h-5 text-[#0453B8]" />
        1. Techpack Details
      </h3>
      
      <div className="flex items-center gap-4 mb-6 shrink-0">
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

      <div className="space-y-5 shrink-0 mb-6 pb-6 border-b border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Techpack Date</span>
            <span className="text-sm font-bold text-slate-800">{productData.techpackDate || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Pattern No</span>
            <span className="text-sm font-bold text-slate-800">{productData.patternNo || "PTRN-2026-X8"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Brand</span>
            <span className="text-sm font-bold text-slate-800">{productData.brand || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Scissors className="w-3.5 h-3.5"/> Size Ratio</span>
            <span className="text-sm font-bold text-slate-800">{productData.sizeRatio || "1 : 2 : 2 : 1"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Style</span>
            <span className="text-sm font-bold text-slate-800">{productData.style || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5"/> Size</span>
            <span className="text-sm font-bold text-slate-800">{productData.size || "-"}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Fit</span>
            <span className="text-sm font-bold text-slate-800">{productData.fit || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Buyer Design No.</span>
            <span className="text-sm font-bold text-slate-800">{productData.buyerDesignNumber || "-"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Package className="w-3.5 h-3.5"/> Fabric Detail</span>
          <span className="text-sm font-bold text-slate-800">{productData.fabricDetail || "-"}</span>
        </div>
      </div>

      <div className="shrink-0">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-sm">
          <Activity className="w-4 h-4 text-[#0453B8]" />
          Production Stages
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <span className="text-xs font-bold text-slate-600">Embroidery</span>
            <Select value={stages.embroidery} onValueChange={(val) => setStages(s => ({...s, embroidery: val}))}>
              <SelectTrigger className="h-9 text-sm focus:ring-[#0453B8]">
                <SelectValue placeholder="Not Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Required">Not Required</SelectItem>
                <SelectItem value="Before Cutting">Before Cutting</SelectItem>
                <SelectItem value="After Cutting">After Cutting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <span className="text-xs font-bold text-slate-600">Printing</span>
            <Select value={stages.printing} onValueChange={(val) => setStages(s => ({...s, printing: val}))}>
              <SelectTrigger className="h-9 text-sm focus:ring-[#0453B8]">
                <SelectValue placeholder="Not Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Required">Not Required</SelectItem>
                <SelectItem value="Before Cutting">Before Cutting</SelectItem>
                <SelectItem value="After Cutting">After Cutting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <span className="text-xs font-bold text-slate-600">Washing</span>
            <Select value={stages.washing} onValueChange={(val) => setStages(s => ({...s, washing: val}))}>
              <SelectTrigger className="h-9 text-sm focus:ring-[#0453B8]">
                <SelectValue placeholder="Not Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Required">Not Required</SelectItem>
                <SelectItem value="Before Cutting (Enzyme)">Before Cutting (Enzyme)</SelectItem>
                <SelectItem value="Before Cutting (Silicone)">Before Cutting (Silicone)</SelectItem>
                <SelectItem value="After Cutting (Enzyme)">After Cutting (Enzyme)</SelectItem>
                <SelectItem value="After Cutting (Silicone)">After Cutting (Silicone)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <span className="text-xs font-bold text-slate-600">Finishing</span>
            <Select value={stages.finishing} onValueChange={(val) => setStages(s => ({...s, finishing: val}))}>
              <SelectTrigger className="h-9 text-sm focus:ring-[#0453B8]">
                <SelectValue placeholder="Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Required">Required</SelectItem>
                <SelectItem value="Not Required">Not Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
