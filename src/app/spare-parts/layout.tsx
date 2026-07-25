import { Sidebar } from "@/components/layout/sidebar";
import { SparePartsProvider } from "@/context/spare-parts-context";
import { MaintenanceProvider } from "@/context/maintenance-context"; // Needed for machine list

export default function SparePartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <MaintenanceProvider>
          <SparePartsProvider>
            {children}
          </SparePartsProvider>
        </MaintenanceProvider>
      </div>
    </div>
  );
}
