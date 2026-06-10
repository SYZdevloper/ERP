"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, ImagePlus, X } from "lucide-react";
import { ProductLineItem } from "@/types/sales-order";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrimData {
  code: string;
  color: string;
  image: string;
}

interface TrimValues {
  buttons: TrimData;
  label: TrimData;
  hangTag: TrimData;
}

const EMPTY_TRIM: TrimData = { code: "", color: "", image: "" };
const EMPTY_TRIMS: TrimValues = {
  buttons: { ...EMPTY_TRIM },
  label:   { ...EMPTY_TRIM },
  hangTag: { ...EMPTY_TRIM },
};

interface TrimConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductLineItem | null;
  /** Called when the user saves; receives the updated product with trims attached */
  onSave: (updated: ProductLineItem) => void;
}

// ─── Helper: product thumbnail ────────────────────────────────────────────────
function productImageSrc(product: ProductLineItem) {
  const nameLower = (product.name || "").toLowerCase();
  if (nameLower.includes("t-shirt") || (product.productId || "").startsWith("MT")) {
    return "/men casual tshirt.jpeg";
  }
  if (nameLower.includes("formal") || (product.productId || "").startsWith("MS")) {
    return (product.type || "").toLowerCase().includes("full")
      ? "/mens casual full sleeve shirt.jpg"
      : "/men regualr fit shirt.jpeg";
  }
  return "/men casual half shirt.jpg";
}

// ─── Single Trim Card ────────────────────────────────────────────────────────
function TrimCard({
  title,
  data,
  onChange,
}: {
  title: string;
  data: TrimData;
  onChange: (field: keyof TrimData, value: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => onChange("image", reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">{title}</p>

      <div className="flex items-end gap-5">
        {/* Image upload */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image</Label>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-[72px] h-[72px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#0453B8] hover:bg-blue-50 transition-colors group overflow-hidden"
          >
            {data.image ? (
              <>
                <img src={data.image} alt={title} className="w-full h-full object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange("image", ""); }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-slate-300 group-hover:text-[#0453B8] transition-colors" />
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#0453B8] mt-1 transition-colors">Upload</span>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Code */}
        <div className="flex flex-col gap-1.5 flex-1">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</Label>
          <Input
            value={data.code}
            onChange={(e) => onChange("code", e.target.value)}
            placeholder="Enter code..."
            className="h-10 bg-white border-slate-200 rounded-lg text-sm font-semibold focus-visible:ring-[#0453B8]"
          />
        </div>

        {/* Color */}
        <div className="flex flex-col gap-1.5 flex-1">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color</Label>
          <Input
            value={data.color}
            onChange={(e) => onChange("color", e.target.value)}
            placeholder="Enter color..."
            className="h-10 bg-white border-slate-200 rounded-lg text-sm font-semibold focus-visible:ring-[#0453B8]"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────
export function TrimConfigDialog({ open, onOpenChange, product, onSave }: TrimConfigDialogProps) {
  const [trims, setTrims] = useState<TrimValues>(EMPTY_TRIMS);

  // Restore saved trims when the dialog opens for a product
  useEffect(() => {
    if (open && product) {
      setTrims((product as any).trims ?? EMPTY_TRIMS);
    } else {
      setTrims(EMPTY_TRIMS);
    }
  }, [open, product]);

  const handleChange = (key: keyof TrimValues, field: keyof TrimData, value: string) => {
    setTrims(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSave = () => {
    if (!product) return;
    onSave({ ...product, trims } as any);
    onOpenChange(false);
  };

  if (!product) return null;

  const totalQty = Object.values(product.sizeBreakdown || {}).reduce(
    (a, v) => a + (parseInt(String(v)) || 0),
    0
  );

  const colorHex: Record<string, string> = {
    white: "white", black: "black", navy: "#000080",
    red: "#ef4444", grey: "#808080", blue: "#3b82f6",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[860px] h-[88vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Scissors className="w-4 h-4 text-[#0453B8] shrink-0" />
            <DialogTitle className="text-base font-bold text-slate-900">
              Trim Config
              <span className="ml-2 text-sm font-semibold text-slate-400">
                — {product.productId || product.name}
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5 custom-scrollbar">

          {/* Product Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Product Details</p>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#F5F6F8] rounded-lg shrink-0 border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={productImageSrc(product)}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{product.productId || product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {product.name} &bull; {product.type} &bull;{" "}
                      {product.subcategory === "T-Shirt" ? "Round Neck" : "Regular Collar"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#0453B8]">{totalQty} pcs</p>
                    <p className="text-[10px] text-slate-500">total qty</p>
                  </div>
                </div>

                {/* Attribute chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {[
                    { label: "Color",  val: product.color },
                    { label: "Fabric", val: (product as any).fabric  || "N/A" },
                    { label: "Fit",    val: (product as any).fit     || "N/A" },
                    { label: "Brand",  val: product.brandName        || "No Brand" },
                    { label: "SKU",    val: product.sqNumber         || "N/A" },
                  ].map(item => (
                    <span
                      key={item.label}
                      className="inline-flex gap-1 bg-slate-50 border border-slate-200 text-slate-600 font-medium text-[10px] px-2 py-0.5 rounded-md"
                    >
                      <span className="text-slate-400">{item.label}:</span>
                      <span className="font-bold text-slate-700">{item.val}</span>
                    </span>
                  ))}
                </div>

                {/* Size breakdown */}
                {product.sizeBreakdown && (
                  <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold mr-0.5">SIZES:</span>
                    {Object.entries(product.sizeBreakdown)
                      .filter(([, q]) => (q as number) > 0)
                      .map(([s, q]) => (
                        <span key={s} className="bg-blue-50 text-[#0453B8] font-bold text-[10px] px-1.5 py-0.5 rounded">
                          {s}: {q as number}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trim Configs Section */}
          <div>
            <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Trim Material Configurations
            </p>
            <p className="text-[11px] text-slate-500 mb-4">
              Enter details for each trim material used in this garment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TrimCard
                title="Buttons"
                data={trims.buttons}
                onChange={(f, v) => handleChange("buttons", f, v)}
              />
              <TrimCard
                title="Label"
                data={trims.label}
                onChange={(f, v) => handleChange("label", f, v)}
              />
              <TrimCard
                title="Hang Tag"
                data={trims.hangTag}
                onChange={(f, v) => handleChange("hangTag", f, v)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold h-11 px-6">
            Close
          </Button>
          <Button
            onClick={handleSave}
            className="h-11 px-8 bg-[#0453B8] hover:bg-blue-700 text-white font-semibold shadow-sm"
          >
            Save Trim Config
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
