"use client";

import React, { useState } from 'react';
import { useMaintenance, Priority } from '@/context/maintenance-context';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PRIORITY_DOT: Record<Priority, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
};

const PRIORITY_BADGE: Record<Priority, string> = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function MaintenanceCalendar() {
  const { schedules, machines } = useMaintenance();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const tasks = schedules.map((s) => {
    const m = machines.find(mac => mac.id === s.machine_id);
    return {
      ...s,
      machine_code: m?.machine_code || '',
      machine_name: m?.machine_name || '',
    };
  });

  function goToMonth(delta: number) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  }

  function goToToday() {
    setCurrentDate(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarDays: Array<{ date: string | null; day: number | null; isToday: boolean }> = [];

  for (let i = 0; i < startWeekday; i++) {
    calendarDays.push({ date: null, day: null, isToday: false });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ date: dateStr, day: d, isToday: dateStr === todayStr });
  }

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push({ date: null, day: null, isToday: false });
  }

  function tasksForDate(dateStr: string) {
    return tasks.filter((t) => t.next_due_date === dateStr);
  }

  const selectedTasks = selectedDate ? tasksForDate(selectedDate) : [];
  const monthTasks = tasks.filter((t) => {
    const taskDate = new Date(t.next_due_date);
    return taskDate.getFullYear() === year && taskDate.getMonth() === month;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Maintenance Calendar</h1>
        <p className="text-slate-500 mt-1">Monthly view of all scheduled maintenance tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {MONTH_NAMES[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday} className="text-[#0453B8] border-blue-200 hover:bg-blue-50">
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => goToMonth(-1)} className="w-8 h-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => goToMonth(1)} className="w-8 h-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              if (!cell.date) {
                return <div key={idx} className="min-h-[80px] rounded-lg bg-slate-50/50" />;
              }
              const dayTasks = tasksForDate(cell.date);
              const hasOverdue = dayTasks.some((t) => t.status === 'overdue');
              const isSelected = selectedDate === cell.date;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`min-h-[80px] rounded-lg border p-1.5 text-left transition ${
                    isSelected
                      ? 'border-[#0453B8] ring-2 ring-blue-100 bg-blue-50/50'
                      : cell.isToday
                      ? 'border-blue-400 bg-blue-50/30'
                      : hasOverdue
                      ? 'border-red-200 bg-red-50/30 hover:bg-red-50'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-bold ${cell.isToday ? 'text-[#0453B8]' : 'text-slate-700'}`}>
                    {cell.day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[t.priority]}`} />
                        <span className="text-[10px] font-semibold text-slate-600 truncate">{t.task_name}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400">+{dayTasks.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Low</span>
          </div>
        </div>

        {/* Selected Day / Month Summary */}
        <div className="space-y-6">
          {selectedDate ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mb-4">{selectedTasks.length} task(s) scheduled</p>
              {selectedTasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedTasks.map((task) => (
                    <div key={task.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-bold text-slate-900">{task.task_name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${PRIORITY_BADGE[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">{task.machine_code} — {task.machine_name}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{task.task_type}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          task.status === 'overdue' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold">No tasks scheduled</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {MONTH_NAMES[month]} Summary
              </h3>
              <div className="space-y-1">
                <SummaryRow label="Total Tasks" value={monthTasks.length} color="text-[#0453B8]" />
                <SummaryRow label="Overdue" value={monthTasks.filter((t) => t.status === 'overdue').length} color="text-red-600" />
                <SummaryRow label="Scheduled" value={monthTasks.filter((t) => t.status === 'scheduled').length} color="text-emerald-600" />
                <SummaryRow label="Critical Priority" value={monthTasks.filter((t) => t.priority === 'critical').length} color="text-red-600" />
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-4 text-center">Click a date to see tasks for that day</p>
            </div>
          )}

          {/* Priority Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Priority Distribution</h3>
            {['critical', 'high', 'medium', 'low'].map((p) => {
              const count = monthTasks.filter((t) => t.priority === p).length;
              const pct = monthTasks.length > 0 ? (count / monthTasks.length) * 100 : 0;
              return (
                <div key={p} className="mb-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-slate-500">{p}</span>
                    <span className="text-slate-700">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${PRIORITY_DOT[p as Priority]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-b-0">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
  );
}
