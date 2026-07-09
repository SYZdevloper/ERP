"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    { name: "accountDeptNo", label: "Account Dept Number", type: "text" },
    { name: "warehouseDeptNo", label: "Warehouse Dept Number", type: "text" },
    { name: "transport", label: "Transport", type: "text", placeholder: "Preferred transport service" },
    { name: "creditTerms", label: "Credit Terms", type: "text", placeholder: "e.g. 30 Days, 60 Days" },
    { name: "defaultAgent", label: "Agent by Default", type: "text" },
    { name: "defaultBrand", label: "Default Brand", type: "text", placeholder: "e.g. Zara" },
    { name: "billingAddress", label: "Billing Address", type: "textarea", placeholder: "Street, City, State PIN" },
    { name: "shippingAddress", label: "Shipping Address", type: "textarea", placeholder: "Street, City, State PIN" },
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
                  { key: "creditTerms", header: "Credit Terms" },
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

