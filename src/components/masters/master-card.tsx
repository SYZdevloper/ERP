"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

interface MasterColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (val: any, row: T) => React.ReactNode;
}

export interface MasterCardProps<T> {
  title: string;
  description: string;
  data: T[];
  columns: MasterColumn<T>[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  renderDialog?: React.ReactNode;
}

export function MasterCard<T extends { id?: string; code?: string; [key: string]: any }>({
  title,
  description,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  renderDialog
}: MasterCardProps<T>) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{title} Master</h2>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <Button onClick={onAdd} className="h-9 px-4 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-medium rounded-lg text-sm shadow-sm transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add {title}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow>
              {columns.map(c => (
                <TableHead key={String(c.key)} className="font-semibold text-slate-600 px-6">{c.header}</TableHead>
              ))}
              <TableHead className="w-[120px] text-right font-semibold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-32 text-center text-slate-500">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => {
                const rowKey = item.id || item.code || String(idx);
                return (
                  <TableRow key={rowKey} className="hover:bg-slate-50/50 group transition-colors">
                    {columns.map(c => (
                      <TableCell key={String(c.key)} className="font-semibold text-slate-900 px-6 py-4">
                        {c.render ? c.render(item[c.key as keyof T], item) : (item[c.key as keyof T] as React.ReactNode)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#0453B8] hover:bg-blue-50" onClick={() => onEdit(item)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(item)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderDialog}
    </div>
  );
}
