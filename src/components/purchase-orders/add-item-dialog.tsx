import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { POItem } from "@/types/purchase-order";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: POItem) => void;
  editItem?: POItem | null;
  itemOptions: string[];
  itemLabel: string; // e.g. "Material" or "Trim Item"
  specLabel?: string; // e.g. "GSM / Content" or "Specifications"
}

export function AddItemDialog({ 
  open, 
  onOpenChange, 
  onAddItem, 
  editItem,
  itemOptions,
  itemLabel,
  specLabel = "GSM / Content"
}: AddItemDialogProps) {
  const [formData, setFormData] = useState({
    material: "",
    gsmContent: "",
    colorShade: "",
    qty: "",
    uom: "mtr",
    rate: "",
    gst: "5",
  });
  
  const [images, setImages] = useState<{name: string; url: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && editItem) {
      setFormData({
        material: editItem.material || "",
        gsmContent: editItem.gsmContent || "",
        colorShade: editItem.colorShade || "",
        qty: editItem.qty.toString(),
        uom: editItem.uom || "mtr",
        rate: editItem.rate.toString(),
        gst: editItem.gst.toString(),
      });
      setImages(editItem.images || []);
    } else if (open) {
      setFormData({
        material: "",
        gsmContent: "",
        colorShade: "",
        qty: "",
        uom: "mtr", // or "pcs" based on trims, but user can change
        rate: "",
        gst: "5", 
      });
      setImages([]);
    }
  }, [open, editItem]);

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

  const handleSubmit = () => {
    const qtyNum = parseFloat(formData.qty) || 0;
    const rateNum = parseFloat(formData.rate) || 0;
    const gstNum = parseFloat(formData.gst) || 0;
    
    if (!formData.material || !formData.colorShade || qtyNum <= 0 || rateNum <= 0) {
      alert(`Please fill in all required fields (${itemLabel}, Color/Shade, valid QTY and RATE)`);
      return;
    }

    const newItem: POItem = {
      id: editItem ? editItem.id : `item-${Date.now()}`,
      material: formData.material,
      gsmContent: formData.gsmContent,
      colorShade: formData.colorShade,
      qty: qtyNum,
      uom: formData.uom,
      rate: rateNum,
      gst: gstNum,
      amount: qtyNum * rateNum,
      images: images,
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

  const amount = (parseFloat(formData.qty) || 0) * (parseFloat(formData.rate) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">
        <DialogHeader className="px-6 py-3 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {editItem ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar relative" onKeyDown={handleKeyDown}>
          <div className="flex flex-col gap-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">{itemLabel} <span className="text-red-500">*</span></Label>
                <select 
                  value={formData.material}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                  className="h-10 px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900"
                >
                  <option value="">Select {itemLabel}</option>
                  {itemOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">{specLabel}</Label>
                <Input 
                  value={formData.gsmContent}
                  onChange={(e) => handleInputChange("gsmContent", e.target.value)}
                  placeholder={`e.g. ${itemLabel === "Trim Item" ? "Size 18L" : "180gsm CO"}`} 
                  className="bg-white h-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Color / Shade <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.colorShade}
                  onChange={(e) => handleInputChange("colorShade", e.target.value)}
                  placeholder="e.g. 06-D.GREY or Black" 
                  className="bg-white h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Qty <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={formData.qty}
                    onChange={(e) => handleInputChange("qty", e.target.value)}
                    placeholder="0.00" 
                    className="bg-white flex-1 h-10"
                  />
                  <select 
                    value={formData.uom}
                    onChange={(e) => handleInputChange("uom", e.target.value)}
                    className="w-20 h-10 px-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900"
                  >
                    <option value="mtr">mtr</option>
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="roll">roll</option>
                    <option value="cones">cones</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Amount (Auto)</Label>
                <div className="h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-semibold text-slate-700 flex items-center">
                  ₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
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
                onChange={handleImageUpload} 
                multiple 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {images.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-md border border-slate-200 overflow-hidden shrink-0 group bg-slate-100 flex items-center justify-center">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-20 border-2 border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <ImageIcon className="h-6 w-6 mb-1 opacity-50" />
                <span className="text-xs">No images uploaded</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:justify-end gap-3 rounded-b-lg">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-[100px] border-slate-300 text-slate-700 hover:bg-slate-100 h-10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="min-w-[140px] h-10 bg-[#0453B8] hover:bg-[#034294] text-white font-medium">
            {editItem ? "Update Item" : "Add to Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
