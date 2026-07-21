"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";

export interface DialogField {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "color" | "custom";
  required?: boolean;
  placeholder?: string;
  gridCols?: 1 | 2; // Default is 1
  render?: (formData: any, handleChange: (field: string, value: any) => void, errors: any) => React.ReactNode;
}

export interface MasterDialogProps<T> {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: T | null;
  fields: DialogField[];
  onSave: (data: T) => void;
}

export function MasterDialog<T extends { [key: string]: any }>({
  title,
  open,
  onOpenChange,
  initialData,
  fields,
  onSave
}: MasterDialogProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({});
      }
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData as T);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {initialData ? `Edit ${title}` : `Add New ${title}`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar relative">
          <form id={`form-${title}`} onSubmit={handleSave} className="flex flex-col gap-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map(field => {
                const colSpan = field.gridCols === 2 || field.type === "textarea" ? "col-span-1 md:col-span-2" : "col-span-1";
                
                return (
                  <div key={field.name} className={`flex flex-col gap-2 ${colSpan}`}>
                    <Label className="text-xs font-bold text-slate-600">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    
                    {field.type === "text" && (
                      <Input 
                        value={formData[field.name] || ""} 
                        onChange={(e) => handleChange(field.name, e.target.value)} 
                        className={`h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] bg-white ${errors[field.name] ? 'border-red-500' : ''}`} 
                        placeholder={field.placeholder}
                      />
                    )}

                    {field.type === "color" && (
                      <div className="flex items-center gap-3">
                        <Input 
                          type="color"
                          value={formData[field.name] || "#000000"} 
                          onChange={(e) => handleChange(field.name, e.target.value)} 
                          className="h-10 w-20 p-1 cursor-pointer bg-white border-slate-200" 
                        />
                        <Input 
                          type="text"
                          value={formData[field.name] || ""} 
                          onChange={(e) => handleChange(field.name, e.target.value)} 
                          className={`h-10 flex-1 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] bg-white ${errors[field.name] ? 'border-red-500' : ''}`} 
                          placeholder="#000000"
                        />
                      </div>
                    )}

                    {field.type === "textarea" && (
                      <Textarea 
                        value={formData[field.name] || ""} 
                        onChange={(e) => handleChange(field.name, e.target.value)} 
                        className={`min-h-[100px] text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] bg-white resize-none ${errors[field.name] ? 'border-red-500' : ''}`} 
                        placeholder={field.placeholder}
                      />
                    )}

                    {field.type === "image" && (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors h-28">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0453B8] flex items-center justify-center mb-2">
                          <ImagePlus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-[#0453B8]">Click to upload {field.label.toLowerCase()}</span>
                        <span className="text-[11px] text-slate-500 mt-1">PNG, JPG or SVG up to 2MB</span>
                      </div>
                    )}

                    {field.type === "custom" && field.render && field.render(formData, handleChange, errors)}
                    
                    {errors[field.name] && <p className="text-xs text-red-500">{errors[field.name]}</p>}
                  </div>
                );
              })}
            </div>
          </form>
        </div>

        <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-6 py-5 sm:justify-end gap-3 rounded-b-xl z-10">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="min-w-[110px] h-10 px-5 font-semibold text-sm rounded-lg border-slate-300 text-slate-700">
            Cancel
          </Button>
          <Button type="submit" form={`form-${title}`} className="min-w-[150px] h-10 px-5 font-semibold text-sm rounded-lg shadow-md bg-[#0453B8] hover:bg-blue-700 text-white">
            {initialData ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
