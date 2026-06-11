"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_MASTER_BUYERS, MasterBuyer } from "@/data/mock-masters";
import { BuyerDialog } from "./buyer-dialog";

export function BuyerCard() {
  const [buyers, setBuyers] = useState<MasterBuyer[]>(INITIAL_MASTER_BUYERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<MasterBuyer | null>(null);

  const handleSave = (buyer: MasterBuyer) => {
    if (editingBuyer) {
      setBuyers(buyers.map(b => b.id === editingBuyer.id ? buyer : b));
    } else {
      setBuyers([{ ...buyer, id: `BYR-${Date.now()}` }, ...buyers]);
    }
    setIsDialogOpen(false);
    setEditingBuyer(null);
  };

  const handleDelete = (id: string) => {
    setBuyers(buyers.filter(b => b.id !== id));
  };

  const openEdit = (buyer: MasterBuyer) => {
    setEditingBuyer(buyer);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingBuyer(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Buyers Master</h2>
          <p className="text-xs text-slate-500 mt-1">Manage buyer profiles, addresses, and credit terms.</p>
        </div>
        <Button onClick={openCreate} className="h-9 px-4 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-medium rounded-lg text-sm shadow-sm transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Buyer
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow>
              <TableHead className="font-semibold text-slate-600 px-6">Company Name</TableHead>
              <TableHead className="font-semibold text-slate-600">GST Number</TableHead>
              <TableHead className="font-semibold text-slate-600">Transport</TableHead>
              <TableHead className="font-semibold text-slate-600">Credit Terms</TableHead>
              <TableHead className="w-[120px] text-right font-semibold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  No buyers found. Add your first buyer!
                </TableCell>
              </TableRow>
            ) : (
              buyers.map((buyer) => (
                <TableRow key={buyer.id} className="hover:bg-slate-50/50 group transition-colors">
                  <TableCell className="font-semibold text-slate-900 px-6 py-4 flex items-center gap-3">
                    {buyer.logo ? (
                      <div className="w-8 h-8 rounded border border-slate-200 bg-white overflow-hidden flex-shrink-0">
                        <img src={buyer.logo} alt="logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
                        {buyer.companyName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="truncate max-w-[200px]">{buyer.companyName}</span>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 py-4">
                    {buyer.gstNumber || "-"}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 py-4">
                    {buyer.transport || "-"}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 py-4">
                    {buyer.creditTerms || "-"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#0453B8] hover:bg-blue-50" onClick={() => openEdit(buyer)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(buyer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BuyerDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        initialData={editingBuyer} 
        onSave={handleSave} 
      />
    </div>
  );
}
