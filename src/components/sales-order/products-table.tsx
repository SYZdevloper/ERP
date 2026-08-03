import { useFormContext, useFieldArray } from "react-hook-form";
import { SalesOrder, ProductLineItem } from "@/types/sales-order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, X, Scissors, Edit2 } from "lucide-react";
import { SizeBreakdownRow } from "./size-breakdown-row";
import { AddProductDialog } from "./add-product-dialog";
import { BomConfigDialog } from "./bom-config-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_CATALOG_PRODUCTS } from "@/data/mock-sales-order";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ProductsTable({ isReadOnly = false, hideEditDetails = false }: { isReadOnly?: boolean, hideEditDetails?: boolean }) {
  const { control, register, watch } = useFormContext<SalesOrder>();
  const { fields, prepend, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'search' | 'create'>('search');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductLineItem | null>(null);
  const [trimConfigProduct, setTrimConfigProduct] = useState<ProductLineItem | null>(null);
  const [trimConfigIndex, setTrimConfigIndex] = useState<number | null>(null);
  const [sizeBreakdownIndex, setSizeBreakdownIndex] = useState<number | null>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");
  const [quickAddSearch, setQuickAddSearch] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);

  const products = watch("products");
  const salesOrderNo = watch("salesOrderNo") || "Draft SO";

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDialogMode('search');
    setIsAddProductOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
          <h2 className="text-base font-semibold text-slate-800">Products</h2>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs font-semibold bg-white border-slate-200 text-[#0453B8] hover:bg-blue-50 shadow-sm" onClick={() => document.getElementById('bulk-upload-input')?.click()}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Bulk Add
            </Button>
            <input
              id="bulk-upload-input"
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  alert("Bulk add functionality will process " + e.target.files[0].name);
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-8 text-center px-1">#</TableHead>
              <TableHead className="min-w-[220px] px-2">Product</TableHead>
              <TableHead className="w-[70px] px-2">Line No.</TableHead>
              <TableHead className="w-[90px] px-2">Color</TableHead>
              {!hideEditDetails && <TableHead className="w-[90px] px-2">Pattern</TableHead>}
              {!hideEditDetails && <TableHead className="w-[70px] text-center px-1">Total Qty</TableHead>}
              {!hideEditDetails && <TableHead className="w-[80px] text-center px-1">Rate (₹)</TableHead>}
              {!hideEditDetails && <TableHead className="w-[100px] text-right px-2">Amount (₹)</TableHead>}
              {hideEditDetails && <TableHead className="px-2 w-[25%]">Fabric Config</TableHead>}
              {hideEditDetails && <TableHead className="px-2 w-[30%]">Trim Config</TableHead>}
              {!isReadOnly && <TableHead className="w-[60px] text-center px-1">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const product = products[index];
              const sizeBreakdown = product.sizeBreakdown;
              const totalQty = Object.values(sizeBreakdown).reduce((sum, qty) => sum + (typeof qty === 'number' ? qty : 0), 0);
              const amount = totalQty * product.rate;

              return (
                <TableRow key={field.id}>
                  <TableCell className="text-center text-sm font-medium text-slate-600 px-1 py-2">{index + 1}</TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setViewingProduct(product)}
                        className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-800 whitespace-normal line-clamp-1">{product.name}</span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {product.type || "Unknown"} {product.subcategory === "T-Shirt" || product.name.toLowerCase().includes("t-shirt") ? "Round Neck" : "Reg Collar"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <span className="text-sm font-bold text-slate-700">L{index + 1}</span>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: product.color.toLowerCase() === 'navy' ? '#000080' : product.color.toLowerCase() }}
                      />
                      <span className="text-xs text-slate-700 whitespace-normal line-clamp-1">{product.color}</span>
                    </div>
                  </TableCell>
                  {!hideEditDetails && (
                    <TableCell className="px-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        {product.pattern ? (
                          <>
                            <span className="text-xs font-medium text-slate-700 whitespace-normal line-clamp-1">{product.pattern.code}</span>
                            <span className="text-[10px] text-slate-500 whitespace-normal line-clamp-1">{product.pattern.brand} - {product.pattern.fit}</span>
                          </>
                        ) : (
                          <span className="text-xs font-medium text-slate-700">N/A</span>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {!hideEditDetails && (
                    <TableCell className="text-center font-semibold text-slate-800 px-1 py-2">
                      {isReadOnly ? (
                        <div 
                          className="mx-auto flex h-[30px] w-[50px] items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-sm font-semibold text-slate-900 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => setSizeBreakdownIndex(index)}
                        >
                          {totalQty}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="mx-auto flex h-[30px] w-[50px] items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0453B8]/30"
                          onClick={(e) => {
                            e.preventDefault();
                            setSizeBreakdownIndex(index);
                          }}
                        >
                          {totalQty}
                        </button>
                      )}
                    </TableCell>
                  )}
                  {!hideEditDetails && (
                    <TableCell className="text-center px-1 py-2">
                      <span className="text-[11px] font-medium text-slate-700">₹{product.rate.toFixed(2)}</span>
                    </TableCell>
                  )}
                  {!hideEditDetails && (
                    <TableCell className="text-right px-2 py-2">
                      <span className="text-[11px] font-bold text-slate-800">₹{amount.toFixed(2)}</span>
                    </TableCell>
                  )}
                  {hideEditDetails && (
                    <TableCell className="px-2 py-2">
                      {(product as any).fabricBom ? (
                        <div className="text-[10px] font-bold text-slate-800">{(product as any).fabricBom.type || 'N/A'}</div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">None</span>
                      )}
                    </TableCell>
                  )}
                  {hideEditDetails && (
                    <TableCell className="px-2 py-2">
                      {(product as any).trims ? (
                        <div className="text-[10px] text-slate-600">Configured</div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">None</span>
                      )}
                    </TableCell>
                  )}
                  {!isReadOnly && (
                    <TableCell className="text-center px-1 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            
            {/* Quick Add Row */}
            {!isReadOnly && (
              <TableRow className="bg-slate-50/30 hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-center text-sm font-medium text-slate-400 px-1 py-2">
                  <Plus className="w-4 h-4 mx-auto" />
                </TableCell>
                <TableCell colSpan={hideEditDetails ? 6 : 8} className="px-2 py-2">
                  <Popover open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                    <PopoverTrigger asChild>
                      <Input 
                        id="product-quick-add"
                        placeholder="Type product name (e.g. Mens Cuban collar) and press Enter to add..."
                        className="h-8 text-sm bg-white border-dashed border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500 w-full max-w-md shadow-sm"
                        value={quickAddSearch}
                        onChange={(e) => {
                          setQuickAddSearch(e.target.value);
                          setIsQuickAddOpen(true);
                          setHighlightedProductIndex(0);
                        }}
                        onFocus={() => setIsQuickAddOpen(true)}
                        onKeyDown={(e) => {
                          const filtered = MOCK_CATALOG_PRODUCTS.filter(p => !quickAddSearch || p.name.toLowerCase().includes(quickAddSearch.toLowerCase()) || p.code.toLowerCase().includes(quickAddSearch.toLowerCase()));
                          
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setHighlightedProductIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setHighlightedProductIndex(prev => (prev > 0 ? prev - 1 : 0));
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            if (filtered.length > 0) {
                              const selected = filtered[highlightedProductIndex];
                              setInitialSearchQuery(selected.name);
                              setDialogMode('search');
                              setIsAddProductOpen(true);
                              setQuickAddSearch("");
                              setIsQuickAddOpen(false);
                            } else {
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                setInitialSearchQuery(val);
                                setDialogMode('search');
                                setIsAddProductOpen(true);
                                setQuickAddSearch("");
                                setIsQuickAddOpen(false);
                              }
                            }
                          }
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                      <div className="max-h-[300px] overflow-y-auto py-2">
                        {MOCK_CATALOG_PRODUCTS
                          .filter(p => !quickAddSearch || p.name.toLowerCase().includes(quickAddSearch.toLowerCase()) || p.code.toLowerCase().includes(quickAddSearch.toLowerCase()))
                          .map((p, idx) => (
                            <button
                              key={p.id}
                              className={`w-full text-left px-4 py-2 outline-none flex flex-col transition-colors border-l-2 ${highlightedProductIndex === idx ? 'bg-slate-100 border-[#0453B8]' : 'border-transparent hover:bg-slate-50 hover:border-[#0453B8]'}`}
                              onClick={() => {
                                setInitialSearchQuery(p.name);
                                setDialogMode('search');
                                setIsAddProductOpen(true);
                                setQuickAddSearch("");
                                setIsQuickAddOpen(false);
                              }}
                            >
                              <span className="font-bold text-sm text-slate-900">
                                {quickAddSearch ? (
                                  p.name.split(new RegExp(`(${quickAddSearch})`, 'gi')).map((part, i) => 
                                    part.toLowerCase() === quickAddSearch.toLowerCase() ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark> : <span key={i}>{part}</span>
                                  )
                                ) : (
                                  p.name
                                )}
                              </span>
                              <span className="text-xs text-slate-500">
                                {quickAddSearch ? (
                                  p.code.split(new RegExp(`(${quickAddSearch})`, 'gi')).map((part, i) => 
                                    part.toLowerCase() === quickAddSearch.toLowerCase() ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark> : <span key={i}>{part}</span>
                                  )
                                ) : (
                                  p.code
                                )} • {p.subcategory}
                              </span>
                            </button>
                          ))}
                        {MOCK_CATALOG_PRODUCTS.filter(p => !quickAddSearch || p.name.toLowerCase().includes(quickAddSearch.toLowerCase()) || p.code.toLowerCase().includes(quickAddSearch.toLowerCase())).length === 0 && (
                          <div className="px-4 py-3 text-sm text-slate-500 text-center">No products found</div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-slate-50 border-t border-slate-200">
            <TableRow>
              <TableCell colSpan={hideEditDetails ? 4 : 5} className="text-right font-bold text-slate-800 px-2 py-3">Total</TableCell>
              {!hideEditDetails && (
                <TableCell className="text-center font-bold text-slate-800 px-1 py-3">
                  {products.reduce((acc, p) => acc + Object.values(p.sizeBreakdown).reduce((sum, qty) => sum + (typeof qty === 'number' ? qty : 0), 0), 0)}
                </TableCell>
              )}
              {!hideEditDetails && <TableCell />}
              {!hideEditDetails && (
                <TableCell className="text-right font-bold text-slate-800 px-2 py-3">
                  ₹{products.reduce((acc, p) => {
                    const totalQty = Object.values(p.sizeBreakdown).reduce((sum, qty) => sum + (typeof qty === 'number' ? qty : 0), 0);
                    return acc + (totalQty * p.rate);
                  }, 0).toFixed(2)}
                </TableCell>
              )}
              {hideEditDetails && (
                <>
                  <TableCell className="text-left font-bold text-slate-800 px-2 py-3">
                    {(() => {
                      const totalMtrs = products.reduce((acc, p) => {
                        const q = (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0);
                        return acc + (q * (p.fabricBom?.consumption || 0));
                      }, 0);
                      return totalMtrs > 0 ? (
                        <span className="text-sm font-medium text-slate-500 ml-1.5">
                          ({totalMtrs.toFixed(2)} Mtrs)
                        </span>
                      ) : null;
                    })()}
                  </TableCell>
                  <TableCell />
                </>
              )}
              {!isReadOnly && <TableCell />}
            </TableRow>
          </TableFooter>
        </Table>
      </div>


      {isAddProductOpen && (
        <AddProductDialog
          open={isAddProductOpen}
          onOpenChange={(open) => {
            setIsAddProductOpen(open);
            if (!open) setEditingIndex(null);
          }}
          onAddProduct={(product) => {
            if (editingIndex !== null) {
              update(editingIndex, product);
              setEditingIndex(null);
            } else {
              append(product);
            }
            setInitialSearchQuery("");
          }}
          editProduct={editingIndex !== null ? products[editingIndex] : undefined}
          initialSearchQuery={initialSearchQuery}
          initialViewMode={dialogMode}
        />
      )}

      <BomConfigDialog
        open={!!trimConfigProduct}
        onOpenChange={(o) => { if (!o) { setTrimConfigProduct(null); setTrimConfigIndex(null); } }}
        product={trimConfigProduct}
        onSave={(updated) => {
          if (trimConfigIndex !== null) update(trimConfigIndex, updated);
          setTrimConfigProduct(null);
          setTrimConfigIndex(null);
        }}
      />

      {viewingProduct && (
        <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white shadow-2xl border-0 [&>button]:hidden">
            <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between bg-white shadow-sm z-10">
              <DialogTitle className="text-xl font-bold text-[#0F172A]">Product Details</DialogTitle>
              <button onClick={() => setViewingProduct(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-0 max-h-[80vh] overflow-y-auto">
              <div className="bg-slate-100 flex items-center justify-center p-6 border-r border-slate-200">
                {viewingProduct.image ? (
                  <img src={viewingProduct.image} alt={viewingProduct.name} className="max-w-full max-h-[400px] object-contain drop-shadow-md rounded" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <ImageIcon className="w-16 h-16 text-slate-300 mb-4" />
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product</h3>
                  <p className="text-lg font-bold text-slate-900">{viewingProduct.name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Brand & Buyer Design No</h3>
                  <p className="text-md font-semibold text-slate-700">{viewingProduct.brandName || "No Brand"} {viewingProduct.sqNumber ? `• ${viewingProduct.sqNumber}` : ''}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Color</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: viewingProduct.color.toLowerCase() === 'navy' ? '#000080' : viewingProduct.color.toLowerCase() }} />
                      <p className="text-md font-semibold text-slate-700">{viewingProduct.color}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fabric</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingProduct.fabric || "Cotton Poplin"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Qty</h3>
                    <p className="text-md font-bold text-[#0453B8]">
                      {(viewingProduct.sizeBreakdown.XS || 0) + (viewingProduct.sizeBreakdown.S || 0) + (viewingProduct.sizeBreakdown.M || 0) + (viewingProduct.sizeBreakdown.L || 0) + (viewingProduct.sizeBreakdown.XL || 0) + (viewingProduct.sizeBreakdown.XXL || 0) + (viewingProduct.sizeBreakdown["3XL"] || 0) + (viewingProduct.sizeBreakdown["4XL"] || 0) + (viewingProduct.sizeBreakdown["5XL"] || 0) + (viewingProduct.sizeBreakdown["6XL"] || 0)} Pcs
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pattern</h3>
                    <p className="text-md font-semibold text-slate-700">
                      {viewingProduct.pattern ? `${viewingProduct.pattern.code} (${viewingProduct.pattern.brand} - ${viewingProduct.pattern.fit})` : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rate</h3>
                    <p className="text-md font-bold text-slate-900">₹ {(viewingProduct.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</h3>
                    <p className="text-md font-bold text-[#0453B8]">
                      ₹ {(((viewingProduct.sizeBreakdown.XS || 0) + (viewingProduct.sizeBreakdown.S || 0) + (viewingProduct.sizeBreakdown.M || 0) + (viewingProduct.sizeBreakdown.L || 0) + (viewingProduct.sizeBreakdown.XL || 0) + (viewingProduct.sizeBreakdown.XXL || 0) + (viewingProduct.sizeBreakdown["3XL"] || 0) + (viewingProduct.sizeBreakdown["4XL"] || 0) + (viewingProduct.sizeBreakdown["5XL"] || 0) + (viewingProduct.sizeBreakdown["6XL"] || 0)) * viewingProduct.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Size Breakdown Dialog */}
      <Dialog open={sizeBreakdownIndex !== null} onOpenChange={(open) => !open && setSizeBreakdownIndex(null)}>
        <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden shadow-2xl border-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Sizewise Detail
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {sizeBreakdownIndex !== null && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                    {products[sizeBreakdownIndex]?.image ? (
                      <img src={products[sizeBreakdownIndex].image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{products[sizeBreakdownIndex]?.name}</h3>
                    <p className="text-xs text-slate-500">{products[sizeBreakdownIndex]?.color} • {products[sizeBreakdownIndex]?.pattern?.code || "No Pattern"}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <SizeBreakdownRow index={sizeBreakdownIndex} />
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
            <Button variant="outline" onClick={() => setSizeBreakdownIndex(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
