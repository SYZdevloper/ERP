"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MasterCard } from "@/components/masters/master-card";
import { MasterDialog, DialogField } from "@/components/masters/master-dialog";
import { useState } from "react";
import { INITIAL_MASTER_COLORS, MasterColor } from "@/data/mock-masters";

export default function ColorPage() {
  const [data, setData] = useState<MasterColor[]>(INITIAL_MASTER_COLORS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterColor | null>(null);

  const handleSave = (item: MasterColor) => {
    if (editingItem) {
      setData(data.map(c => c.id === editingItem.id ? item : c));
    } else {
      setData([{ ...item, id: `COL-${Date.now()}` }, ...data]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const fields: DialogField[] = [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Red" },
    { name: "hexCode", label: "Hex Code", type: "color", required: true },
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
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Color Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage color options and hex codes.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MasterCard
                title="Color"
                description="Manage color options."
                data={data}
                columns={[
                  { key: "name", header: "Name" },
                  { key: "hexCode", header: "Hex Code" },
                  { 
                    key: "preview", 
                    header: "Preview",
                    render: (_, row) => (
                      <div 
                        className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" 
                        style={{ backgroundColor: row.hexCode }}
                      />
                    )
                  }
                ]}
                onAdd={() => { setEditingItem(null); setIsDialogOpen(true); }}
                onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
                onDelete={(item) => setData(data.filter(c => c.id !== item.id))}
                renderDialog={
                  <MasterDialog
                    title="Color"
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

