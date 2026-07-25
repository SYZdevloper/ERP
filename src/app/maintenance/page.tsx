"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { MaintenanceDashboard } from "@/components/maintenance/dashboard";
import { MachinesList } from "@/components/maintenance/machines";
import { MaintenanceSchedule } from "@/components/maintenance/schedule";
import { MaintenanceLogs } from "@/components/maintenance/logs";
import { MaintenanceCalendar } from "@/components/maintenance/calendar";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <ListPageHeader
          title="Machine Maintenance"
          description="Manage machines, schedule maintenance, and track repair logs."
        />
      </div>

      <Tabs defaultValue="dashboard" className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="mb-4 bg-white border border-slate-200 shadow-sm self-start px-2 py-1 rounded-xl h-14 space-x-2">
          <TabsTrigger value="dashboard" className="h-10 px-4 font-bold data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-lg transition-all">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="machines" className="h-10 px-4 font-bold data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-lg transition-all">
            Machines
          </TabsTrigger>
          <TabsTrigger value="schedule" className="h-10 px-4 font-bold data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-lg transition-all">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="calendar" className="h-10 px-4 font-bold data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-lg transition-all">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="logs" className="h-10 px-4 font-bold data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-lg transition-all">
            History Logs
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <TabsContent value="dashboard" className="h-full m-0 pb-10">
            <MaintenanceDashboard />
          </TabsContent>
          <TabsContent value="machines" className="h-full m-0 pb-10">
            <MachinesList />
          </TabsContent>
          <TabsContent value="schedule" className="h-full m-0 pb-10">
            <MaintenanceSchedule />
          </TabsContent>
          <TabsContent value="calendar" className="h-full m-0 pb-10">
            <MaintenanceCalendar />
          </TabsContent>
          <TabsContent value="logs" className="h-full m-0 pb-10">
            <MaintenanceLogs />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
