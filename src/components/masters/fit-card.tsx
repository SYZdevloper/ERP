"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_MASTER_FITS, MasterFit } from "@/data/mock-masters";
import { FitDialog } from "./fit-dialog";

export function FitCard() {
  const [fits, setFits] = useState<MasterFit[]>(INITIAL_MASTER_FITS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFit, setEditingFit] = useState<MasterFit | null>(null);

  const handleSave = (fit: MasterFit) => {
    if (editingFit) {
      setFits(fits.map(f => f.id === editingFit.id ? fit : f));
    } else {
      setFits([{ ...fit, id: `FIT-${Date.now()}` }, ...fits]);
    }
    setIsDialogOpen(false);
    setEditingFit(null);
  };

  const handleDelete = (id: string) => {
    setFits(fits.filter(f => f.id !== id));
  };

  const openEdit = (fit: MasterFit) => {
    setEditingFit(fit);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingFit(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Fits Master</h2>
          <p className="text-xs text-slate-500 mt-1">Manage fit types used across the application.</p>
        </div>
        <Button onClick={openCreate} className="h-9 px-4 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-medium rounded-lg text-sm shadow-sm transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Fit
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow>
              <TableHead className="font-semibold text-slate-600 px-6">Name</TableHead>
              <TableHead className="w-[120px] text-right font-semibold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center text-slate-500">
                  No fits found. Add your first fit!
                </TableCell>
              </TableRow>
            ) : (
              fits.map((fit) => (
                <TableRow key={fit.id} className="hover:bg-slate-50/50 group transition-colors">
                  <TableCell className="font-semibold text-slate-900 px-6 py-4">
                    {fit.name}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#0453B8] hover:bg-blue-50" onClick={() => openEdit(fit)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(fit.id)}>
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

      <FitDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        initialData={editingFit} 
        onSave={handleSave} 
      />
    </div>
  );
}
