"use client";

import React, { useState } from 'react';
import { useMaintenance, MaintenanceLog } from '@/context/maintenance-context';
import { Search, Plus, Download, History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const RESULT_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

const TASK_TYPES = ['daily', 'weekly', 'monthly', 'quarterly', 'semiannual', 'annual', 'unscheduled'];

export function MaintenanceLogs() {
  const { logs, setLogs, machines } = useMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [formData, setFormData] = useState({
    machine_id: '',
    task_name: '',
    task_type: 'unscheduled',
    technician: '',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: '',
    duration_minutes: 0,
    result: 'completed',
    parts_replaced: '',
    cost: 0,
    notes: '',
  });

  function resetForm() {
    setFormData({
      machine_id: '',
      task_name: '',
      task_type: 'unscheduled',
      technician: '',
      start_time: new Date().toISOString().slice(0, 16),
      end_time: '',
      duration_minutes: 0,
      result: 'completed',
      parts_replaced: '',
      cost: 0,
      notes: '',
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const startTime = new Date(formData.start_time).toISOString();
    let endTime: string | null = null;
    let duration = formData.duration_minutes;

    if (formData.end_time) {
      endTime = new Date(formData.end_time).toISOString();
      const diff = Math.round((new Date(formData.end_time).getTime() - new Date(formData.start_time).getTime()) / 60000);
      if (diff > 0) duration = diff;
    }

    const payload: MaintenanceLog = {
      id: `L-${Math.floor(Math.random() * 10000)}`,
      schedule_id: null,
      machine_id: formData.machine_id,
      task_name: formData.task_name,
      task_type: formData.task_type,
      technician: formData.technician || null,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: duration,
      result: formData.result,
      parts_replaced: formData.parts_replaced || null,
      cost: formData.cost,
      notes: formData.notes || null,
    };

    setLogs(prev => [payload, ...prev]);
    resetForm();
    setShowForm(false);
  }

  function handleExport() {
    const headers = ['Date', 'Machine', 'Task', 'Type', 'Technician', 'Duration (min)', 'Result', 'Parts Replaced', 'Cost', 'Notes'];
    const rows = filtered.map((l) => {
      const m = machines.find(mac => mac.id === l.machine_id);
      return [
        new Date(l.start_time).toLocaleString(),
        `${m?.machine_code || ''} ${m?.machine_name || ''}`,
        l.task_name,
        l.task_type,
        l.technician || '',
        String(l.duration_minutes || ''),
        l.result,
        l.parts_replaced || '',
        String(l.cost || 0),
        (l.notes || '').replace(/,/g, ';'),
      ];
    });

    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = logs.filter((l) => {
    const m = machines.find(mac => mac.id === l.machine_id);
    const matchSearch =
      !search ||
      l.task_name.toLowerCase().includes(search.toLowerCase()) ||
      (m?.machine_code || '').toLowerCase().includes(search.toLowerCase()) ||
      (m?.machine_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.technician || '').toLowerCase().includes(search.toLowerCase());
    const matchResult = resultFilter === 'all' || l.result === resultFilter;
    const matchType = typeFilter === 'all' || l.task_type === typeFilter;
    const logDate = l.start_time.split('T')[0];
    const matchFrom = !dateFrom || logDate >= dateFrom;
    const matchTo = !dateTo || logDate <= dateTo;
    return matchSearch && matchResult && matchType && matchFrom && matchTo;
  });

  const totalCost = filtered.reduce((sum, l) => sum + (l.cost || 0), 0);
  const totalDuration = filtered.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Logs</h1>
          <p className="text-slate-500 mt-1">{logs.length} recorded maintenance activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={filtered.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#0453B8] hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Log Maintenance
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Records</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Duration</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalDuration}<span className="text-sm font-semibold text-slate-400 ml-1">min</span></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Cost</p>
          <p className="text-2xl font-black text-slate-900 mt-1">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{filtered.filter((l) => l.result === 'completed').length}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search task, machine, technician..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="w-[150px]">
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="h-10"><SelectValue placeholder="All Results" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[150px]">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TASK_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[150px] h-10" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[150px] h-10" />
        </div>

      {/* Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Log Maintenance Activity</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
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
                <Label>Task Type</Label>
                <Select value={formData.task_type} onValueChange={v => setFormData({ ...formData, task_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Technician</Label>
                <Input placeholder="Tech - Rajesh" value={formData.technician} onChange={e => setFormData({ ...formData, technician: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Result</Label>
                <Select value={formData.result} onValueChange={v => setFormData({ ...formData, result: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cost</Label>
                <Input type="number" min={0} step="0.01" value={formData.cost} onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Start Time <span className="text-red-500">*</span></Label>
                <Input type="datetime-local" required value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="datetime-local" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input type="number" min={0} value={formData.duration_minutes} onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <Label>Parts Replaced</Label>
                <Input placeholder="Hook assembly x1, bobbin case x1" value={formData.parts_replaced} onChange={e => setFormData({ ...formData, parts_replaced: e.target.value })} />
              </div>
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <Label>Notes</Label>
                <Input placeholder="Additional notes..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="bg-[#0453B8] hover:bg-blue-700">Save Log</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Logs Table */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date / Time</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => {
              const m = machines.find(mac => mac.id === log.machine_id);
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <p className="font-bold text-slate-900">{new Date(log.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs font-semibold text-slate-400">{new Date(log.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-slate-900 font-semibold">{m?.machine_code}</p>
                    <p className="text-xs font-semibold text-slate-500">{m?.machine_name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-slate-900 font-bold">{log.task_name}</p>
                    {log.parts_replaced && (
                      <p className="text-xs font-semibold text-slate-500 mt-1">Parts: {log.parts_replaced}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-semibold text-slate-600 text-xs">{log.task_type}</span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{log.technician || '—'}</TableCell>
                  <TableCell className="text-right font-medium text-slate-600">
                    {log.duration_minutes ? `${log.duration_minutes}m` : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${RESULT_STYLES[log.result]}`}>
                      {log.result}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-700">
                    {log.cost > 0 ? `$${log.cost.toFixed(2)}` : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
            
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-slate-400">
                  <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-semibold">No maintenance logs found.</p>
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
