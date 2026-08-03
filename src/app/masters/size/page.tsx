"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MasterCard } from "@/components/masters/master-card";
import { MasterDialog, DialogField } from "@/components/masters/master-dialog";
import { useState } from "react";

interface MasterSize {
  id: string;
  name: string;
  type: string;
  sizes: string;
}

const INITIAL_MASTER_SIZES: MasterSize[] = [
  { id: "SZE-1", name: "Standard Shirts", type: "Upper Wear", sizes: "XS, S, M, L, XL" },
  { id: "SZE-2", name: "Extended Shirts", type: "Upper Wear", sizes: "XXL, 3XL, 4XL, 5XL, 6XL" },
  { id: "SZE-3", name: "Standard Pants", type: "Lower Wear", sizes: "28, 30, 32, 34, 36" },
  { id: "SZE-4", name: "Extended Pants", type: "Lower Wear", sizes: "38, 40, 42, 44, 46" },
];

export default function SizePage() {
  const [data, setData] = useState<MasterSize[]>(INITIAL_MASTER_SIZES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterSize | null>(null);

  const handleSave = (item: MasterSize) => {
    if (editingItem) {
      setData(data.map(b => b.id === editingItem.id ? item : b));
    } else {
      setData([{ ...item, id: `SZE-${Date.now()}` }, ...data]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const fields: DialogField[] = [
    { name: "name", label: "Group Name", type: "text", required: true, placeholder: "e.g. Kids Standard" },
    { 
      name: "type", 
      label: "Garment Type", 
      type: "custom", 
      render: (formData, handleChange) => (
        <select 
          value={formData.type || "Upper Wear"}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0453B8] bg-white"
        >
          <option value="Upper Wear">Upper Wear</option>
          <option value="Lower Wear">Lower Wear</option>
          <option value="Accessories">Accessories</option>
        </select>
      ),
      gridCols: 1 
    },
    { name: "sizes", label: "Sizes (comma separated)", type: "textarea", placeholder: "e.g. S, M, L, XL", required: true, gridCols: 2 },
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
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Size Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage size groupings and available sizes across products.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MasterCard
                title="Size Group"
                description="Manage size structures."
                data={data}
                columns={[
                  { key: "name", header: "Group Name" },
                  { key: "type", header: "Garment Type" },
                  { key: "sizes", header: "Sizes" }
                ]}
                onAdd={() => { setEditingItem(null); setIsDialogOpen(true); }}
                onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
                onDelete={(item) => setData(data.filter(b => b.id !== item.id))}
                renderDialog={
                  <MasterDialog
                    title="Size Group"
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
