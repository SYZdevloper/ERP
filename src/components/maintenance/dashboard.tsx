"use client";

import React, { useMemo } from 'react';
import { useMaintenance, Machine, Schedule, MaintenanceLog } from '@/context/maintenance-context';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Calendar, TrendingUp, Activity, Cog } from 'lucide-react';

export function MaintenanceDashboard() {
  const { machines, schedules, logs } = useMaintenance();

  const data = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const weekStr = weekFromNow.toISOString().split('T')[0];

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthStr = monthAgo.toISOString();

    const completedThisMonth = logs.filter(l => l.start_time >= monthStr).length;

    const overdue = schedules.filter(s => s.status === 'overdue');
    const dueTodayList = schedules.filter(s => s.next_due_date <= today && s.status === 'scheduled');
    const dueThisWeekList = schedules.filter(s => s.next_due_date > today && s.next_due_date <= weekStr && s.status === 'scheduled');

    const statusMap: Record<string, number> = {};
    machines.forEach(m => {
      statusMap[m.status] = (statusMap[m.status] || 0) + 1;
    });

    const upcomingTasks = schedules
      .filter(s => s.status === 'scheduled' && s.next_due_date >= today)
      .sort((a, b) => a.next_due_date.localeCompare(b.next_due_date))
      .slice(0, 8)
      .map(s => {
        const m = machines.find(mac => mac.id === s.machine_id);
        return {
          ...s,
          machine_code: m?.machine_code || 'N/A',
          machine_name: m?.machine_name || 'N/A',
        };
      });

    const overdueList = overdue.map(s => {
      const m = machines.find(mac => mac.id === s.machine_id);
      return {
        ...s,
        machine_code: m?.machine_code || 'N/A',
        machine_name: m?.machine_name || 'N/A',
      };
    });

    return {
      totalMachines: machines.length,
      operationalMachines: statusMap['operational'] || 0,
      inMaintenance: statusMap['maintenance'] || 0,
      breakdowns: statusMap['breakdown'] || 0,
      overdueTasks: overdue.length,
      dueToday: dueTodayList.length,
      dueThisWeek: dueThisWeekList.length,
      completedThisMonth,
      upcomingTasks,
      overdueList,
      machineStatusBreakdown: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
    };
  }, [machines, schedules, logs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Maintenance Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of machine fleet and preventive maintenance status</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Machines"
          value={data.totalMachines}
          icon={<Cog className="w-6 h-6" />}
          color="blue"
          sublabel={`${data.operationalMachines} operational`}
        />
        <StatCard
          title="Overdue Tasks"
          value={data.overdueTasks}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          sublabel={data.overdueTasks > 0 ? 'Needs attention' : 'All on track'}
        />
        <StatCard
          title="Due This Week"
          value={data.dueToday + data.dueThisWeek}
          icon={<Calendar className="w-6 h-6" />}
          color="amber"
          sublabel={`${data.dueToday} due today`}
        />
        <StatCard
          title="Completed (30d)"
          value={data.completedThisMonth}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="green"
          sublabel="Maintenance tasks done"
        />
      </div>

      {/* Machine Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusPill label="Operational" count={data.operationalMachines} total={data.totalMachines} color="green" />
        <StatusPill label="In Maintenance" count={data.inMaintenance} total={data.totalMachines} color="amber" />
        <StatusPill label="Breakdown" count={data.breakdowns} total={data.totalMachines} color="red" />
        <StatusPill
          label="Retired"
          count={data.machineStatusBreakdown.find((s) => s.status === 'retired')?.count || 0}
          total={data.totalMachines}
          color="gray"
        />
      </div>

      {/* Overdue + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">Overdue Maintenance</h2>
            {data.overdueTasks > 0 && (
              <span className="ml-auto bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full">
                {data.overdueTasks} overdue
              </span>
            )}
          </div>
          {data.overdueList.length > 0 ? (
            <div className="space-y-3">
              {data.overdueList.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100"
                >
                  <div className={`w-2 h-10 rounded-full ${priorityBar(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{task.task_name}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {task.machine_code} — {task.machine_name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-red-600">
                      {daysOverdue(task.next_due_date)}d overdue
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{task.task_type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-400" />
              <p className="text-sm font-semibold">No overdue tasks — great job!</p>
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#0453B8]" />
            <h2 className="text-lg font-bold text-slate-800">Upcoming Maintenance</h2>
          </div>
          {data.upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition"
                >
                  <div className={`w-2 h-10 rounded-full ${priorityBar(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{task.task_name}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {task.machine_code} — {task.machine_name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-700">{formatDateShort(task.next_due_date)}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{task.task_type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Calendar className="w-10 h-10 mb-2 text-slate-300" />
              <p className="text-sm font-semibold">No upcoming tasks scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard icon={<Activity className="w-5 h-5" />} title="Fleet Health" value={`${Math.round((data.operationalMachines / Math.max(data.totalMachines, 1)) * 100)}%`} subtitle="Operational rate" />
        <SummaryCard icon={<Wrench className="w-5 h-5" />} title="Active Maintenance" value={String(data.inMaintenance)} subtitle="Machines in PM" />
        <SummaryCard icon={<TrendingUp className="w-5 h-5" />} title="Task Completion" value={String(data.completedThisMonth)} subtitle="Tasks completed in 30 days" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, sublabel }: any) {
  const colors: Record<string, any> = {
    blue: { bg: 'bg-blue-50', icon: 'text-[#0453B8]', ring: 'ring-blue-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', ring: 'ring-red-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', ring: 'ring-amber-100' },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} rounded-xl p-5 border border-slate-200 ring-1 ${c.ring} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">{sublabel}</p>
        </div>
        <div className={`${c.icon} mt-1`}>{icon}</div>
      </div>
    </div>
  );
}

function StatusPill({ label, count, total, color }: any) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-slate-50 border-slate-200 text-slate-600',
  };
  return (
    <div className={`${colors[color]} rounded-xl border px-4 py-3 flex items-center justify-between shadow-sm`}>
      <span className="text-sm font-bold">{label}</span>
      <span className="text-lg font-black">
        {count}
        <span className="text-xs font-bold opacity-60">/{total}</span>
      </span>
    </div>
  );
}

function SummaryCard({ icon, title, value, subtitle }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[#0453B8]">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-semibold text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function priorityBar(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-amber-400';
    case 'low': return 'bg-emerald-400';
    default: return 'bg-slate-300';
  }
}

function daysOverdue(dateStr: string): number {
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `In ${diff}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
