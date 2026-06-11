import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SalesOrder, Attachment } from "@/types/sales-order";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Paperclip, FileText, Image as ImageIcon, X, Plus, Upload, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AttachmentsModal({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const { watch, setValue, getValues } = useFormContext<SalesOrder>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const [isEditingOther, setIsEditingOther] = useState(false);
  const [otherTitle, setOtherTitle] = useState("Others");

  const attachments = watch("attachments") || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeCategory) {
      const file = e.target.files[0];
      let type = "other";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) type = "pdf";
      else if (file.type.includes("excel") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) type = "xlsx";
      else if (file.type.startsWith("image/")) type = "image";
      
      const newAttachment: Attachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        type,
        category: activeCategory,
        title: activeCategory === 'other' ? otherTitle : undefined
      };

      const currentAttachments = getValues("attachments") || [];
      let filtered = currentAttachments;
      // Replace existing file for specific categories, append for 'other'
      if (activeCategory !== 'other') {
        filtered = currentAttachments.filter(a => a.category !== activeCategory);
      }
      setValue("attachments", [...filtered, newAttachment], { shouldValidate: true, shouldDirty: true });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setActiveCategory(null);
  };

  const removeAttachment = (id: string) => {
    const currentAttachments = getValues("attachments") || [];
    setValue("attachments", currentAttachments.filter(a => a.id !== id), { shouldValidate: true, shouldDirty: true });
  };

  const triggerUpload = (category: string) => {
    if (isReadOnly) return;
    setActiveCategory(category);
    fileInputRef.current?.click();
  };

  const renderCard = (category: 'buyer_po' | 'spec_sheet', defaultTitle: string) => {
    const file = attachments.find(a => a.category === category);

    return (
      <div className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${file ? 'border-blue-200 bg-blue-50/30' : 'border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#0453B8] cursor-pointer'}`} onClick={() => !file && triggerUpload(category)}>
        {file ? (
          <div className="w-full flex flex-col items-center relative group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${file.type === 'pdf' ? 'bg-red-100 text-red-600' : file.type === 'xlsx' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              {file.type === 'pdf' ? <FileText className="w-6 h-6" /> : file.type === 'xlsx' ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
            </div>
            <span className="text-sm font-bold text-slate-800 text-center w-full truncate mb-1">{defaultTitle}</span>
            <span className="text-xs font-semibold text-[#0453B8] text-center w-full truncate px-2">{file.name}</span>
            <span className="text-[10px] font-medium text-slate-400 mt-1">{Math.round(file.size / 1024)} KB</span>
            
            {!isReadOnly && (
              <Button 
                type="button"
                variant="destructive" 
                size="icon" 
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); removeAttachment(file.id); }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
              <Plus className="w-4 h-4 text-[#0453B8]" />
            </div>
            <span className="text-sm font-bold text-slate-700">{defaultTitle}</span>
            <span className="text-[10px] font-semibold text-slate-400 mt-1">Click to attach</span>
          </div>
        )}
      </div>
    );
  };

  const renderFilledOther = (file: any) => {
    return (
      <div key={file.id} className="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all border-blue-200 bg-blue-50/30">
        <div className="w-full flex flex-col items-center relative group">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${file.type === 'pdf' ? 'bg-red-100 text-red-600' : file.type === 'xlsx' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
            {file.type === 'pdf' ? <FileText className="w-6 h-6" /> : file.type === 'xlsx' ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>
          <span className="text-sm font-bold text-slate-800 text-center w-full truncate mb-1">{file.title || "Others"}</span>
          <span className="text-xs font-semibold text-[#0453B8] text-center w-full truncate px-2">{file.name}</span>
          <span className="text-[10px] font-medium text-slate-400 mt-1">{Math.round(file.size / 1024)} KB</span>
          
          {!isReadOnly && (
            <Button 
              type="button"
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); removeAttachment(file.id); }}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyOther = () => {
    return (
      <div className="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#0453B8] cursor-pointer" onClick={() => triggerUpload('other')}>
        {!isReadOnly && (
          <div className="absolute top-2 right-2 z-10">
            {isEditingOther ? (
               <div className="flex items-center gap-1 bg-white shadow-sm p-1 rounded-md border border-slate-200" onClick={(e) => e.stopPropagation()}>
                 <Input value={otherTitle} onChange={(e) => setOtherTitle(e.target.value)} className="h-6 text-xs w-20 px-1 focus-visible:ring-0" autoFocus />
                 <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-green-600 hover:bg-green-50" onClick={(e) => { e.stopPropagation(); setIsEditingOther(false); }}><Check className="w-3 h-3" /></Button>
               </div>
            ) : (
               <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={(e) => { e.stopPropagation(); setIsEditingOther(true); }} title="Rename label"><Edit2 className="w-3 h-3" /></Button>
            )}
          </div>
        )}
        <div className="flex flex-col items-center py-4">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
            <Plus className="w-4 h-4 text-[#0453B8]" />
          </div>
          <span className="text-sm font-bold text-slate-700">{otherTitle}</span>
          <span className="text-[10px] font-semibold text-slate-400 mt-1">Click to attach</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full mt-2 h-10 border-slate-200 text-slate-700 hover:bg-slate-50 flex justify-center items-center font-semibold bg-white shadow-sm rounded-lg">
          <Paperclip className="w-4 h-4 mr-2 text-slate-500" />
          {isReadOnly ? "View Documents" : "Attach Documents"} ({attachments.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-slate-50">
        <DialogHeader>
          <DialogTitle>{isReadOnly ? "Documents" : "Attachments"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {renderCard('buyer_po', 'Add Buyer PO')}
          {renderCard('spec_sheet', 'Add Spec Sheet')}
          {attachments.filter(a => a.category === 'other').map(file => renderFilledOther(file))}
          {!isReadOnly && renderEmptyOther()}
        </div>
        
        {!isReadOnly && (
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
