"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MasterCard } from "@/components/masters/master-card";
import { MasterDialog, DialogField } from "@/components/masters/master-dialog";
import { useState } from "react";
import { INITIAL_MASTER_BRANDS, MasterBrand } from "@/data/mock-masters";

export default function BrandPage() {
  const [data, setData] = useState<MasterBrand[]>(INITIAL_MASTER_BRANDS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterBrand | null>(null);

  const handleSave = (item: MasterBrand) => {
    if (editingItem) {
      setData(data.map(b => b.id === editingItem.id ? item : b));
    } else {
      setData([{ ...item, id: `BRD-${Date.now()}` }, ...data]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const fields: DialogField[] = [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Zara" },
    { name: "fullName", label: "Full Name of Company", type: "text", placeholder: "e.g. Zara fashion group" },
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
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Brand Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage brands you manufacture or sell.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MasterCard
                title="Brand"
                description="Manage the list of brands."
                data={data}
                columns={[
                  { key: "name", header: "Name" },
                  { key: "fullName", header: "Full Name of Company" }
                ]}
                onAdd={() => { setEditingItem(null); setIsDialogOpen(true); }}
                onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
                onDelete={(item) => setData(data.filter(b => b.id !== item.id))}
                renderDialog={
                  <MasterDialog
                    title="Brand"
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

