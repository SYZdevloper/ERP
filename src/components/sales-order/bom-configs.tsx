import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Plus, X } from "lucide-react";
import { useRef } from "react";

interface TrimData {
  code?: string;
  color?: string;
  image?: string;
}

interface TrimConfigsProps {
  values?: {
    buttons?: TrimData;
    label?: TrimData;
    hangTag?: TrimData;
  };
  onChange?: (key: 'buttons' | 'label' | 'hangTag', field: 'code' | 'color' | 'image', value: string) => void;
}

function TrimConfigCard({
  title,
  trimKey,
  data,
  onChange,
}: {
  title: string;
  trimKey: 'buttons' | 'label' | 'hangTag';
  data?: TrimData;
  onChange?: (key: 'buttons' | 'label' | 'hangTag', field: 'code' | 'color' | 'image', value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange?.(trimKey, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(trimKey, 'image', '');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="w-full shadow-sm border border-slate-200 overflow-hidden">
      <CardHeader className="py-2.5 px-4 border-b border-slate-100 bg-slate-50">
        <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4 flex flex-row gap-4 bg-white items-start">
        {/* Image Upload */}
        <div className="flex flex-col gap-1 shrink-0">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 border-2 border-dashed border-slate-200 hover:border-[#0453B8] rounded-lg flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group relative overflow-hidden"
          >
            {data?.image ? (
              <>
                <img src={data.image} alt={title} className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={removeImage}
                  className="absolute top-0.5 right-0.5 bg-white/90 hover:bg-red-50 text-red-500 p-0.5 rounded-full shadow-sm transition-all"
                  title="Remove"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 mb-0.5 text-slate-400 group-hover:text-[#0453B8] transition-colors" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-[#0453B8] transition-colors">Upload</span>
              </>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        {/* Code & Color */}
        <div className="flex-1 grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Code</Label>
            <Input
              placeholder="Enter code..."
              value={data?.code || ""}
              onChange={(e) => onChange?.(trimKey, 'code', e.target.value)}
              className="bg-white border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Color</Label>
            <Input
              placeholder="Enter color..."
              value={data?.color || ""}
              onChange={(e) => onChange?.(trimKey, 'color', e.target.value)}
              className="bg-white border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm font-medium"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrimConfigs({ values = {}, onChange }: TrimConfigsProps) {
  return (
    <div className="w-full space-y-3">
      {/* Row 1: Buttons + Label side by side */}
      <div className="grid grid-cols-2 gap-3">
        <TrimConfigCard title="Buttons" trimKey="buttons" data={values.buttons} onChange={onChange} />
        <TrimConfigCard title="Label" trimKey="label" data={values.label} onChange={onChange} />
      </div>
      {/* Row 2: Hang Tag (half width) */}
      <div className="grid grid-cols-2 gap-3">
        <TrimConfigCard title="Hang Tag" trimKey="hangTag" data={values.hangTag} onChange={onChange} />
        <div /> {/* spacer */}
      </div>
    </div>
  );
}
