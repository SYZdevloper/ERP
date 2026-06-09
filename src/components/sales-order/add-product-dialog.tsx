import { useState, useMemo, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown, ChevronUp, Plus, ArrowLeft, Calculator, Scissors } from "lucide-react";
import { MOCK_CATALOG_PRODUCTS } from "@/data/mock-sales-order";
import { INITIAL_MASTER_PATTERNS } from "@/data/mock-masters";
import { CatalogProduct } from "@/types/sales-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrimConfigs } from "@/components/sales-order/trim-configs";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: any) => void;
  editProduct?: any;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
const EXTENDED_SIZES = ["XXL", "3XL", "4XL", "5XL", "6XL"] as const;
const AUDIENCE_FILTERS = ["Men's Shirt", "Men's T-Shirt", "Women's Shirt", "Women's T-Shirt", "Kids' Wear"] as const;
type AudienceFilter = typeof AUDIENCE_FILTERS[number];
const BRAND_BADGES = ["Zara", "H&M", "Uniqlo", "Levi's"] as const;

// Hardcoded Master Values
const MASTER_CATEGORIES = ["Men's Shirt", "Men's T-Shirt", "Women's Shirt", "Women's T-Shirt", "Kids' Wear"];
const MASTER_SUBCATEGORIES = ["T-Shirt", "Shirt", "Hoodie", "Dress", "Trouser", "Skirt", "Top", "Shorts", "Jacket"];
const MASTER_TYPES = ["Half Sleeves", "Full Sleeves", "Sleeveless", "Full Length", "Knee Length"];
const MASTER_TYPE2S = ["Regular Collar", "Casual Collar", "Round Neck", "V-Neck", "Polo"];

export function AddProductDialog({ open, onOpenChange, onAddProduct, editProduct }: AddProductDialogProps) {
  const [catalogItems, setCatalogItems] = useState<CatalogProduct[]>(MOCK_CATALOG_PRODUCTS);
  const [viewMode, setViewMode] = useState<'search' | 'create'>('search');

  const [searchQuery, setSearchQuery] = useState("");
  const [activeAudience, setActiveAudience] = useState<AudienceFilter>("Men's Shirt");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedFabric, setSelectedFabric] = useState("Cotton Poplin");
  const [selectedFit, setSelectedFit] = useState("Regular");
  const [customRate, setCustomRate] = useState<string>("");
  const [sqNumber, setSqNumber] = useState("");
  const [brandName, setBrandName] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [patternSearch, setPatternSearch] = useState("");
  const [isPatternOpen, setIsPatternOpen] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const [isRatioMode, setIsRatioMode] = useState(true);
  const [totalOrderQty, setTotalOrderQty] = useState<string>("");
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [adjustmentSize, setAdjustmentSize] = useState<string>("XL");

  // Keep adjustmentSize in visible bounds when showMoreSizes changes
  useEffect(() => {
    const activeSizes = showMoreSizes
      ? [...DEFAULT_SIZES, ...EXTENDED_SIZES]
      : [...DEFAULT_SIZES];
    if (!activeSizes.includes(adjustmentSize as any)) {
      setAdjustmentSize(activeSizes[activeSizes.length - 1]);
    }
  }, [showMoreSizes, adjustmentSize]);

  const handleCalculate = () => {
    const qty = parseInt(totalOrderQty);
    if (isNaN(qty) || qty <= 0) return;

    const activeSizes = showMoreSizes
      ? [...DEFAULT_SIZES, ...EXTENDED_SIZES]
      : [...DEFAULT_SIZES];

    let totalRatio = 0;
    activeSizes.forEach(size => {
      totalRatio += ratios[size] || 0;
    });

    if (totalRatio === 0) return;

    const baseSets = Math.floor(qty / totalRatio);
    const newQuantities: Record<string, number> = {};
    let allocatedTotal = 0;

    activeSizes.forEach(size => {
      const r = ratios[size] || 0;
      const sizeQty = r * baseSets;
      if (sizeQty > 0) {
        newQuantities[size] = sizeQty;
        allocatedTotal += sizeQty;
      }
    });

    const balance = qty - allocatedTotal;
    if (balance > 0) {
      const targetSize = activeSizes.includes(adjustmentSize as any) ? adjustmentSize : activeSizes[activeSizes.length - 1];
      newQuantities[targetSize] = (newQuantities[targetSize] || 0) + balance;
    }

    setQuantities(newQuantities);
  };

  const [newProduct, setNewProduct] = useState({
    code: "",
    rate: "",
    category: "",
    subcategory: "",
    name: "",
    type: "",
    type2: "",
    buttons: ""
  });

  const rateInputRef = useRef<HTMLInputElement>(null);

  const currentTotalQty = useMemo(() => {
    return Object.values(quantities).reduce((acc, qty) => acc + (qty || 0), 0);
  }, [quantities]);

  useEffect(() => {
    if (open && editProduct) {
      const catProduct = catalogItems.find(p => p.code === editProduct.productId);
      if (catProduct) setSelectedProductId(catProduct.id);
      setSelectedColor(editProduct.color || "White");
      setCustomRate(editProduct.rate?.toString() || "");
      setSqNumber(editProduct.sqNumber || "");
      setBrandName(editProduct.brandName || "");
      setQuantities(editProduct.sizeBreakdown || {});
      const hasExtendedSizes = Object.keys(editProduct.sizeBreakdown || {}).some(k => EXTENDED_SIZES.includes(k as any) && editProduct.sizeBreakdown[k] > 0);
      setShowMoreSizes(hasExtendedSizes);
      setViewMode('search');
    } else if (open) {
      setSelectedProductId(null);
      setSearchQuery("");
      setIsProductDropdownOpen(false);
      setQuantities({});
      setSelectedColor("White");
      setCustomRate("");
      setSqNumber("");
      setBrandName("");
      setShowMoreSizes(false);
      setViewMode('search');
      setCustomImage(null);
      setRatios({});
      setTotalOrderQty("");
      setIsRatioMode(true);
      setNewProduct({
        code: "",
        rate: "",
        category: "",
        subcategory: "",
        name: "",
        type: "",
        type2: "",
        buttons: ""
      });
    }
  }, [open, editProduct, catalogItems]);

  // ── Trim Config State ──
  const [trimValues, setTrimValues] = useState<{
    buttons: { code: string; color: string; image: string };
    label: { code: string; color: string; image: string };
    hangTag: { code: string; color: string; image: string };
  }>({
    buttons: { code: "", color: "", image: "" },
    label: { code: "", color: "", image: "" },
    hangTag: { code: "", color: "", image: "" },
  });

  // Restore trim values when editing an existing product
  useEffect(() => {
    if (open && editProduct) {
      setTrimValues(editProduct.trims || {
        buttons: { code: "", color: "", image: "" },
        label: { code: "", color: "", image: "" },
        hangTag: { code: "", color: "", image: "" },
      });
    } else if (open) {
      setTrimValues({
        buttons: { code: "", color: "", image: "" },
        label: { code: "", color: "", image: "" },
        hangTag: { code: "", color: "", image: "" },
      });
    }
  }, [open, editProduct]);

  const handleTrimChange = (key: 'buttons' | 'label' | 'hangTag', field: 'code' | 'color' | 'image', value: string) => {
    setTrimValues(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSaveTrims = () => {
    if (!editProduct) return;
    onAddProduct({ ...editProduct, trims: trimValues });
    handleClose();
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return catalogItems;
    const query = searchQuery.toLowerCase();
    return catalogItems.filter(p => {
      const isActiveAudience = p.category.toLowerCase().startsWith(activeAudience.toLowerCase());
      const matchesQuery =
        p.code.toLowerCase() === query ||
        p.sqNumber?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.subcategory.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query);

      return isActiveAudience && matchesQuery;
    });
  }, [searchQuery, catalogItems, activeAudience]);

  const visibleProducts = useMemo(() => {
    if (searchQuery) return filteredProducts;
    return catalogItems.filter(p => p.category.toLowerCase().startsWith(activeAudience.toLowerCase()));
  }, [activeAudience, catalogItems, filteredProducts, searchQuery]);

  const selectedProduct = useMemo(() => {
    return catalogItems.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId, catalogItems]);

  // Sync custom rate when product changes
  useEffect(() => {
    if (selectedProduct && !editProduct) {
      setCustomRate(selectedProduct.rate.toString());
      setTimeout(() => {
        rateInputRef.current?.focus();
        rateInputRef.current?.select();
      }, 50);
    }
  }, [selectedProduct, editProduct]);

  const currentTotalAmount = useMemo(() => {
    if (!selectedProduct) return 0;
    const rate = parseFloat(customRate) || 0;
    return currentTotalQty * rate;
  }, [currentTotalQty, selectedProduct, customRate]);

  const handleAdd = () => {
    if (!selectedProduct) return;

    const sizeBreakdown: Record<string, number> = {};
    let totalQty = 0;

    [...DEFAULT_SIZES, ...EXTENDED_SIZES].forEach(size => {
      const qty = quantities[size] || 0;
      if (qty > 0) {
        sizeBreakdown[size] = qty;
        totalQty += qty;
      }
    });

    if (totalQty === 0) {
      alert("Please enter at least one quantity.");
      return;
    }

    const newLineItem = {
      id: editProduct ? editProduct.id : `new-${Date.now()}`,
      productId: selectedProduct.code,
      name: selectedProduct.name,
      category: selectedProduct.category,
      subcategory: selectedProduct.subcategory,
      type: selectedProduct.type,
      brandName,
      sqNumber,
      color: selectedColor,
      fabric: selectedFabric,
      fit: selectedFit,
      pattern: INITIAL_MASTER_PATTERNS.find(p => p.code === selectedPattern) || null,
      rate: parseFloat(customRate) || 0,
      sizeBreakdown: sizeBreakdown,
    };

    onAddProduct(newLineItem);
    handleClose();
  };

  const handleCreateProduct = () => {
    if (!newProduct.code || !newProduct.name || !newProduct.category || !newProduct.rate) {
      alert("Please fill in the required fields (Code, Name, Rate, Category).");
      return;
    }

    const createdProduct: CatalogProduct = {
      id: `cat-${Date.now()}`,
      code: newProduct.code,
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory || "-",
      type: newProduct.type || "-",
      color: "N/A", // Color is selected during Add
      rate: parseFloat(newProduct.rate) || 0,
      buttons: newProduct.buttons || undefined,
    };

    setCatalogItems([createdProduct, ...catalogItems]);
    setSelectedProductId(createdProduct.id);
    setViewMode('search');
    setSearchQuery("");
    setIsProductDropdownOpen(false);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedProductId(null);
    setIsProductDropdownOpen(false);
    setQuantities({});
    setShowMoreSizes(false);
    setSelectedColor("White");
    setSelectedFabric("Cotton Poplin");
    setSelectedFit("Regular");
    setSqNumber("");
    setBrandName("");
    setSelectedPattern("");
    setViewMode('search');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[860px] h-[88vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Scissors className="w-4 h-4 text-[#0453B8] shrink-0" />
            <DialogTitle className="text-base font-bold text-slate-900">
              Trim Config
              {editProduct && (
                <span className="ml-2 text-sm font-semibold text-slate-400">— {editProduct.productId || editProduct.name}</span>
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">

          {/* Product Info Card */}
          {editProduct && (() => {
            const prod = editProduct;
            const totalQty = Object.values(prod.sizeBreakdown || {}).reduce((a: number, v: any) => a + (parseInt(v) || 0), 0);
            let imageSrc = "/men casual half shirt.jpg";
            const nameLower = (prod.name || "").toLowerCase();
            if (nameLower.includes("formal") || (prod.productId || "").startsWith("MS")) {
              imageSrc = (prod.type || "").toLowerCase().includes("full") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
            }
            if (nameLower.includes("t-shirt") || (prod.productId || "").startsWith("MT")) {
              imageSrc = "/men casual tshirt.jpeg";
            }
            return (
              <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Product Details</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F5F6F8] rounded-lg shrink-0 border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                    <img src={imageSrc} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">{prod.productId || prod.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {prod.name} &bull; {prod.type} &bull; {prod.subcategory === "T-Shirt" ? "Round Neck" : "Regular Collar"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#0453B8]">{totalQty} pcs</p>
                        <p className="text-[10px] text-slate-500">total qty</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[
                        { label: 'Color', val: prod.color },
                        { label: 'Fabric', val: prod.fabric || 'N/A' },
                        { label: 'Fit', val: prod.fit || 'N/A' },
                        { label: 'Brand', val: prod.brandName || 'No Brand' },
                        { label: 'SKU', val: prod.sqNumber || 'N/A' },
                      ].map(item => (
                        <span key={item.label} className="inline-flex gap-1 bg-slate-50 border border-slate-200 text-slate-600 font-medium text-[10px] px-2 py-0.5 rounded-md">
                          <span className="text-slate-400">{item.label}:</span>
                          <span className="font-bold text-slate-700">{item.val}</span>
                        </span>
                      ))}
                    </div>
                    {prod.sizeBreakdown && (
                      <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold mr-0.5">SIZES:</span>
                        {Object.entries(prod.sizeBreakdown)
                          .filter(([_, q]) => (q as number) > 0)
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
            );
          })()}

          {/* Trim Configs */}
          <div className="mb-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Trim Material Configurations</p>
            <p className="text-[11px] text-slate-500">Enter details for each trim material used in this purchase order.</p>
          </div>
          <TrimConfigs values={trimValues} onChange={handleTrimChange} />

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 flex-shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Button variant="outline" onClick={handleClose} className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold h-11 px-6">
            Close
          </Button>
          <Button
            variant="primary"
            className="h-11 px-8"
            onClick={handleSaveTrims}
            disabled={!editProduct}
          >
            Save Trim Config
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}


