import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

function TrimConfigCard({ title }: { title: string }) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white rounded-t-xl">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-5 flex flex-col sm:flex-row gap-6 bg-white rounded-b-xl">
        <div className="flex flex-col gap-2 shrink-0">
          <Label className="text-sm font-medium text-slate-700">Image</Label>
          <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
            <ImagePlus className="w-6 h-6 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-medium group-hover:text-blue-500 transition-colors">Upload</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700">Code</Label>
            <Input placeholder="Enter code..." className="bg-white" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700">Color</Label>
            <Input placeholder="Enter color..." className="bg-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrimConfigs() {
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full py-2">
      <TrimConfigCard title="Buttons" />
      <TrimConfigCard title="Label" />
      <TrimConfigCard title="Hang Tag" />
    </div>
  );
}
