"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { MasterColor } from "@/data/mock-masters";

interface ColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: MasterColor | null;
  onSave: (data: MasterColor) => void;
}

export function ColorDialog({ open, onOpenChange, initialData, onSave }: ColorDialogProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<MasterColor>({
    defaultValues: {
      id: "",
      name: "",
      hexCode: "#000000",
    }
  });

  const currentHexCode = watch("hexCode");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ id: "", name: "", hexCode: "#000000" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: MasterColor) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white shadow-2xl border-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Color' : 'Add Color'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Name <span className="text-red-500">*</span></Label>
              <Input 
                {...register("name", { required: "Name is required" })} 
                placeholder="e.g. Navy Blue"
                className="h-10 bg-white border-slate-200 focus-visible:ring-[#0453B8]" 
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hex Code <span className="text-red-500">*</span></Label>
              <div className="flex gap-3">
                <div className="relative w-10 h-10 rounded-lg border border-slate-200 flex-shrink-0 overflow-hidden cursor-pointer shadow-sm focus-within:ring-2 focus-within:ring-[#0453B8] focus-within:ring-offset-1">
                  <input
                    type="color"
                    value={currentHexCode || "#000000"}
                    onChange={(e) => setValue("hexCode", e.target.value, { shouldValidate: true })}
                    className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0 outline-none"
                  />
                </div>
                <Input 
                  {...register("hexCode", { 
                    required: "Hex code is required",
                    pattern: {
                      value: /^#[0-9A-Fa-f]{6}$/,
                      message: "Must be a valid hex code (e.g. #000000)"
                    }
                  })} 
                  placeholder="#000000"
                  className="h-10 bg-white border-slate-200 focus-visible:ring-[#0453B8] font-mono text-sm" 
                />
              </div>
              {errors.hexCode && <p className="text-xs text-red-500">{errors.hexCode.message}</p>}
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-600 hover:text-slate-900 font-medium">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0453B8] hover:bg-blue-700 text-white font-medium px-6">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
