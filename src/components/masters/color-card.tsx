"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_MASTER_COLORS, MasterColor } from "@/data/mock-masters";
import { ColorDialog } from "./color-dialog";

export function ColorCard() {
  const [colors, setColors] = useState<MasterColor[]>(INITIAL_MASTER_COLORS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<MasterColor | null>(null);

  const handleSave = (color: MasterColor) => {
    if (editingColor) {
      setColors(colors.map(c => c.id === editingColor.id ? color : c));
    } else {
      setColors([{ ...color, id: `COL-${Date.now()}` }, ...colors]);
    }
    setIsDialogOpen(false);
    setEditingColor(null);
  };

  const handleDelete = (id: string) => {
    setColors(colors.filter(c => c.id !== id));
  };

  const openEdit = (color: MasterColor) => {
    setEditingColor(color);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingColor(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Colors Master</h2>
          <p className="text-xs text-slate-500 mt-1">Manage color options.</p>
        </div>
        <Button onClick={openCreate} className="h-9 px-4 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-medium rounded-lg text-sm shadow-sm transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Color
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow>
              <TableHead className="font-semibold text-slate-600 px-6">Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Hex Code</TableHead>
              <TableHead className="font-semibold text-slate-600">Preview</TableHead>
              <TableHead className="w-[120px] text-right font-semibold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  No colors found. Add your first color!
                </TableCell>
              </TableRow>
            ) : (
              colors.map((color) => (
                <TableRow key={color.id} className="hover:bg-slate-50/50 group transition-colors">
                  <TableCell className="font-semibold text-slate-900 px-6 py-4">
                    {color.name}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 py-4 font-mono text-sm">
                    {color.hexCode}
                  </TableCell>
                  <TableCell className="py-4">
                    <div 
                      className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" 
                      style={{ backgroundColor: color.hexCode }}
                    />
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#0453B8] hover:bg-blue-50" onClick={() => openEdit(color)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(color.id)}>
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

      <ColorDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        initialData={editingColor} 
        onSave={handleSave} 
      />
    </div>
  );
}
