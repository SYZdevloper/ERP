"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MasterCard } from "@/components/masters/master-card";
import { MasterDialog, DialogField } from "@/components/masters/master-dialog";
import { useState } from "react";
import { INITIAL_MASTER_BUYERS, MasterBuyer } from "@/data/mock-masters";

export default function BuyerMasterPage() {
  const [data, setData] = useState<MasterBuyer[]>(INITIAL_MASTER_BUYERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterBuyer | null>(null);

  const handleSave = (item: MasterBuyer) => {
    if (editingItem) {
      setData(data.map(b => b.id === editingItem.id ? item : b));
    } else {
      setData([{ ...item, id: `BYR-${Date.now()}` }, ...data]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const fields: DialogField[] = [
    { name: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Enter full company name" },
    { name: "gstNumber", label: "GST Number", type: "text", required: true, placeholder: "e.g. 22AAAAA0000A1Z5" },
    { name: "logo", label: "Buyer Logo", type: "image", gridCols: 2 },
    { name: "billingAddress", label: "Billing Address", type: "textarea", placeholder: "Street, City, State PIN", gridCols: 1 },
    { 
      name: "shippingAddresses", 
      label: "Shipping Address", 
      type: "custom", 
      gridCols: 1,
      render: (formData, handleChange) => {
        const addresses = formData.shippingAddresses || [""];
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Shipping Addresses</span>
              <button 
                type="button" 
                className="flex items-center text-xs text-[#0453B8] hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                onClick={() => handleChange("shippingAddresses", [...addresses, ""])}
              >
                <span className="text-lg leading-none mr-1">+</span> Add New
              </button>
            </div>
            {addresses.map((addr: string, idx: number) => (
              <div key={idx} className="relative">
                <textarea 
                  placeholder={`Shipping Address ${idx + 1}`}
                  value={addr}
                  onChange={(e) => {
                    const newAddrs = [...addresses];
                    newAddrs[idx] = e.target.value;
                    handleChange("shippingAddresses", newAddrs);
                  }}
                  className="w-full min-h-[100px] text-sm font-medium border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0453B8] text-slate-900 bg-white resize-none rounded-md border p-3" 
                />
                {addresses.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => {
                      const newAddrs = addresses.filter((_: any, i: number) => i !== idx);
                      handleChange("shippingAddresses", newAddrs);
                    }}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      }
    },
    { 
      name: "defaultBrand", 
      label: "Default Brand", 
      type: "custom", 
      gridCols: 2,
      render: (formData, handleChange) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Default Brand</span>
            <button type="button" className="flex items-center text-xs text-[#0453B8] hover:bg-blue-50 px-2 py-1 rounded transition-colors">
              <span className="text-lg leading-none mr-1">+</span> Add New Brand
            </button>
          </div>
          <input 
            type="text"
            placeholder="e.g. Zara"
            value={formData.defaultBrand || ""}
            onChange={(e) => handleChange("defaultBrand", e.target.value)}
            className="h-10 px-3 text-sm font-medium border border-blue-200 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0453B8] text-slate-900 bg-blue-50/30" 
          />
        </div>
      )
    },
    { 
      name: "paymentTerms", 
      label: "Payment Terms", 
      type: "custom", 
      gridCols: 2,
      render: (formData, handleChange) => (
        <div className="grid grid-cols-2 gap-5 w-full">
          <div className="flex flex-col gap-2">
            <select 
              value={formData.paymentTerms || "Credit"}
              onChange={(e) => handleChange("paymentTerms", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white text-slate-900 font-medium"
            >
              <option value="Credit">Credit</option>
              <option value="Advance">Advance</option>
              <option value="Against Delivery">Against Delivery</option>
            </select>
          </div>
          {(!formData.paymentTerms || formData.paymentTerms === "Credit") && (
            <div className="flex flex-col gap-2">
              <input 
                type="number"
                placeholder="Credit Days (e.g. 30)"
                value={formData.creditDays || ""}
                onChange={(e) => handleChange("creditDays", e.target.value)}
                className="h-10 px-3 text-sm font-medium border border-slate-200 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
              />
            </div>
          )}
          {formData.paymentTerms === "Advance" && (
            <div className="flex flex-col gap-2">
              <input 
                type="number"
                placeholder="Advance %"
                value={formData.advancePercentage || ""}
                onChange={(e) => handleChange("advancePercentage", e.target.value)}
                className="h-10 px-3 text-sm font-medium border border-slate-200 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
              />
            </div>
          )}
        </div>
      )
    },
    { name: "transport", label: "Preferred Transport", type: "text", placeholder: "Preferred transport service" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/masters" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buyer Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage buyer details, addresses, and credit terms.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MasterCard
                title="Buyer"
                description="Manage buyer profiles, addresses, and credit terms."
                data={data}
                columns={[
                  { key: "companyName", header: "Company Name" },
                  { key: "gstNumber", header: "GST Number" },
                  { key: "transport", header: "Transport" },
                  { key: "paymentTerms", header: "Payment Terms" },
                ]}
                onAdd={() => { setEditingItem(null); setIsDialogOpen(true); }}
                onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
                onDelete={(item) => setData(data.filter(b => b.id !== item.id))}
                renderDialog={
                  <MasterDialog
                    title="Buyer"
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    initialData={editingItem}
                    fields={fields}
                    onSave={handleSave}
                  />
                }
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

