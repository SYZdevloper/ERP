import { ElementType } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ElementType;
  colorScheme: "blue" | "rose" | "amber" | "purple" | "emerald";
}

const colorStyles = {
  blue: "bg-blue-50 text-blue-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export function MetricCard({ title, value, subtitle, icon: Icon, colorScheme }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorStyles[colorScheme]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-slate-500">{title}</span>
        <span className="text-2xl font-bold text-slate-800 leading-tight">{value}</span>
        <span className="text-[11px] text-slate-400 mt-0.5">{subtitle}</span>
      </div>
    </div>
  );
}
