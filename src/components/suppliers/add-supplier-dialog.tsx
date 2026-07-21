"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Supplier } from "@/types/supplier";

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  editSupplier?: Supplier | null;
}

export function AddSupplierDialog({ open, onOpenChange, onSave, editSupplier }: AddSupplierDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Both",
    contactPerson: "",
    phone: "",
    email: "",
    gstState: "",
    gstin: "",
    paymentTerms: "Credit",
    creditDays: "30",
    advancePercentage: "",
    billingAddress: ""
  });

  useEffect(() => {
    if (open && editSupplier) {
      // eslint-disable-next-line
      setFormData({
        name: editSupplier.name || "",
        category: editSupplier.category || "Both",
        contactPerson: editSupplier.contactPerson || "",
        phone: editSupplier.phone || "",
        email: editSupplier.email || "",
        gstState: editSupplier.gstState || "",
        gstin: editSupplier.gstin || "",
        paymentTerms: editSupplier.paymentTerms || "Credit",
        creditDays: editSupplier.creditDays?.toString() || "30",
        advancePercentage: editSupplier.advancePercentage?.toString() || "",
        billingAddress: editSupplier.billingAddress || ""
      });
    } else if (open) {
      // eslint-disable-next-line
      setFormData({
        name: "",
        category: "Both",
        contactPerson: "",
        phone: "",
        email: "",
        gstState: "",
        gstin: "",
        paymentTerms: "Credit",
        creditDays: "30",
        advancePercentage: "",
        billingAddress: ""
      });
    }
  }, [open, editSupplier]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0 rounded-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {editSupplier ? "Edit Supplier" : "Add Supplier"}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar relative">
          <div className="flex flex-col gap-5 mb-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Supplier Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Category</Label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900 font-medium"
                >
                  <option value="Both">Both</option>
                  <option value="Fabric">Fabric</option>
                  <option value="Trims">Trims</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Contact Person</Label>
                <Input 
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Phone</Label>
                <Input 
                  placeholder="+91 ..."
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Email</Label>
                <Input 
                  placeholder="sales@supplier.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">GST State</Label>
                <select 
                  value={formData.gstState}
                  onChange={(e) => handleChange("gstState", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-600 font-medium"
                >
                  <option value="">— Select state —</option>
                  <option value="Gujarat (24)">Gujarat (24)</option>
                  <option value="Maharashtra (27)">Maharashtra (27)</option>
                  <option value="Delhi (07)">Delhi (07)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-600">GSTIN</Label>
              <Input 
                placeholder="E.G. 24AAICS5619N1ZW"
                value={formData.gstin}
                onChange={(e) => handleChange("gstin", e.target.value)}
                className="h-10 text-sm font-mono border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white placeholder:font-sans" 
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Payment Terms</Label>
                <select 
                  value={formData.paymentTerms}
                  onChange={(e) => handleChange("paymentTerms", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900 font-medium"
                >
                  <option value="Credit">Credit</option>
                  <option value="Advance">Advance</option>
                  <option value="Against Delivery">Against Delivery</option>
                </select>
              </div>
              {formData.paymentTerms === "Credit" && (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Credit Days</Label>
                  <Input 
                    type="number"
                    value={formData.creditDays}
                    onChange={(e) => handleChange("creditDays", e.target.value)}
                    className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  />
                </div>
              )}
              {formData.paymentTerms === "Advance" && (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Advance %</Label>
                  <Input 
                    type="number"
                    value={formData.advancePercentage}
                    onChange={(e) => handleChange("advancePercentage", e.target.value)}
                    className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  />
                </div>
              )}
              {formData.paymentTerms === "Against Delivery" && (
                <div className="flex flex-col gap-2"></div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-600">Billing Address</Label>
              <textarea 
                placeholder="Street, City, State PIN"
                value={formData.billingAddress}
                onChange={(e) => handleChange("billingAddress", e.target.value)}
                className="w-full h-24 p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-6 py-5 sm:justify-end gap-3 rounded-b-xl z-10">
          <Button 
            variant="outline-primary"
            onClick={() => onOpenChange(false)} 
            className="min-w-[110px] h-10 px-5 font-semibold text-sm rounded-lg"
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleSave} 
            className="min-w-[150px] h-10 px-5 font-semibold text-sm rounded-lg shadow-md"
          >
            {editSupplier ? "Update Supplier" : "Save Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
