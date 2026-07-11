import { useFormContext, useFieldArray } from "react-hook-form";
import { SalesOrder, ProductLineItem } from "@/types/sales-order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, X, Scissors } from "lucide-react";
import { SizeBreakdownRow } from "./size-breakdown-row";
import { AddProductDialog } from "./add-product-dialog";
import { BomConfigDialog } from "./bom-config-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ProductsTable({ isReadOnly = false, hideEditDetails = false }: { isReadOnly?: boolean, hideEditDetails?: boolean }) {
  const { control, register, watch } = useFormContext<SalesOrder>();
  const { fields, prepend, remove, update } = useFieldArray({
    control,
    name: "products",
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductLineItem | null>(null);
  const [trimConfigProduct, setTrimConfigProduct] = useState<ProductLineItem | null>(null);
  const [trimConfigIndex, setTrimConfigIndex] = useState<number | null>(null);

  const products = watch("products");
  const salesOrderNo = watch("salesOrderNo") || "Draft SO";

  const handleEdit = (index: number) => {
    setEditingIndex(index);
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
          <Button variant="primary" className="h-10 px-4" onClick={(e) => { e.preventDefault(); setIsAddProductOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-10 text-center px-2">#</TableHead>
              <TableHead className="w-[280px] min-w-[280px] px-2">Product</TableHead>
              <TableHead className="w-[100px] pl-6 pr-2">Line No.</TableHead>
              <TableHead className="w-[110px] pl-6 pr-2">Color</TableHead>
              {!hideEditDetails && <TableHead className="w-[130px] px-2">Pattern</TableHead>}
              {!hideEditDetails && <TableHead className="w-[280px] text-center px-2">Size Breakup (Qty)</TableHead>}
              {!hideEditDetails && <TableHead className="w-[80px] text-center px-2">Total Qty</TableHead>}
              {!hideEditDetails && <TableHead className="w-[100px] text-center px-2">Rate (₹)</TableHead>}
              {!hideEditDetails && <TableHead className="w-[130px] text-right pr-6 pl-2">Amount (₹)</TableHead>}
              {hideEditDetails && <TableHead className="px-2 w-[25%]">Fabric Config</TableHead>}
              {hideEditDetails && <TableHead className="px-2 w-[30%]">Trim Config</TableHead>}
              {!isReadOnly && <TableHead className="w-[80px] text-center px-2">Action</TableHead>}
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
                  <TableCell className="text-center text-sm font-medium text-slate-600 px-2 py-2">{index + 1}</TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setViewingProduct(product)}
                        className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-800">{product.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {product.type || "Unknown"} {product.subcategory === "T-Shirt" || product.name.toLowerCase().includes("t-shirt") ? "Round Neck" : "Regular Collar"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pl-6 pr-2 py-2">
                    <span className="text-sm font-bold text-slate-700">L{index + 1}</span>
                  </TableCell>
                  <TableCell className="pl-6 pr-2 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: product.color.toLowerCase() === 'navy' ? '#000080' : product.color.toLowerCase() }}
                      />
                      <span className="text-sm text-slate-700">{product.color}</span>
                    </div>
                  </TableCell>
                  {!hideEditDetails && (
                    <TableCell className="px-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        {product.pattern ? (
                          <>
                            <span className="text-sm font-medium text-slate-700">{product.pattern.code}</span>
                            <span className="text-[11px] text-slate-500">{product.pattern.brand} - {product.pattern.fit}</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-slate-700">N/A</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {!hideEditDetails && (
                    <TableCell className="flex justify-center px-2 py-2">
                      <SizeBreakdownRow index={index} />
                    </TableCell>
                  )}
                  {!hideEditDetails && (
                    <TableCell className="text-center font-semibold text-slate-800 px-2 py-2">
                      {isReadOnly ? (
                        <div 
                          className="mx-auto flex h-[30px] w-[64px] items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-sm font-semibold text-slate-900 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => handleEdit(index)}
                        >
                          {totalQty}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="mx-auto flex h-[30px] w-[64px] items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0453B8]/30"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(index);
                          }}
                        >
                          {totalQty}
                        </button>
                      )}
                    </TableCell>
                  )}
                  {!hideEditDetails && (
                    <TableCell className="text-center px-2 py-2">
                      <span className="text-sm font-medium text-slate-800">{product.rate}</span>
                    </TableCell>
                  )}
                  {!hideEditDetails && (
                    <TableCell className="text-right font-semibold text-slate-800 pr-6 pl-2 py-2">
                      {amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  )}
                  {hideEditDetails && (
                    <TableCell className="px-2 py-2">
                      {(product as any).fabricBom ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-800">{(product as any).fabricBom.type || 'N/A'}</span>
                          <span className="text-[11px] text-slate-500">{(product as any).fabricBom.gsm || '-'} GSM • {(product as any).fabricBom.width || '-'} Width • {(product as any).fabricBom.color || '-'}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not Configured</span>
                      )}
                    </TableCell>
                  )}
                  {hideEditDetails && (
                    <TableCell className="px-2 py-2">
                      {(product as any).trims ? (
                        <div className="flex flex-col gap-1">
                          {((product as any).trims.buttons?.code || (product as any).trims.buttons?.color) && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-medium text-slate-500 w-14">Button</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[80px]">{(product as any).trims.buttons.code || '-'}</span>
                              {(product as any).trims.buttons?.color && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <div className="flex items-center gap-1 truncate">
                                    <div className="w-2 h-2 rounded-full border border-slate-300 shrink-0 shadow-sm" style={{ backgroundColor: (product as any).trims.buttons.color.toLowerCase() === 'navy' ? '#000080' : (product as any).trims.buttons.color }} />
                                    <span className="text-slate-500 truncate">{(product as any).trims.buttons.color}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          {((product as any).trims.label?.code || (product as any).trims.label?.color) && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-medium text-slate-500 w-14">Label</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[80px]">{(product as any).trims.label.code || '-'}</span>
                              {(product as any).trims.label?.color && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <div className="flex items-center gap-1 truncate">
                                    <div className="w-2 h-2 rounded-full border border-slate-300 shrink-0 shadow-sm" style={{ backgroundColor: (product as any).trims.label.color.toLowerCase() === 'navy' ? '#000080' : (product as any).trims.label.color }} />
                                    <span className="text-slate-500 truncate">{(product as any).trims.label.color}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          {((product as any).trims.hangTag?.code || (product as any).trims.hangTag?.color) && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-medium text-slate-500 w-14">Hang Tag</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[80px]">{(product as any).trims.hangTag.code || '-'}</span>
                              {(product as any).trims.hangTag?.color && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <div className="flex items-center gap-1 truncate">
                                    <div className="w-2 h-2 rounded-full border border-slate-300 shrink-0 shadow-sm" style={{ backgroundColor: (product as any).trims.hangTag.color.toLowerCase() === 'navy' ? '#000080' : (product as any).trims.hangTag.color }} />
                                    <span className="text-slate-500 truncate">{(product as any).trims.hangTag.color}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not Configured</span>
                      )}
                    </TableCell>
                  )}

                  {!isReadOnly && (
                    <TableCell className="px-2 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-100" onClick={() => remove(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter className="bg-slate-50 border-t border-slate-200">
            <TableRow className="hover:bg-slate-50/50">
              <TableCell colSpan={hideEditDetails ? 6 : 6} className="pl-6 py-3 text-sm text-slate-600 font-semibold">
                Total Items: <span>{products.length}</span>
              </TableCell>
              {!hideEditDetails && (
                <>
                  <TableCell className="text-right pr-4 py-3 text-sm font-bold text-slate-700">
                    Total Qty
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <span className="text-sm font-bold text-slate-900">
                      {products.reduce((acc, p) => acc + (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0), 0)}
                    </span>
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
              prepend(product);
            }
          }}
          editProduct={editingIndex !== null ? products[editingIndex] : undefined}
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
    </div>
  );
}
