"use client";

import Link from "next/link";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MasterCard } from "@/components/masters/master-card";
import { MasterDialog, DialogField } from "@/components/masters/master-dialog";
import { useState } from "react";
import { INITIAL_MASTER_PATTERNS, MasterPattern } from "@/data/mock-masters";

export default function PatternsPage() {
  const [data, setData] = useState<MasterPattern[]>(INITIAL_MASTER_PATTERNS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterPattern | null>(null);

  const handleSave = (item: MasterPattern) => {
    if (editingItem) {
      setData(data.map(p => p.code === editingItem.code ? item : p));
    } else {
      setData([{ ...item, code: `PAT-${Date.now()}` }, ...data]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const fields: DialogField[] = [
    { name: "code", label: "Pattern Code", type: "text", required: true, placeholder: "e.g. PTRN-001" },
    { name: "brand", label: "Brand", type: "text", required: true, placeholder: "e.g. Zara" },
    { name: "fit", label: "Fit", type: "text", required: true, placeholder: "e.g. Slim Fit" },
    { name: "image", label: "Pattern Image", type: "image" },
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
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patterns Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage pattern codes, brands, and descriptions.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MasterCard
                title="Pattern"
                description="Manage pattern codes and fits."
                data={data}
                columns={[
                  { key: "code", header: "Code" },
                  { key: "brand", header: "Brand" },
                  { key: "fit", header: "Fit" },
                  { 
                    key: "image", 
                    header: "Image",
                    render: (val) => (
                      val ? 
                        <img src={val} alt="Pattern" className="w-10 h-10 object-cover rounded-md border border-slate-200" /> : 
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        </div>
                    )
                  }
                ]}
                onAdd={() => { setEditingItem(null); setIsDialogOpen(true); }}
                onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
                onDelete={(item) => setData(data.filter(p => p.code !== item.code))}
                renderDialog={
                  <MasterDialog
                    title="Pattern"
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

