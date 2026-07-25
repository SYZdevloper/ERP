"use client";

import React, { createContext, useContext, useState } from "react";

export type MachineStatus = 'operational' | 'maintenance' | 'breakdown' | 'retired';
export type TaskType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'unscheduled';
export type ScheduleStatus = 'scheduled' | 'overdue' | 'completed';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Machine {
  id: string;
  machine_code: string;
  machine_name: string;
  brand: string | null;
  model: string | null;
  machine_type: string;
  location: string | null;
  install_date: string | null;
  status: MachineStatus;
  notes: string | null;
}

export interface Schedule {
  id: string;
  machine_id: string;
  task_name: string;
  task_type: TaskType;
  description: string | null;
  assigned_technician: string | null;
  estimated_duration_minutes: number;
  next_due_date: string;
  last_completed_date: string | null;
  status: ScheduleStatus;
  priority: Priority;
}

export interface MaintenanceLog {
  id: string;
  machine_id: string;
  schedule_id: string | null;
  task_name: string;
  task_type: string;
  technician: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  result: string;
  parts_replaced: string | null;
  cost: number;
  notes: string | null;
}

interface MaintenanceContextType {
  machines: Machine[];
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  logs: MaintenanceLog[];
  setLogs: React.Dispatch<React.SetStateAction<MaintenanceLog[]>>;
}

const initialMachines: Machine[] = [
  { id: "M-1", machine_code: "SM-001", machine_name: "Juki DDL-8700", brand: "Juki", model: "DDL-8700", machine_type: "Lockstitch", location: "Line 1", install_date: "2024-01-15", status: "operational", notes: "" },
  { id: "M-2", machine_code: "SM-002", machine_name: "Brother Overlock", brand: "Brother", model: "S-7200", machine_type: "Overlock", location: "Line 1", install_date: "2024-02-10", status: "operational", notes: "" },
  { id: "M-3", machine_code: "SM-003", machine_name: "Jack F4", brand: "Jack", model: "F4", machine_type: "Lockstitch", location: "Line 2", install_date: "2024-03-05", status: "maintenance", notes: "Needs oiling" },
];

const initialSchedules: Schedule[] = [
  { id: "S-1", machine_id: "M-1", task_name: "Monthly Oiling", task_type: "monthly", description: "Full oil change and basic cleaning", assigned_technician: "Tech - Rajesh", estimated_duration_minutes: 30, next_due_date: "2026-07-28", last_completed_date: "2026-06-25", status: "scheduled", priority: "medium" },
  { id: "S-2", machine_id: "M-3", task_name: "Needle Replacement", task_type: "weekly", description: "Replace worn needles", assigned_technician: "Tech - Kumar", estimated_duration_minutes: 15, next_due_date: "2026-07-20", last_completed_date: "2026-07-13", status: "overdue", priority: "high" },
];

const initialLogs: MaintenanceLog[] = [
  { id: "L-1", machine_id: "M-1", schedule_id: "S-1", task_name: "Monthly Oiling", task_type: "monthly", technician: "Tech - Rajesh", start_time: "2026-06-25T10:00:00Z", end_time: "2026-06-25T10:30:00Z", duration_minutes: 30, result: "completed", parts_replaced: "Oil filter", cost: 15.50, notes: "Ran smoothly" }
];

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [logs, setLogs] = useState<MaintenanceLog[]>(initialLogs);

  return (
    <MaintenanceContext.Provider value={{ machines, setMachines, schedules, setSchedules, logs, setLogs }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
}
