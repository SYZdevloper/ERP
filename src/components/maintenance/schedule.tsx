"use client";

import React, { useState } from 'react';
import { useMaintenance, Schedule, TaskType, ScheduleStatus, Priority } from '@/context/maintenance-context';
import { Plus, Edit2, Trash2, Search, X, CheckCircle2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TASK_TYPES: { value: TaskType; label: string; days: number }[] = [
  { value: 'daily', label: 'Daily', days: 1 },
  { value: 'weekly', label: 'Weekly', days: 7 },
  { value: 'monthly', label: 'Monthly', days: 30 },
  { value: 'quarterly', label: 'Quarterly', days: 90 },
  { value: 'semiannual', label: 'Semi-Annual', days: 180 },
  { value: 'annual', label: 'Annual', days: 365 },
];

const PRIORITIES: { value: Priority; label: string; badge: string }[] = [
  { value: 'low', label: 'Low', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'medium', label: 'Medium', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'high', label: 'High', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'critical', label: 'Critical', badge: 'bg-red-50 text-red-700 border-red-200' },
];

const STATUS_STYLES: Record<ScheduleStatus, string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function MaintenanceSchedule() {
  const { schedules, setSchedules, machines, setLogs } = useMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    machine_id: '',
    task_name: '',
    task_type: 'monthly' as TaskType,
    description: '',
    assigned_technician: '',
    estimated_duration_minutes: 30,
    next_due_date: new Date().toISOString().split('T')[0],
    priority: 'medium' as Priority,
  });

  function resetForm() {
    setFormData({
      machine_id: '',
      task_name: '',
      task_type: 'monthly',
      description: '',
      assigned_technician: '',
      estimated_duration_minutes: 30,
      next_due_date: new Date().toISOString().split('T')[0],
      priority: 'medium',
    });
    setEditing(null);
  }

  function handleEdit(schedule: Schedule) {
    setEditing(schedule);
    setFormData({
      machine_id: schedule.machine_id,
      task_name: schedule.task_name,
      task_type: schedule.task_type,
      description: schedule.description || '',
      assigned_technician: schedule.assigned_technician || '',
      estimated_duration_minutes: schedule.estimated_duration_minutes,
      next_due_date: schedule.next_due_date,
      priority: schedule.priority,
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Schedule = {
      id: editing ? editing.id : `S-${Math.floor(Math.random() * 10000)}`,
      last_completed_date: editing ? editing.last_completed_date : null,
      status: editing ? editing.status : 'scheduled',
      ...formData,
      description: formData.description || null,
      assigned_technician: formData.assigned_technician || null,
    };

    if (editing) {
      setSchedules(prev => prev.map(s => s.id === editing.id ? payload : s));
    } else {
      setSchedules(prev => [...prev, payload]);
    }
    
    resetForm();
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this maintenance schedule?')) return;
    setSchedules(prev => prev.filter(s => s.id !== id));
  }

  function handleComplete(schedule: Schedule) {
    const now = new Date().toISOString();
    
    // Add log
    setLogs(prev => [[{
      id: `L-${Math.floor(Math.random() * 10000)}`,
      machine_id: schedule.machine_id,
      schedule_id: schedule.id,
      task_name: schedule.task_name,
      task_type: schedule.task_type,
      technician: schedule.assigned_technician,
      start_time: now,
      end_time: now,
      duration_minutes: schedule.estimated_duration_minutes,
      result: 'completed',
      parts_replaced: null,
      cost: 0,
      notes: 'Marked complete from schedule',
    }] as any, ...prev]);

    const nextDue = computeNextDue(schedule.next_due_date, schedule.task_type);
    
    // Update schedule
    setSchedules(prev => prev.map(s => s.id === schedule.id ? {
      ...s,
      last_completed_date: new Date().toISOString().split('T')[0],
      next_due_date: nextDue,
      status: 'scheduled'
    } : s));
  }

  const filtered = schedules.filter((s) => {
    const m = machines.find(mac => mac.id === s.machine_id);
    const matchSearch =
      !search ||
      s.task_name.toLowerCase().includes(search.toLowerCase()) ||
      (m?.machine_code || '').toLowerCase().includes(search.toLowerCase()) ||
      (m?.machine_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.assigned_technician || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || s.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Schedule</h1>
          <p className="text-slate-500 mt-1">{schedules.length} scheduled tasks across the fleet</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#0453B8] hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Task
        </Button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by task, machine, technician..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[180px]">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-10"><SelectValue placeholder="All Priorities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        </div>
      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Scheduled Task' : 'Schedule New Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2 lg:col-span-1 space-y-2">
                <Label>Machine <span className="text-red-500">*</span></Label>
                <Select required value={formData.machine_id} onValueChange={v => setFormData({ ...formData, machine_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select machine..." /></SelectTrigger>
                  <SelectContent>
                    {machines.map(m => <SelectItem key={m.id} value={m.id}>{m.machine_code} — {m.machine_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Task Name <span className="text-red-500">*</span></Label>
                <Input required placeholder="Oil and clean" value={formData.task_name} onChange={e => setFormData({ ...formData, task_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Task Type <span className="text-red-500">*</span></Label>
                <Select value={formData.task_type} onValueChange={v => setFormData({ ...formData, task_type: v as TaskType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assigned Technician</Label>
                <Input placeholder="Tech - Rajesh" value={formData.assigned_technician} onChange={e => setFormData({ ...formData, assigned_technician: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Est. Duration (min)</Label>
                <Input type="number" min={1} value={formData.estimated_duration_minutes} onChange={e => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) || 30 })} />
              </div>
              <div className="space-y-2">
                <Label>Next Due Date <span className="text-red-500">*</span></Label>
                <Input type="date" required value={formData.next_due_date} onChange={e => setFormData({ ...formData, next_due_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <Label>Description</Label>
                <Input placeholder="Detailed maintenance instructions..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="bg-[#0453B8] hover:bg-blue-700">{editing ? 'Update Task' : 'Save Task'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Table */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task / Machine</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => {
              const priority = PRIORITIES.find((p) => p.value === s.priority);
              const m = machines.find(mac => mac.id === s.machine_id);
              const isExpanded = expandedId === s.id;
              const isOverdue = s.status === 'overdue';
              
              return (
                <React.Fragment key={s.id}>
                  <TableRow className={`${isOverdue ? 'bg-red-50/40' : ''}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExpandedId(isExpanded ? null : s.id)} className="text-slate-400 hover:text-slate-600">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <div>
                          <p className="font-bold text-slate-900">{s.task_name}</p>
                          <p className="text-xs font-semibold text-slate-500">
                            {m?.machine_code} — {m?.machine_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize font-semibold text-slate-700">{s.task_type}</span>
                      <span className="text-xs font-semibold text-slate-400 block">{s.estimated_duration_minutes} min</span>
                    </TableCell>
                    <TableCell>
                      <p className={`font-bold ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                        {new Date(s.next_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {s.last_completed_date && (
                        <p className="text-xs font-semibold text-slate-400">
                          Last: {new Date(s.last_completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priority?.badge}`}>
                        {priority?.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[s.status]}`}>
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {s.status !== 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => handleComplete(s)} className="h-8 border-emerald-200 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleEdit(s)} className="h-8 w-8">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableCell colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                            <p className="text-slate-700 font-medium">{s.description || 'No description provided'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                            <p className="text-slate-700 font-medium">{s.assigned_technician || 'Unassigned'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Duration</p>
                            <p className="text-slate-700 font-medium">{s.estimated_duration_minutes} minutes</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            
            {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">No scheduled tasks found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function computeNextDue(currentDue: string, taskType: TaskType): string {
  const due = new Date(currentDue);
  const typeInfo = TASK_TYPES.find((t) => t.value === taskType);
  if (typeInfo) {
    due.setDate(due.getDate() + typeInfo.days);
  } else {
    due.setMonth(due.getMonth() + 1);
  }
  return due.toISOString().split('T')[0];
}
