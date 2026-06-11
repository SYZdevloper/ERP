import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { POItem } from "@/types/purchase-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_TRIM_CATALOG } from "@/data/mock-sales-order";

function getProductDetails(productId: string, name: string) {
  const code = productId || "";
  const nameLower = (name || "").toLowerCase();
  
  let fabric = "Cotton Poplin";
  let fit = "Regular";
  let brandName = "Zara";
  let sqNumber = "SKU1000293";
  
  if (code === "ST001") {
    fabric = "Cotton Poplin"; fit = "Regular"; brandName = "Zara"; sqNumber = "SKU1000293";
  } else if (code === "ST003") {
    fabric = "Linen"; fit = "Slim Fit"; brandName = "Zara"; sqNumber = "SKU1000294";
  } else if (code === "TS001") {
    fabric = "Cotton Pique"; fit = "Regular"; brandName = "Zara"; sqNumber = "SKU1000295";
  } else if (code.startsWith("HM")) {
    fabric = nameLower.includes("linen") ? "Linen" : "Cotton";
    fit = "Relaxed Fit";
    brandName = "H&M";
    sqNumber = "SKU2000" + code.replace("HM", "");
  } else if (code.startsWith("DJ") || code.startsWith("LV")) {
    fabric = "Denim";
    fit = "Regular Fit";
    brandName = code.startsWith("DJ") ? "Zara" : "Levi's";
    sqNumber = "SKU3000" + code.replace(/\D/g, "");
  } else if (code.startsWith("UQ")) {
    fabric = nameLower.includes("down") ? "Nylon Down" : "Polyester Fleece";
    fit = "Regular";
    brandName = "Uniqlo";
    sqNumber = "SKU4000" + code.replace("UQ", "");
  } else if (code.startsWith("MS")) {
    fabric = nameLower.includes("blazer") ? "Wool Blend" : "Cotton Satin";
    fit = "Tailored Fit";
    brandName = "Marks & Spencer";
    sqNumber = "SKU5000" + code.replace("MS", "");
  }

  return { fabric, fit, brandName, sqNumber };
}

function getDateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDaysDifference(targetDateStr: string): string {
  if (!targetDateStr) return "custom";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [year, month, day] = targetDateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if ([15, 30, 45, 60].includes(diffDays)) {
    return `${diffDays} Days`;
  }
  return "custom";
}

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: POItem) => void;
  editItem?: POItem | null;
  itemOptions: string[];
  itemLabel: string;
  specLabel?: string;
  initialValues?: Partial<POItem>;
  type?: "Fabric" | "Trims";
  trimItem?: string; // "Button" | "Label" | "Hangtag"
  soItemTotalPcs?: number; // total garment pcs from selected SO item
  soItem?: any;
}

export function AddItemDialog({
  open,
  onOpenChange,
  onAddItem,
  editItem,
  itemOptions,
  itemLabel,
  specLabel = "GSM / Content",
  initialValues,
  type,
  trimItem: propTrimItem = "",
  soItemTotalPcs = 0,
  soItem,
}: AddItemDialogProps) {
  const trimItem = editItem && type === "Trims" ? editItem.material : propTrimItem;

  const [formData, setFormData] = useState({
    material: "",
    gsmContent: "",
    gsm: "",
    width: "",
    colorShade: "",
    requiredQty: "",
    qty: "",
    uom: "mtr",
    rate: "",
    gst: "5",
    deliveryDate: getDateAfterDays(15),
  });

  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track which catalog variant is selected (by code)
  const [selectedVariantCode, setSelectedVariantCode] = useState<string>("");

  useEffect(() => {
    if (open && editItem) {
      setFormData({
        material: editItem.material || "",
        gsmContent: editItem.gsmContent || "",
        gsm: editItem.gsm || "",
        width: editItem.width || "",
        colorShade: editItem.colorShade || "",
        requiredQty: editItem.requiredQty?.toString() || editItem.qty?.toString() || "",
        qty: editItem.qty?.toString() || "",
        uom: editItem.uom || "mtr",
        rate: editItem.rate?.toString() || "",
        gst: editItem.gst?.toString() || "5",
        deliveryDate: editItem.deliveryDate || getDateAfterDays(15),
      });
      setImages(editItem.images || []);
      // Pre-select the variant that matches the saved code
      if (editItem.code) setSelectedVariantCode(editItem.code);
      else if (editItem.material) {
        const firstVariant = MOCK_TRIM_CATALOG[editItem.material]?.[0];
        if (firstVariant) setSelectedVariantCode(firstVariant.code);
      }
    } else if (open) {
      setFormData({
        material: initialValues?.material || "",
        gsmContent: initialValues?.gsmContent || "",
        gsm: initialValues?.gsm || "",
        width: initialValues?.width || "",
        colorShade: initialValues?.colorShade || "",
        requiredQty: initialValues?.requiredQty?.toString() || initialValues?.qty?.toString() || "",
        qty: initialValues?.qty?.toString() || "",
        uom: initialValues?.uom || "mtr",
        rate: initialValues?.rate?.toString() || "",
        gst: initialValues?.gst?.toString() || "5",
        deliveryDate: initialValues?.deliveryDate || getDateAfterDays(15),
      });
      setImages(initialValues?.images || []);
      // Default to first variant of the selected trim type
      if (trimItem) {
        const firstVariant = MOCK_TRIM_CATALOG[trimItem]?.[0];
        if (firstVariant) setSelectedVariantCode(firstVariant.code);
      } else {
        setSelectedVariantCode("");
      }
    }
  }, [open, editItem, initialValues, trimItem]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file) 
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const qtyNum = parseFloat(formData.qty) || 0;
  const rateNum = parseFloat(formData.rate) || 0;

  const handleSubmit = () => {
    const gstNum = parseFloat(formData.gst) || 0;
    
    let effectiveCode = undefined;
    let effectiveColor = formData.colorShade;
    let effectiveMaterial = formData.material;

    if (type === "Trims" && trimItem) {
      effectiveMaterial = trimItem;
      const trimKey = (() => {
        if (trimItem.toLowerCase().includes("button")) return "buttons";
        if (trimItem.toLowerCase().includes("label")) return "label";
        if (trimItem.toLowerCase().includes("hangtag") || trimItem.toLowerCase().includes("hang tag")) return "hangTag";
        return "";
      })();
      
      const configuredTrim = soItem?.trims?.[trimKey];
      const trimVariants = MOCK_TRIM_CATALOG[trimItem] || [];
      const systemDefault = trimVariants[0];

      effectiveCode = configuredTrim?.code || systemDefault?.code;
      effectiveColor = configuredTrim?.color || systemDefault?.color || "";
    }

    if (!effectiveMaterial || (type !== "Trims" && !effectiveColor) || qtyNum <= 0 || rateNum <= 0 || !formData.deliveryDate) {
      alert(`Please fill in all required fields (${itemLabel}, Color/Shade, valid QTY, RATE, and Delivery Date)`);
      return;
    }

    const newItem: POItem = {
      id: editItem ? editItem.id : `item-${Date.now()}`,
      material: effectiveMaterial,
      code: effectiveCode,
      gsmContent: type === "Fabric" || itemLabel === "Material" || itemLabel === "Supplier Sort Number" ? `${formData.gsm} / ${formData.width}` : formData.gsmContent,
      gsm: formData.gsm,
      width: formData.width,
      colorShade: effectiveColor,
      requiredQty: parseFloat(formData.requiredQty) || 0,
      qty: qtyNum,
      buffer: qtyNum - (parseFloat(formData.requiredQty) || 0),
      uom: formData.uom,
      rate: rateNum,
      gst: gstNum,
      amount: qtyNum * rateNum,
      images: images,
      deliveryDate: formData.deliveryDate,
    };

    onAddItem(newItem);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        e.preventDefault();
        const container = e.currentTarget;
        const inputs = Array.from(container.querySelectorAll('input:not([type="file"]), select, textarea, button')) as HTMLElement[];
        const index = inputs.indexOf(target);
        if (index > -1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[1000px] h-[90vh] sm:h-[750px] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">
            {editItem ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
          </DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar relative" onKeyDown={handleKeyDown}>
          <div className="flex flex-col gap-3">
            {/* Product Details Card */}
            {soItem && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Product Details</p>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F5F6F8] rounded-lg shrink-0 border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={(() => {
                        const nameLower = (soItem.name || "").toLowerCase();
                        if (nameLower.includes("t-shirt") || (soItem.productId || "").startsWith("MT") || (soItem.productId || "").startsWith("TS")) {
                          return "/men casual tshirt.jpeg";
                        }
                        if (nameLower.includes("formal") || (soItem.productId || "").startsWith("MS")) {
                          return (soItem.type || "").toLowerCase().includes("full")
                            ? "/mens casual full sleeve shirt.jpg"
                            : "/men regualr fit shirt.jpeg";
                        }
                        return "/men casual half shirt.jpg";
                      })()}
                      alt={soItem.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">{soItem.productId || soItem.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {soItem.name} &bull; {soItem.type || "Standard"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#0453B8]">
                          {Object.values(soItem.sizeBreakdown || {}).reduce(
                            (a: number, v: any) => a + (parseInt(String(v)) || 0),
                            0
                          )} pcs
                        </p>
                        <p className="text-[10px] text-slate-500">total qty</p>
                      </div>
                    </div>

                    {/* Attribute chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {(() => {
                        const details = getProductDetails(soItem.productId, soItem.name);
                        return [
                          { label: "Color",  val: soItem.color },
                          { label: "Fabric", val: details.fabric },
                          { label: "Fit",    val: details.fit },
                          { label: "Brand",  val: details.brandName },
                          { label: "Buyer Design No", val: details.sqNumber },
                        ].map(item => (
                          <span
                            key={item.label}
                            className="inline-flex gap-1 bg-slate-50 border border-slate-200 text-slate-600 font-medium text-[10px] px-2 py-0.5 rounded-md"
                          >
                            <span className="text-slate-400">{item.label}:</span>
                            <span className="font-bold text-slate-700">{item.val}</span>
                          </span>
                        ));
                      })()}
                    </div>

                    {/* Size breakdown */}
                    {soItem.sizeBreakdown && (
                      <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold mr-0.5">SIZES:</span>
                        {Object.entries(soItem.sizeBreakdown)
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
            )}

            {type === "Fabric" || itemLabel === "Material" || itemLabel === "Supplier Sort Number" ? (
              <div className="flex flex-col gap-4">
                {soItem && (
                  <div className="border-t border-slate-200/60 pt-4 mt-2 text-left">
                    <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Fabric Material Configurations
                    </p>
                    <p className="text-[11px] text-slate-500 mb-1">
                      Enter details for the fabric material required for this order.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">{itemLabel} <span className="text-red-500">*</span></Label>
                  <Select value={formData.material} onValueChange={(val) => handleInputChange("material", val)}>
                    <SelectTrigger className="w-full bg-white h-12 border-slate-200 focus:ring-[#0453B8]">
                      <SelectValue placeholder={`Select ${itemLabel}`} className="w-full truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">GSM</Label>
                  <Input 
                    value={formData.gsm}
                    onChange={(e) => handleInputChange("gsm", e.target.value)}
                    placeholder="e.g. 180" 
                    className="w-full bg-white h-12"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Color / Shade <span className="text-red-500">*</span></Label>
                  <Select value={formData.colorShade} onValueChange={(val) => handleInputChange("colorShade", val)}>
                    <SelectTrigger className="w-full bg-white h-12 border-slate-200 focus:ring-[#0453B8]">
                      <SelectValue placeholder="Select Color" className="w-full truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="White">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: 'white' }} />
                          <span>White</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Black">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: 'black' }} />
                          <span>Black</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Navy">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#000080' }} />
                          <span>Navy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Red">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#ef4444' }} />
                          <span>Red</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Grey">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#555555' }} />
                          <span>Grey</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Natural">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#f5f5dc' }} />
                          <span>Natural</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Width</Label>
                  <Input 
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    placeholder='e.g. 44"' 
                    className="w-full bg-white h-12"
                  />
                </div>
              </div>
            </div>
          ) : (
              (() => {
                if (!trimItem) {
                  return (
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-10 text-center shadow-inner">
                      <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="text-sm font-bold text-slate-700">No Trim Item Selected</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Please go back and select a Trim Item (e.g., Button, Label, Hangtag) from the dropdown on the PO Form first.
                      </p>
                    </div>
                  );
                }

                const trimVariants = MOCK_TRIM_CATALOG[trimItem] || [];
                const systemDefault = trimVariants[0];

                const trimKey = (() => {
                  if (trimItem.toLowerCase().includes("button")) return "buttons";
                  if (trimItem.toLowerCase().includes("label")) return "label";
                  if (trimItem.toLowerCase().includes("hangtag") || trimItem.toLowerCase().includes("hang tag")) return "hangTag";
                  return "";
                })();

                const configuredTrim = soItem?.trims?.[trimKey];

                const effectiveCode = configuredTrim?.code || systemDefault?.code || "";
                const effectiveColor = configuredTrim?.color || systemDefault?.color || "";
                const effectiveImage = configuredTrim?.image || systemDefault?.image || "";
                const trimDescription = systemDefault?.description || "";

                // Per-garment counts from product catalog (system values)
                const PER_GARMENT: Record<string, number> = {
                  "Button": 7,
                  "Label": 1,
                  "Hangtag": 1,
                };
                const perGarment = PER_GARMENT[trimItem] ?? 1;
                // Calculate garments based on requiredQty instead of assuming 0 when no SO is selected
                const computedGarments = Math.round((parseFloat(formData.requiredQty) || 0) / perGarment);
                const autoQty = computedGarments * perGarment;

                return (
                  <div className="flex flex-col gap-3">
                    {soItem && (
                      <div className="border-t border-slate-200/60 pt-3 mt-1 text-left">
                        <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-0.5">
                          Trim Material Configurations
                        </p>
                        <p className="text-[11px] text-slate-500 mb-1">
                          Using the exact specifications and variant configured for this garment.
                        </p>
                      </div>
                    )}
                    
                    <div className="group relative flex flex-col md:flex-row gap-4 items-stretch bg-gradient-to-br from-white to-slate-50/50 rounded-xl border border-slate-200/80 p-4 pl-5 shadow-sm hover:shadow-md hover:border-[#0453B8]/30 transition-all duration-300 overflow-hidden text-left">
                      {/* Left border gradient accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-[#0453B8]" />
                      
                      {/* Image container with premium overlay and shadow */}
                      <div className="relative w-24 h-24 rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                        {effectiveImage ? (
                          <img src={effectiveImage} alt={trimItem} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-[9px] text-white px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider leading-none">
                          {trimItem}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        {/* Title and Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                                {trimItem || "—"}
                              </h3>
                              <span className="font-mono text-[10px] font-bold text-[#0453B8] bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 leading-none">
                                {effectiveCode || "—"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              {trimDescription || "Standard system specification"}
                            </p>
                          </div>
                          
                          {/* Color Swatch & Value */}
                          <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/40 shrink-0 self-start sm:self-center">
                            {effectiveColor && effectiveColor !== "-" && (
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-sm shrink-0"
                                style={{
                                  backgroundColor: (() => {
                                    const col = effectiveColor.split(" / ")[0].toLowerCase();
                                    return col === "white" ? "#ffffff" : col === "navy" ? "#000080" : col === "black" ? "#000000" : col === "red" ? "#ef4444" : col === "grey" ? "#808080" : col === "blue" ? "#3b82f6" : col === "khaki" ? "#C3A882" : col;
                                  })()
                                }}
                              />
                            )}
                            <span className="text-xs font-bold text-slate-700 leading-none">
                              {effectiveColor || "—"}
                            </span>
                          </div>
                        </div>

                        {/* Calculation Grid */}
                        <div className="grid grid-cols-3 gap-2.5 mt-2">
                          <div className="bg-slate-100/50 hover:bg-slate-100 rounded-lg p-2 border border-slate-200/50 transition-colors">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Garments</span>
                            <p className="text-base font-black text-slate-800 mt-0.5 leading-none">
                              {computedGarments.toLocaleString("en-IN")}
                            </p>
                            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">pcs to make</span>
                          </div>

                          <div className="bg-slate-100/50 hover:bg-slate-100 rounded-lg p-2 border border-slate-200/50 transition-colors">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Usage Ratio</span>
                            <p className="text-base font-black text-slate-800 mt-0.5 leading-none">
                              ×{perGarment}
                            </p>
                            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">per garment</span>
                          </div>

                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 hover:from-blue-100/50 hover:to-blue-100 rounded-lg p-2 border border-blue-200/60 shadow-sm transition-colors">
                            <span className="text-[9px] font-bold text-[#0453B8] uppercase tracking-wider block">System Qty</span>
                            <p className="text-base font-black text-[#0453B8] mt-0.5 leading-none">
                              {autoQty.toLocaleString("en-IN")}
                            </p>
                            <span className="text-[9px] text-[#0453B8]/80 font-bold block mt-0.5">pcs required</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
            
            {/* Form fields below */}
            {(!type || type === "Fabric" || (type === "Trims" && trimItem)) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 whitespace-nowrap text-ellipsis overflow-hidden">Quantity Required</Label>
                    <Input 
                      readOnly 
                      value={formData.requiredQty || "0"} 
                      className="bg-slate-50 text-slate-700 font-semibold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Your Order <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        value={formData.qty}
                        onChange={(e) => handleInputChange("qty", e.target.value)}
                        placeholder="0.00" 
                        className="bg-white flex-1 h-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buffer</Label>
                    <div className="flex gap-2">
                      <Input 
                        readOnly 
                        value={((parseFloat(formData.qty) || 0) - (parseFloat(formData.requiredQty) || 0)).toFixed(2)} 
                        className="bg-slate-50 text-slate-700 font-semibold h-10 border-slate-200 cursor-default focus-visible:ring-0 flex-1" 
                      />
                      <div className="w-12 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-sm font-medium text-slate-600 flex-shrink-0">
                        {formData.uom}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Delivery Date <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select 
                          value={getDaysDifference(formData.deliveryDate)} 
                          onValueChange={(val) => {
                            if (val !== "custom") {
                              const days = parseInt(val);
                              handleInputChange("deliveryDate", getDateAfterDays(days));
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-10 border-slate-200 text-xs focus:ring-[#0453B8] bg-white font-medium">
                            <SelectValue placeholder="Days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15 Days">15 Days</SelectItem>
                            <SelectItem value="30 Days">30 Days</SelectItem>
                            <SelectItem value="45 Days">45 Days</SelectItem>
                            <SelectItem value="60 Days">60 Days</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input 
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                          className="bg-white h-10 text-[13px] font-medium px-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Rate (₹) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  value={formData.rate}
                  onChange={(e) => handleInputChange("rate", e.target.value)}
                  placeholder="0.00" 
                  className="bg-white h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">GST %</Label>
                <Input 
                  type="number"
                  value={formData.gst}
                  onChange={(e) => handleInputChange("gst", e.target.value)}
                  className="bg-white h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Amount</Label>
                <Input 
                  readOnly 
                  value={`₹ ${(qtyNum * rateNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  className="bg-slate-50 text-slate-700 font-bold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Total (With GST)</Label>
                <Input 
                  readOnly 
                  value={`₹ ${((qtyNum * rateNum) * (1 + (parseFloat(formData.gst) || 0) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  className="bg-slate-50 text-[#0453B8] font-bold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                />
              </div>
            </div>
            </>
            )}
          </div>

          {type !== "Trims" && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                Images / Swatches
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs font-medium bg-slate-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload Image
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="min-h-[100px] border-2 border-dashed border-slate-200 rounded-md flex items-center justify-center p-4 bg-slate-50/50">
              {images.length > 0 ? (
                <div className="flex flex-wrap gap-4 w-full">
                  {images.map((img, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-slate-200 bg-white">
                      <img src={img.url} alt={`Upload ${index + 1}`} className="h-20 w-20 object-cover" />
                      <button 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center flex flex-col items-center text-slate-400">
                  <ImageIcon className="h-6 w-6 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No images uploaded</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex-shrink-0 flex items-center justify-end gap-3 sm:space-x-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-5 font-medium border-slate-200 text-slate-600">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-10 px-6 font-medium bg-[#0453B8] hover:bg-[#034294] text-white">
            {editItem ? "Save Changes" : "Add to Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
