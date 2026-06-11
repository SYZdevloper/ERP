"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_MASTER_BRANDS, MasterBrand } from "@/data/mock-masters";
import { BrandDialog } from "./brand-dialog";

export function BrandCard() {
  const [brands, setBrands] = useState<MasterBrand[]>(INITIAL_MASTER_BRANDS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<MasterBrand | null>(null);

  const handleSave = (brand: MasterBrand) => {
    if (editingBrand) {
      setBrands(brands.map(b => b.id === editingBrand.id ? brand : b));
    } else {
      setBrands([{ ...brand, id: `BRD-${Date.now()}` }, ...brands]);
    }
    setIsDialogOpen(false);
    setEditingBrand(null);
  };

  const handleDelete = (id: string) => {
    setBrands(brands.filter(b => b.id !== id));
  };

  const openEdit = (brand: MasterBrand) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingBrand(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Brands Master</h2>
          <p className="text-xs text-slate-500 mt-1">Manage the list of brands.</p>
        </div>
        <Button onClick={openCreate} className="h-9 px-4 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-medium rounded-lg text-sm shadow-sm transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow>
              <TableHead className="font-semibold text-slate-600 px-6">Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Full Name of Company</TableHead>
              <TableHead className="w-[120px] text-right font-semibold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-slate-500">
                  No brands found. Add your first brand!
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id} className="hover:bg-slate-50/50 group transition-colors">
                  <TableCell className="font-semibold text-slate-900 px-6 py-4">
                    {brand.name}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 py-4">
                    {brand.fullName}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#0453B8] hover:bg-blue-50" onClick={() => openEdit(brand)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(brand.id)}>
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

      <BrandDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        initialData={editingBrand} 
        onSave={handleSave} 
      />
    </div>
  );
}
