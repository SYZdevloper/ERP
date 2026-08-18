"use client";

import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MasterCard } from "@/components/masters/master-card";
import { MasterDialog, DialogField } from "@/components/masters/master-dialog";
import { useState } from "react";
import { MOCK_CATALOG_PRODUCTS } from "@/data/mock-sales-order";
import { CatalogProduct } from "@/types/sales-order";

export default function ProductsPage() {
  const [data, setData] = useState<CatalogProduct[]>(MOCK_CATALOG_PRODUCTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogProduct | null>(null);

  const handleSave = (item: CatalogProduct) => {
    // Basic rate conversion if the dialog gives string
    const processedItem = {
      ...item,
      rate: typeof item.rate === 'string' ? parseFloat(item.rate) : item.rate
    };

    if (editingItem) {
      setData(data.map(p => p.id === editingItem.id ? { ...processedItem, id: editingItem.id } : p));
    } else {
      setData([{ ...processedItem, id: `cat-${Date.now()}` }, ...data]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const fields: DialogField[] = [
    { name: "code", label: "Product Code", type: "text", required: true, placeholder: "e.g. MT001" },
    { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. Polo T-Shirt" },
    { name: "category", label: "Category", type: "text", placeholder: "e.g. Mens" },
    { name: "subcategory", label: "Sub Category", type: "text", placeholder: "e.g. T-Shirt" },
    { name: "type", label: "Type", type: "text", placeholder: "e.g. Half Sleeves" },
    { name: "sqNumber", label: "SQ Number", type: "text", placeholder: "e.g. 1000000001" },
    { name: "color", label: "Color", type: "text", placeholder: "e.g. Black" },
    { name: "rate", label: "Rate", type: "text", placeholder: "e.g. 250" }, // Use text type as number isn't supported in MasterDialog natively
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
              <div className="w-10 h-10 rounded-full bg-[#0453B8]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#0453B8]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage the master list of all products, variations, and catalog details.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MasterCard
                title="Product"
                description="Manage the list of products."
                data={data}
                columns={[
                  { key: "code", header: "Code" },
                  { key: "name", header: "Name" },
                  { key: "category", header: "Category" },
                  { key: "subcategory", header: "Subcategory" },
                  { key: "color", header: "Color" },
                  { key: "rate", header: "Rate", render: (val) => val ? `$${Number(val).toFixed(2)}` : "-" }
                ]}
                onAdd={() => { setEditingItem(null); setIsDialogOpen(true); }}
                onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
                onDelete={(item) => setData(data.filter(p => p.id !== item.id))}
                renderDialog={
                  <MasterDialog
                    title="Product"
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
