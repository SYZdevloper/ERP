"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { MasterBrand } from "@/data/mock-masters";

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: MasterBrand | null;
  onSave: (data: MasterBrand) => void;
}

export function BrandDialog({ open, onOpenChange, initialData, onSave }: BrandDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MasterBrand>({
    defaultValues: {
      id: "",
      name: "",
      fullName: "",
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ id: "", name: "", fullName: "" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: MasterBrand) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white shadow-2xl border-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Brand' : 'Add Brand'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Name <span className="text-red-500">*</span></Label>
              <Input 
                {...register("name", { required: "Name is required" })} 
                placeholder="e.g. Zara"
                className="h-10 bg-white border-slate-200 focus-visible:ring-[#0453B8]" 
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name of Company</Label>
              <Input 
                {...register("fullName")} 
                placeholder="e.g. Zara fashion group"
                className="h-10 bg-white border-slate-200 focus-visible:ring-[#0453B8]" 
              />
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
