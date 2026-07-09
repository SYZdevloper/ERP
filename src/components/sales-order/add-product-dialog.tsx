import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown, ChevronUp, Plus, ArrowLeft, Calculator, ImagePlus, X as XIcon, Eye, EyeOff } from "lucide-react";
import { MOCK_CATALOG_PRODUCTS } from "@/data/mock-sales-order";
import { INITIAL_MASTER_PATTERNS } from "@/data/mock-masters";
import { CatalogProduct } from "@/types/sales-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorDialog } from "@/components/masters/color-dialog";
import { FabricDialog } from "@/components/masters/fabric-dialog";
import { FitDialog } from "@/components/masters/fit-dialog";
import { PatternDialog } from "@/components/masters/pattern-dialog";
import { BrandDialog } from "@/components/masters/brand-dialog";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: any) => void;
  editProduct?: any;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
const EXTENDED_SIZES = ["XXL", "3XL", "4XL", "5XL", "6XL"] as const;
const AUDIENCE_FILTERS = ["Mens", "Womens", "Kids"] as const;
type AudienceFilter = typeof AUDIENCE_FILTERS[number];

// Hardcoded Master Values
const MASTER_CATEGORIES = ["Mens", "Womens", "Kids"];
const MASTER_SUBCATEGORIES = ["T-Shirt", "Shirt", "Hoodie", "Dress", "Trouser", "Skirt", "Top", "Shorts", "Jacket"];
const MASTER_TYPES = ["Half Sleeves", "Full Sleeves", "Sleeveless", "Full Length", "Knee Length"];
const MASTER_TYPE2S = ["Regular Collar", "Casual Collar", "Round Neck", "V-Neck", "Polo"];

export function AddProductDialog({ open, onOpenChange, onAddProduct, editProduct }: AddProductDialogProps) {
  const [catalogItems, setCatalogItems] = useState<CatalogProduct[]>(MOCK_CATALOG_PRODUCTS);
  const [viewMode, setViewMode] = useState<'search' | 'create'>('search');
  const [showSearch, setShowSearch] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeAudience, setActiveAudience] = useState<AudienceFilter>("Mens");
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
  const [customProductName, setCustomProductName] = useState("");

  const [isRatioMode, setIsRatioMode] = useState(true);
  const [totalOrderQty, setTotalOrderQty] = useState<string>("");
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [adjustmentSize, setAdjustmentSize] = useState<string>("XL");
  const [newProductImage, setNewProductImage] = useState<string | null>(null);

  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [isFabricDialogOpen, setIsFabricDialogOpen] = useState(false);
  const [isFitDialogOpen, setIsFitDialogOpen] = useState(false);
  const [isPatternMasterOpen, setIsPatternMasterOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [showTags, setShowTags] = useState(true);

  // Keep adjustmentSize in visible bounds when showMoreSizes changes
  useEffect(() => {
    const activeSizes = showMoreSizes
      ? [...DEFAULT_SIZES, ...EXTENDED_SIZES]
      : [...DEFAULT_SIZES];
    if (!activeSizes.includes(adjustmentSize as any)) {
      setAdjustmentSize(activeSizes[activeSizes.length - 1]);
    }
  }, [showMoreSizes, adjustmentSize]);

  const handleCalculate = useCallback(() => {
    const qty = parseInt(totalOrderQty);
    if (isNaN(qty) || qty <= 0) return;

    const activeSizes = showMoreSizes
      ? [...DEFAULT_SIZES, ...EXTENDED_SIZES]
      : [...DEFAULT_SIZES];

    let totalRatio = 0;
    activeSizes.forEach(size => { totalRatio += ratios[size] || 0; });
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
  }, [totalOrderQty, ratios, adjustmentSize, showMoreSizes]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const [newProduct, setNewProduct] = useState({
    code: "", rate: "", category: "", subcategory: "", name: "", type: "", type2: "", buttons: "", description: ""
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
      setSelectedFabric(editProduct.fabric || "Cotton Poplin");
      setSelectedFit(editProduct.fit || "Regular");
      setCustomRate(editProduct.rate?.toString() || "");
      setSqNumber(editProduct.sqNumber || "");
      setBrandName(editProduct.brandName || "");
      setQuantities(editProduct.sizeBreakdown || {});
      const hasExtendedSizes = Object.keys(editProduct.sizeBreakdown || {}).some(k => EXTENDED_SIZES.includes(k as any) && editProduct.sizeBreakdown[k] > 0);
      setShowMoreSizes(hasExtendedSizes);
      setViewMode('search');
      setShowSearch(false);
    } else if (open) {
      setSelectedProductId(catalogItems.length > 0 ? catalogItems[0].id : null);
      setSearchQuery("");
      setIsProductDropdownOpen(false);
      setQuantities({});
      setSelectedColor("White");
      setSelectedFabric("Cotton Poplin");
      setSelectedFit("Regular");
      setCustomRate("");
      setSqNumber("");
      setBrandName("");
      setShowMoreSizes(false);
      setViewMode('search');
      setShowSearch(true);
      setShowTags(true);
      setCustomImage(null);
      setRatios({});
      setTotalOrderQty("");
      setIsRatioMode(true);
      setNewProductImage(null);
      setNewProduct({ code: "", rate: "", category: "", subcategory: "", name: "", type: "", type2: "", buttons: "", description: "" });
    }
  }, [open, editProduct, catalogItems]);

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

  // Sync custom rate and name when product changes
  useEffect(() => {
    if (selectedProduct && !editProduct) {
      setCustomProductName(selectedProduct.name);
      setCustomRate(selectedProduct.rate.toString());
      setTimeout(() => {
        rateInputRef.current?.focus();
        rateInputRef.current?.select();
      }, 50);
    }
  }, [selectedProduct, editProduct]);

  // Auto-fill new product name
  useEffect(() => {
    if (viewMode === 'create') {
      const autoName = [newProduct.category, newProduct.subcategory, newProduct.type2, newProduct.type, newProduct.description].filter(Boolean).join(" ");
      setNewProduct(prev => prev.name !== autoName ? { ...prev, name: autoName } : prev);
    }
  }, [newProduct.category, newProduct.subcategory, newProduct.type, newProduct.type2, newProduct.description, viewMode]);

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
      name: customProductName || selectedProduct.name,
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
      sizeBreakdown,
    };

    onAddProduct(newLineItem);
    handleClose();
  };

  const handleCreateProduct = () => {
    if (!newProduct.code || !newProduct.name || !newProduct.category) {
      alert("Please fill in the required fields (Code, Name, For).");
      return;
    }

    const createdProduct: CatalogProduct = {
      id: `cat-${Date.now()}`,
      code: newProduct.code,
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory || "-",
      type: newProduct.type || "-",
      color: "N/A",
      rate: 0,
      description: newProduct.description,
    };

    setCatalogItems([createdProduct, ...catalogItems]);
    setSelectedProductId(createdProduct.id);
    setViewMode('search');
    setSearchQuery("");
    setIsProductDropdownOpen(false);
    setShowSearch(false);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedProductId(null);
    setShowSearch(true);
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

  const handleSaveColor = (color: any) => {
    setSelectedColor(color.name);
    setIsColorDialogOpen(false);
  };
  const handleSaveFabric = (fabric: any) => {
    setSelectedFabric(fabric.name);
    setIsFabricDialogOpen(false);
  };
  const handleSaveFit = (fit: any) => {
    setSelectedFit(fit.name);
    setIsFitDialogOpen(false);
  };
  const handleSavePattern = (pattern: any) => {
    setSelectedPattern(pattern.code);
    setIsPatternMasterOpen(false);
  };
  const handleSaveBrand = (brand: any) => {
    setBrandName(brand.name);
    setIsBrandDialogOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1000px] h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">
        <DialogHeader className="px-6 py-3 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {viewMode === 'create' && (
                <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-slate-500" onClick={() => setViewMode('search')}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {viewMode === 'search' ? (editProduct ? 'Edit Product' : 'Add Product') : 'Create Catalog Product'}
                </DialogTitle>
                {viewMode === 'create' && (
                  <p className="text-xs text-slate-500 mt-0.5">Products feed the cascading Category → Sub-Category → Product dropdowns.</p>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-3 pb-4 custom-scrollbar relative">

          {viewMode === 'search' && (
            <div className="flex flex-col">

              {/* ── Selected Product Detail + Configuration ── */}
              {selectedProduct && (
                <div className="border border-slate-200 rounded-xl bg-white p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">

                  <div className="flex flex-col md:flex-row gap-6 items-start mt-2 mb-4">
                    
                    {/* Left: Product Image */}
                    <div className="w-full md:w-[280px] flex flex-col gap-3 shrink-0">
                      <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center gap-4 shadow-sm bg-white text-center">
                        {(() => {
                          let imageSrc = "/men casual half shirt.jpg";
                          const nameLower = selectedProduct.name.toLowerCase();
                          if (nameLower.includes("formal") || selectedProduct.code.startsWith("MS")) {
                            imageSrc = selectedProduct.type.toLowerCase().includes("full") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
                          }
                          if (nameLower.includes("t-shirt") || selectedProduct.code.startsWith("MT")) {
                            imageSrc = "/men casual tshirt.jpeg";
                          }
                          return (
                            <>
                              <div
                                onClick={() => document.getElementById('config-product-image-input')?.click()}
                                className="relative w-[180px] aspect-square bg-[#F5F6F8] rounded-xl overflow-hidden p-4 cursor-pointer hover:ring-2 hover:ring-[#0453B8] transition-all group shrink-0 mx-auto"
                              >
                                <img src={customImage || imageSrc} alt={selectedProduct.name} className="w-full h-full object-contain mix-blend-multiply transition-opacity group-hover:opacity-50" />
                                
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                                  <ImagePlus className="w-8 h-8 text-[#0453B8]" />
                                  <span className="text-[10px] font-bold text-[#0453B8] mt-1 uppercase tracking-wider bg-white/80 px-2 py-1 rounded-md">Change Image</span>
                                </div>

                                {customImage && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setCustomImage(null); }}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  >
                                    <XIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <input
                                id="config-product-image-input"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const url = URL.createObjectURL(e.target.files[0]);
                                    setCustomImage(url);
                                  }
                                }}
                              />
                              <div>
                                <h3 className="text-lg font-extrabold text-slate-900 mb-1">{selectedProduct.code}</h3>
                                <p className="text-sm font-semibold text-slate-700">{selectedProduct.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{selectedProduct.subcategory === "T-Shirt" ? "Round Neck" : "Regular Collar"}</p>
                                <p className="text-xs text-slate-500">{selectedProduct.type}{selectedProduct.buttons ? ` • ${selectedProduct.buttons} Buttons` : ""}</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>


                    {/* Right: Form Fields */}
                    <div className="flex-1 w-full flex flex-col gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                      
                      {/* Product Dropdown */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Product</Label>
                        <Select value={selectedProductId || ""} onValueChange={(val) => setSelectedProductId(val)}>
                          <SelectTrigger className="h-auto min-h-10 py-2 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-slate-800 whitespace-normal text-left [&>span]:line-clamp-none [&>span]:whitespace-normal">
                            <SelectValue placeholder="Select Product">
                              {selectedProduct ? selectedProduct.name : "Select Product"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent position="popper" align="end" className="w-[600px] max-h-[50vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-2">
                              {["Mens", "Womens", "Kids"].map(category => {
                                const items = catalogItems.filter(p => p.category === category);
                                if (items.length === 0) return null;
                                return (
                                  <SelectGroup key={category} className="mb-2">
                                    <SelectLabel className="font-extrabold text-[#0453B8] text-[11px] uppercase tracking-wider bg-white sticky top-0 z-10">{category}</SelectLabel>
                                    {items.map(p => {
                                      let imageSrc = "/men casual half shirt.jpg";
                                      const nameLower = p.name.toLowerCase();
                                      if (nameLower.includes("formal") || p.code.startsWith("MS")) {
                                        imageSrc = p.type.toLowerCase().includes("full") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
                                      }
                                      if (nameLower.includes("t-shirt") || p.code.startsWith("MT")) {
                                        imageSrc = "/men casual tshirt.jpeg";
                                      }
                                      return (
                                        <SelectItem key={p.id} value={p.id}>
                                          <div className="flex items-center gap-3 py-1">
                                            <div className="w-8 h-8 rounded bg-[#F5F6F8] overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                                              <img src={imageSrc} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="font-bold text-slate-800 text-xs">{p.name}</span>
                                              <span className="text-[10px] text-slate-500 font-semibold">{p.code} • {p.subcategory}</span>
                                            </div>
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                );
                              })}
                            </div>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 1) Buyer Design No */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Buyer Design</Label>
                        <Input
                          value={sqNumber}
                          onChange={(e) => setSqNumber(e.target.value)}
                          placeholder="e.g. 10 digit code"
                          className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold px-3 focus-visible:ring-[#0453B8]"
                        />
                      </div>

                      {/* 2) Rate */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Rate <span className="text-red-500">*</span></Label>
                        <Input
                          ref={rateInputRef}
                          type="number"
                          min="0"
                          value={customRate}
                          onChange={(e) => setCustomRate(e.target.value)}
                          placeholder="0"
                          className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold px-3 focus-visible:ring-[#0453B8]"
                        />
                      </div>

                      {/* 3) Brand */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Brand</Label>
                        <div className="flex items-center gap-2 flex-wrap flex-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          {["Zara", "H&M", "Levi's", "No Brand"].map((brand) => (
                            <button
                              key={brand}
                              type="button"
                              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${brandName === brand
                                  ? "bg-white text-[#0453B8] shadow-sm border border-blue-200"
                                  : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                                }`}
                              onClick={() => setBrandName(brand)}
                            >
                              {brand}
                            </button>
                          ))}
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#0453B8] hover:bg-blue-100" onClick={() => setIsBrandDialogOpen(true)} title="Add New Brand">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 4) Pattern No */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Pattern No</Label>
                        <div className="flex-1 flex items-center gap-2">
                          <Popover open={isPatternOpen} onOpenChange={setIsPatternOpen}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" role="combobox" aria-expanded={isPatternOpen} className="h-10 flex-1 justify-between bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-slate-700 px-3">
                                {selectedPattern ? selectedPattern : "Select Pattern"}
                                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                              <div className="flex flex-col">
                                <div className="flex items-center border-b px-3">
                                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-400" />
                                  <Input
                                    placeholder="Search brand or code..."
                                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 shadow-none placeholder:text-slate-500 font-medium px-0"
                                    value={patternSearch}
                                    onChange={(e) => setPatternSearch(e.target.value)}
                                  />
                                </div>
                                <div className="max-h-[300px] overflow-y-auto py-2">
                                  {INITIAL_MASTER_PATTERNS
                                    .filter(p => p.brand.toLowerCase().includes(patternSearch.toLowerCase()) || p.code.toLowerCase().includes(patternSearch.toLowerCase()))
                                    .map(pattern => (
                                      <button
                                        key={pattern.code}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 focus:bg-slate-50 outline-none flex flex-col transition-colors border-l-2 border-transparent hover:border-[#0453B8]"
                                        onClick={() => { setSelectedPattern(pattern.code); setIsPatternOpen(false); }}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <span className="font-bold text-[13px] text-slate-900">{pattern.code}</span>
                                          <span className="font-semibold text-[11px] text-slate-500">{pattern.fit}</span>
                                        </div>
                                        <span className="text-[11px] font-semibold text-[#0453B8]">{pattern.brand}</span>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-[#0453B8] hover:bg-blue-50 border-slate-200" onClick={() => setIsPatternMasterOpen(true)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 5) Color */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Color <span className="text-red-500">*</span></Label>
                        <div className="flex-1 flex items-center gap-2">
                          <Select value={selectedColor} onValueChange={setSelectedColor}>
                            <SelectTrigger className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold">
                              <SelectValue placeholder="Select Color" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { label: "White", hex: "white" },
                                { label: "Black", hex: "black" },
                                { label: "Navy", hex: "#000080" },
                                { label: "Red", hex: "#ef4444" },
                                { label: "Grey", hex: "#808080" },
                              ].map(c => (
                                <SelectItem key={c.label} value={c.label}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: c.hex }} />
                                    <span>{c.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-[#0453B8] hover:bg-blue-50 border-slate-200" onClick={() => setIsColorDialogOpen(true)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 6) Fabric */}
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-slate-700 w-[120px] shrink-0">Fabric <span className="text-red-500">*</span></Label>
                        <div className="flex-1 flex items-center gap-2">
                          <Select value={selectedFabric} onValueChange={setSelectedFabric}>
                            <SelectTrigger className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold">
                              <SelectValue placeholder="Select Fabric" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cotton Poplin">Cotton Poplin</SelectItem>
                              <SelectItem value="Linen">Linen</SelectItem>
                              <SelectItem value="Denim">Denim</SelectItem>
                              <SelectItem value="Polyester">Polyester</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-[#0453B8] hover:bg-blue-50 border-slate-200" onClick={() => setIsFabricDialogOpen(true)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Size / Ratio Inputs */}
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-bold text-[#0453B8] uppercase tracking-wider whitespace-nowrap">
                          ENTER RATIOS
                        </Label>
                      </div>

                      {/* Advanced Calculator Moved Here */}
                      <div className="flex items-center gap-2 relative h-8 flex-1 justify-start ml-2">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-300 ease-in-out opacity-100 pointer-events-auto translate-x-0">
                          <Label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Total Qty</Label>
                          <Input
                            type="number"
                            min="0"
                            value={totalOrderQty}
                            onChange={(e) => setTotalOrderQty(e.target.value)}
                            placeholder="0"
                            className="h-8 w-20 bg-white border-slate-200 shadow-sm rounded-md text-[11px] font-semibold px-2 focus-visible:ring-[#0453B8]"
                          />
                          <Label className="text-[11px] font-bold text-slate-700 whitespace-nowrap ml-1">Adjust Size</Label>
                          <Select value={adjustmentSize} onValueChange={setAdjustmentSize}>
                            <SelectTrigger className="w-[75px] h-8 text-[11px] bg-white border-slate-200 font-semibold focus:ring-[#0453B8]">
                              <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {(showMoreSizes ? [...DEFAULT_SIZES, ...EXTENDED_SIZES] : DEFAULT_SIZES).map(size => (
                                <SelectItem key={size} value={size} className="text-xs">{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-[#0453B8] hover:text-blue-800 hover:bg-blue-50 px-3 rounded-full font-semibold shrink-0"
                        onClick={() => setShowMoreSizes(!showMoreSizes)}
                      >
                        {showMoreSizes ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
                        {showMoreSizes ? "Hide Extended Sizes" : "More Sizes"}
                      </Button>
                    </div>

                    <div className="flex w-full overflow-x-auto gap-2 pb-2 custom-scrollbar transition-all duration-300">
                      {/* Fixed labels column */}
                      <div className="flex flex-col pt-[31px] pr-2 gap-0 justify-start items-end text-[11px] font-bold text-slate-500 shrink-0 sticky left-0 bg-white z-10">
                        <div className="h-9 flex items-center">Ratio</div>
                        <div className="h-10 flex items-center">Pcs</div>
                      </div>
                      
                      {/* Size columns */}
                      {(showMoreSizes ? [...DEFAULT_SIZES, ...EXTENDED_SIZES] : DEFAULT_SIZES).map(size => (
                        <div key={size} className="flex flex-col shadow-sm rounded-md overflow-hidden border border-slate-200 bg-white shrink-0 w-[85px] animate-in fade-in zoom-in-95 duration-200">
                          <div className="text-[11px] text-center font-bold text-slate-700 bg-slate-100 py-1.5 border-b border-slate-200">{size}</div>
                          <div className="flex flex-col bg-white relative overflow-hidden">
                            {/* Ratio Input */}
                            <div className="w-full flex items-center transition-all duration-300 ease-in-out border-slate-200 opacity-100 h-9 border-b pointer-events-auto">
                              <Input
                                id={`ratio-input-${size}`}
                                type="number"
                                min="0"
                                placeholder="Ratio"
                                className="h-full w-full text-center px-2 rounded-none border-0 shadow-none focus-visible:ring-1 focus-visible:ring-[#0453B8] focus-visible:z-10 font-semibold text-slate-900 bg-slate-50 placeholder:text-slate-400 text-[11px]"
                                value={ratios[size] || ""}
                                onChange={(e) => setRatios({ ...ratios, [size]: parseInt(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const allSizes = showMoreSizes ? [...DEFAULT_SIZES, ...EXTENDED_SIZES] : DEFAULT_SIZES;
                                    const currentIndex = allSizes.indexOf(size as any);
                                    if (currentIndex < allSizes.length - 1) {
                                      const next = document.getElementById(`ratio-input-${allSizes[currentIndex + 1]}`);
                                      if (next) { next.focus(); (next as HTMLInputElement).select(); }
                                    }
                                  }
                                }}
                              />
                            </div>
                            {/* Qty Input */}
                            <div className="w-full flex items-center transition-all duration-300 ease-in-out h-10">
                              <Input
                                id={`size-input-${size}`}
                                type="number"
                                min="0"
                                placeholder="Pcs"
                                className="h-full w-full text-center px-2 rounded-none border-0 shadow-none focus-visible:ring-1 focus-visible:ring-[#0453B8] focus-visible:z-10 font-black bg-white transition-colors duration-300 text-sm text-[#0453B8]"
                                value={quantities[size] || ""}
                                onChange={(e) => setQuantities({ ...quantities, [size]: parseInt(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const allSizes = showMoreSizes ? [...DEFAULT_SIZES, ...EXTENDED_SIZES] : DEFAULT_SIZES;
                                    const currentIndex = allSizes.indexOf(size as any);
                                    if (currentIndex < allSizes.length - 1) {
                                      const next = document.getElementById(`size-input-${allSizes[currentIndex + 1]}`);
                                      if (next) { next.focus(); (next as HTMLInputElement).select(); }
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Create Product View ── */}
          {viewMode === 'create' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">

                {/* Image upload — spans 2 cols on its own row */}
                <div className="col-span-2 flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product Image</Label>
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => document.getElementById('new-product-image-input')?.click()}
                      className="relative w-[100px] h-[100px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#0453B8] hover:bg-blue-50 transition-colors group overflow-hidden shrink-0"
                    >
                      {newProductImage ? (
                        <>
                          <img src={newProductImage} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setNewProductImage(null); }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-7 h-7 text-slate-300 group-hover:text-[#0453B8] transition-colors" />
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0453B8] mt-1.5 transition-colors">Upload</span>
                        </>
                      )}
                    </div>
                    <input
                      id="new-product-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setNewProductImage(url);
                        }
                      }}
                    />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Upload a product photo (JPG, PNG, WebP).<br />
                      It will be shown in the catalog grid.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product Name <span className="text-red-500">*</span></Label>
                  <Input placeholder="Auto-filled name" className="h-[48px] w-full text-sm font-medium bg-slate-50 border-slate-200 shadow-sm rounded-lg" value={newProduct.name} readOnly />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Code <span className="text-red-500">*</span></Label>
                  <Input placeholder="e.g. MS-001" className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg" value={newProduct.code} onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">For (1) <span className="text-red-500">*</span></Label>
                  <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg"><SelectValue placeholder="Select For" /></SelectTrigger>
                    <SelectContent>{MASTER_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category (2)</Label>
                  <Select value={newProduct.subcategory} onValueChange={(v) => setNewProduct({ ...newProduct, subcategory: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg"><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>{MASTER_SUBCATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Collar Style (3)</Label>
                  <Select value={newProduct.type2} onValueChange={(v) => setNewProduct({ ...newProduct, type2: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg"><SelectValue placeholder="Select Collar Style" /></SelectTrigger>
                    <SelectContent>{MASTER_TYPE2S.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sleeve Type (4)</Label>
                  <Select value={newProduct.type} onValueChange={(v) => setNewProduct({ ...newProduct, type: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg"><SelectValue placeholder="Select Sleeve Type" /></SelectTrigger>
                    <SelectContent>{MASTER_TYPES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Additional Description (5)</Label>
                  <Input 
                    placeholder="e.g. Double Pocket with Flap" 
                    className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg" 
                    value={newProduct.description} 
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button variant="outline" onClick={() => setViewMode('search')} className="h-10 px-6 border-slate-200 text-slate-700">Cancel</Button>
                <Button onClick={handleCreateProduct} className="h-10 px-8 bg-[#0453B8] hover:bg-blue-700 text-white font-semibold">Create Product</Button>
              </div>
            </div>
          )}

        </div>

        {/* Persistent Footer in Search View */}
        {viewMode === 'search' && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
            <div className="flex items-center">
              {selectedProduct && (
                <div className="flex items-center gap-6 h-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Total Qty</span>
                    <span className="text-lg font-extrabold text-slate-900 leading-none mt-1">{currentTotalQty.toLocaleString('en-IN')} <span className="text-sm font-bold text-slate-500">pcs</span></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Total Amount</span>
                    <span className="text-lg font-extrabold text-[#0453B8] leading-none mt-1">₹{currentTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 text-sm font-bold border-[#0453B8] text-[#0453B8] hover:bg-blue-50 gap-2"
                onClick={() => {
                  setSelectedProductId(null);
                  setViewMode('create');
                }}
              >
                <Plus className="w-4 h-4" />
                New Product
              </Button>
              {selectedProduct ? (
                <>
                  <Button variant="outline" onClick={() => setSelectedProductId(null)} className="h-10 px-5 border-slate-200 text-slate-700 font-semibold">
                    ← Back
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={currentTotalQty === 0}
                    className="h-10 px-8 bg-[#0453B8] hover:bg-blue-700 text-white font-semibold shadow-sm"
                  >
                    {editProduct ? "Save Changes" : "Add to Order"}
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={handleClose} className="h-10 px-5 font-semibold text-slate-600 hover:text-slate-900">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>

      {/* Render Master Dialogs outside of the main DialogContent so they overlay correctly */}
      <ColorDialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen} initialData={null} onSave={handleSaveColor} />
      <FabricDialog open={isFabricDialogOpen} onOpenChange={setIsFabricDialogOpen} initialData={null} onSave={handleSaveFabric} />
      <FitDialog open={isFitDialogOpen} onOpenChange={setIsFitDialogOpen} initialData={null} onSave={handleSaveFit} />
      <PatternDialog open={isPatternMasterOpen} onOpenChange={setIsPatternMasterOpen} initialData={null} onSave={handleSavePattern} />
      <BrandDialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen} initialData={null} onSave={handleSaveBrand} />
    </Dialog>
  );
}
