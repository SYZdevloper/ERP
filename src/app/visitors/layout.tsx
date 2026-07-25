import { Sidebar } from "@/components/layout/sidebar";
import { VisitorProvider } from "@/context/visitor-context";

export default function VisitorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <VisitorProvider>
          {children}
        </VisitorProvider>
      </div>
    </div>
  );
}
