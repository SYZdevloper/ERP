import { ShrinkageForm } from "@/components/production/shrinkage-form";

export const metadata = {
  title: "Fabric Shrinkage - ERP",
  description: "Record Fabric Shrinkage Details",
};

export default function ShrinkagePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50">
      <ShrinkageForm />
    </div>
  );
}
