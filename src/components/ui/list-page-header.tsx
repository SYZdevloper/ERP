import { ReactNode } from "react";

interface ListPageHeaderProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
}

export function ListPageHeader({ title, description, actionButton }: ListPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
        <p className="text-sm text-slate-500 font-medium">{description}</p>
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
